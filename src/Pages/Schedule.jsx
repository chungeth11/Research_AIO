import { useEffect, useMemo, useRef, useState } from 'react'
import LabSelector from '../UIparts/LabSelector'
const scheduleExamples = [
{
    id: 1,
    title: 'Dose-response assay',
    date: '2026-08-03',
    time: '09:30',
    students: 'Ava Chen, Marcus Ross',
    drugs: 'Reagent batch A, Compound X',
    tools: 'Microscope, centrifuge, incubator',
    notes: 'Run full panel on the new reagent batch.',
    instructions: '1. Prepare the reagent panel and align each sample on the plate.\n2. Run the dose sweep and confirm instrument calibration.\n3. Record the result for each concentration before analysis.',
    color: '#93c5fd',
  },
{
    id: 2,
    title: 'Bioreactor check',
    date: '2026-08-05',
    time: '11:00',
    students: 'Janelle Ortiz',
    drugs: 'Growth medium, nutrient feed',
    tools: 'pH meter, temperature logger',
    notes: 'Verify growth curve and capture baseline metrics.',
    instructions: '1. Confirm the reactor is stable at the current set point.\n2. Log pH, temperature, and feed rate against the baseline.\n3. Flag any drift before the next scheduled read.',
    color: '#f9a8d4',
  },
{
    id: 3,
    title: 'Compound screen',
    date: '2026-08-07',
    time: '15:00',
    students: 'Ethan Price, Sia Patel',
    drugs: 'Lead compound set, stabilizer',
    tools: 'Plate reader, assay tray',
    notes: 'Score the top three candidates for stability.',
    instructions: '1. Load the plate reader with the ranked candidate set.\n2. Capture the stability score for each lead panel.\n3. Compare the top three results and document the recommendation.',
    color: '#86efac',
  }
];

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const startHour = 0
const endHour = 24
const slotHeight = 56
const experimentStorageKey = 'research-aio-experiments'
const scheduleStorageKey = 'research-aio-scheduled-experiments'
const labMembersStorageKey = 'research-aio-lab-members'

const colorPalette = ['#93c5fd', '#f9a8d4', '#86efac', '#fcd34d', '#c4b5fd', '#fdba74', '#67e8f9', '#fca5a5', '#a7f3d0', '#bfdbfe', '#fde68a', '#ddd6fe']

function getWeekStart(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  const day = result.getDay()
  const difference = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + difference)
  return result
}

function shiftWeek(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount * 7)
  return next
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatWeekRange(date) {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `${formatDate(start)} – ${formatDate(end)}`
}

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getTimeValue(time) {
  const [hours = '0', minutes = '0'] = time.split(':')
  const hourValue = Number(hours)
  const totalMinutes = hourValue * 60 + Number(minutes)
  return hourValue < startHour ? totalMinutes + 24 * 60 : totalMinutes
}

function getEventRange(experiment) {
  const start = getTimeValue(experiment.time)
  let end = experiment.endTime ? getTimeValue(experiment.endTime) : start + 60

  if (end <= start) {
    end += 24 * 60
  }

  return { start, end }
}

function getEventEndTime(experiment) {
  if (experiment.endTime) return experiment.endTime

  const [hours = '0', minutes = '0'] = experiment.time.split(':')
  const endMinutes = (Number(hours) * 60 + Number(minutes) + 60) % (24 * 60)
  return `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`
}

function shiftDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day + days, 12)
  return getDateKey(date)
}

function getAssignedMembers(experiment) {
  const members = experiment.students ?? experiment.assignedLabMembers ?? []
  return Array.isArray(members)
    ? members
    : String(members).split(',').map((member) => member.trim()).filter(Boolean)
}

function formatTimeLabel(time) {
  const [hours = '0', minutes = '0'] = time.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatHour(hour) {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
  }).format(date)
}

function getEventLayout(dayExperiments) {
  const sortedExperiments = [...dayExperiments].sort((left, right) => getTimeValue(left.time) - getTimeValue(right.time))
  const overlapGroups = []
  let currentGroup = []
  let currentGroupEnd = -Infinity

  sortedExperiments.forEach((experiment) => {
    const { start, end } = getEventRange(experiment)

    if (currentGroup.length && start >= currentGroupEnd) {
      overlapGroups.push(currentGroup)
      currentGroup = []
      currentGroupEnd = -Infinity
    }

    currentGroup.push(experiment)
    currentGroupEnd = Math.max(currentGroupEnd, end)
  })

  if (currentGroup.length) overlapGroups.push(currentGroup)

  const layouts = overlapGroups.flatMap((group) => {
    const laneEnds = []
    const groupLayouts = group.map((experiment) => {
      const { start, end } = getEventRange(experiment)
      const availableLane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
      const laneIndex = availableLane === -1 ? laneEnds.length : availableLane
      laneEnds[laneIndex] = end

      return { experiment, laneIndex }
    })
    const laneCount = Math.max(...groupLayouts.map(({ laneIndex }) => laneIndex + 1), 1)

    return groupLayouts.map((layout) => ({ ...layout, laneCount }))
  })

  return layouts.map(({ experiment, laneIndex, laneCount }) => ({
    experiment,
    laneIndex,
    laneCount,
    shouldHideDetails: (() => {
      const { start: startTime, end: endTime } = getEventRange(experiment)
      const overlappingExperiments = sortedExperiments.filter((candidate) => {
        const { start: candidateStart, end: candidateEnd } = getEventRange(candidate)
        return candidateStart < endTime && candidateEnd > startTime
      })
      const peakOverlap = overlappingExperiments.reduce((maximum, candidate) => {
        const { start: candidateStart } = getEventRange(candidate)
        const concurrentCount = overlappingExperiments.filter((other) => {
          const { start: otherStart, end: otherEnd } = getEventRange(other)
          return otherStart <= candidateStart && otherEnd > candidateStart
        }).length
        return Math.max(maximum, concurrentCount)
      }, 0)

      return peakOverlap >= 3
    })(),
  }))
}

function ExperimentDetailsModal({ experiment, onClose, onDelete, onDeleteSeries }) {
  if (!experiment) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="scheduled-experiment-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
                {experiment.date} · {formatTimeLabel(experiment.time)} – {formatTimeLabel(getEventEndTime(experiment))}
            </p>
              {experiment.repeatFrequency && experiment.repeatFrequency !== 'never' && (
                <p className="mt-1 text-xs text-slate-500">
                  Repeats {experiment.repeatFrequency} until {experiment.repeatUntil}
                </p>
              )}
            <h2 id="scheduled-experiment-title" className="mt-1 text-xl font-bold text-slate-900">
              {experiment.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          {!experiment.isCustomEvent && (
            <>
              <div>
                <dt className="font-semibold text-slate-700">Lab members</dt>
                <dd className="mt-1 text-slate-600">{experiment.students || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Materials</dt>
                <dd className="mt-1 text-slate-600">{experiment.drugs || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Equipment</dt>
                <dd className="mt-1 text-slate-600">{experiment.tools || 'Not specified'}</dd>
              </div>
            </>
          )}
          <div>
            <dt className="font-semibold text-slate-700">
              {experiment.description ? 'Description' : 'Notes'}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-600">
              {experiment.description || experiment.notes || 'No notes added.'}
            </dd>
          </div>
          {experiment.instructions && (
            <div>
              <dt className="font-semibold text-slate-700">Instructions</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-600">{experiment.instructions}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          {experiment.recurrenceId
            && experiment.repeatFrequency
            && experiment.repeatFrequency !== 'never' && (
            <button
              type="button"
              onClick={() => {
                onDeleteSeries(experiment.recurrenceId)
                onClose()
              }}
              className="mr-auto rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50"
            >
              Remove all repeated events
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onDelete(experiment.id)
              onClose()
            }}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Remove from schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  )
}

function Schedule({
  lab,
  selectedLabId,
  onSelectedLabChange,
  userEmail,
  calendarFocus,
  onCalendarFocusHandled,
}) {
  const scopedExperimentStorageKey = selectedLabId === 1
    ? experimentStorageKey
    : `${experimentStorageKey}-lab-${selectedLabId}`
  const scopedExperimentRecordsStorageKey = `research-aio-experiment-records-lab-${selectedLabId}`
  const scopedScheduleStorageKey = selectedLabId === 1
    ? scheduleStorageKey
    : `${scheduleStorageKey}-lab-${selectedLabId}`
  const scopedLabMembersStorageKey = selectedLabId === 1
    ? labMembersStorageKey
    : `${labMembersStorageKey}-lab-${selectedLabId}`
  const labSeedExperiments = (selectedLabId === 1 ? scheduleExamples : [])
  const [visibleWeekStart, setVisibleWeekStart] = useState(() =>
    calendarFocus?.date
      ? getWeekStart(new Date(`${calendarFocus.date}T12:00:00`))
      : getWeekStart(new Date()),
  )
  const calendarViewportRef = useRef(null)
  const [savedExperiments] = useState(() => {
    if (typeof window === 'undefined') {
      return labSeedExperiments
    }

    try {
      const storedRecords = window.localStorage.getItem(scopedExperimentRecordsStorageKey)
      if (storedRecords) {
        const experimentRecords = JSON.parse(storedRecords)
        if (!Array.isArray(experimentRecords)) {
          throw new Error('Experiment records are not in the expected format.')
        }
        return experimentRecords.map((experiment) => ({
          ...experiment,
          title: experiment.name,
        }))
      }

      const storedValue = window.localStorage.getItem(scopedExperimentStorageKey)
      return storedValue ? JSON.parse(storedValue) : labSeedExperiments
    } catch (error) {
      console.error('Could not load saved experiments for the schedule:', error)
      return labSeedExperiments
    }
  })
  const [scheduledExperiments, setScheduledExperiments] = useState(() => {
    if (typeof window === 'undefined') {
      return labSeedExperiments
    }

    try {
      const storedValue = window.localStorage.getItem(scopedScheduleStorageKey)
      if (storedValue) {
        return JSON.parse(storedValue)
      }

      const legacyExperiments = selectedLabId === 1
        ? window.localStorage.getItem(experimentStorageKey)
        : null
      return legacyExperiments ? JSON.parse(legacyExperiments) : labSeedExperiments
    } catch {
      return labSeedExperiments
    }
  })
  const [labMembers] = useState(() => {
    if (typeof window === 'undefined') {
      return selectedLabId === 1
        ? ['Dr. Lee', 'Ava Chen', 'Marcus Ross', 'Janelle Ortiz', 'Ethan Price']
        : []
    }

    try {
      const storedValue = window.localStorage.getItem(scopedLabMembersStorageKey)
      return storedValue
        ? JSON.parse(storedValue)
        : selectedLabId === 1
          ? ['Dr. Lee', 'Ava Chen', 'Marcus Ross', 'Janelle Ortiz', 'Ethan Price']
          : []
    } catch {
      return selectedLabId === 1
        ? ['Dr. Lee', 'Ava Chen', 'Marcus Ross', 'Janelle Ortiz', 'Ethan Price']
        : []
    }
  })
  const [showForm, setShowForm] = useState(false)
  const [showQuickEventForm, setShowQuickEventForm] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [selectedMember, setSelectedMember] = useState('all')
  const [formState, setFormState] = useState({
    selectedExperimentId: '',
    assignedLabMembers: [],
    date: getDateKey(getWeekStart(new Date())),
    time: '09:00',
    endTime: '10:00',
    repeatFrequency: 'never',
    repeatUntil: shiftDateKey(getDateKey(new Date()), 28),
    color: colorPalette[0],
  })
  const [formError, setFormError] = useState('')
  const [quickEvent, setQuickEvent] = useState({
    title: '',
    description: '',
    date: getDateKey(new Date()),
    time: '09:00',
    endTime: '10:00',
    tools: '',
    repeatFrequency: 'never',
    repeatUntil: shiftDateKey(getDateKey(new Date()), 28),
  })
  const [quickEventError, setQuickEventError] = useState('')

  const visibleWeekDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(visibleWeekStart)
        date.setDate(visibleWeekStart.getDate() + index)
        return date
      }),
    [visibleWeekStart],
  )

  const hourSlots = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, index) => startHour + index),
    [],
  )

  useEffect(() => {
    window.localStorage.setItem(scopedExperimentStorageKey, JSON.stringify(savedExperiments))
  }, [savedExperiments, scopedExperimentStorageKey])

  useEffect(() => {
    window.localStorage.setItem(scopedScheduleStorageKey, JSON.stringify(scheduledExperiments))
  }, [scheduledExperiments, scopedScheduleStorageKey])

  useEffect(() => {
    try {
      const storedRecords = window.localStorage.getItem(scopedExperimentRecordsStorageKey)
      if (!storedRecords) return

      const experimentRecords = JSON.parse(storedRecords)
      if (!Array.isArray(experimentRecords)) {
        throw new Error('Experiment records are not in the expected format.')
      }

      const updatedRecords = experimentRecords.map((experiment) => {
        const matchingEvents = scheduledExperiments
          .filter((scheduledExperiment) =>
            !scheduledExperiment.isCustomEvent
            && (
              String(scheduledExperiment.sourceExperimentId ?? '') === String(experiment.id)
              || (
                scheduledExperiment.sourceExperimentId === undefined
                && scheduledExperiment.title === experiment.name
              )
            ),
          )
          .filter((scheduledExperiment) => scheduledExperiment.date)
          .sort((left, right) =>
            left.date.localeCompare(right.date)
            || (left.time ?? '').localeCompare(right.time ?? ''),
          )
        const matchingDates = matchingEvents.map((scheduledExperiment) => scheduledExperiment.date)

        const calendarSchedule = matchingDates.length
            ? {
                startDate: matchingDates[0],
                endDate: matchingDates[matchingDates.length - 1],
                dates: [...new Set(matchingDates)],
                events: matchingEvents.map(({ date, time, endTime }) => ({
                  date,
                  time,
                  endTime,
                })),
              }
            : null

        return { ...experiment, calendarSchedule }
      })

      window.localStorage.setItem(
        scopedExperimentRecordsStorageKey,
        JSON.stringify(updatedRecords),
      )
    } catch (error) {
      console.error('Could not synchronize calendar dates with experiments:', error)
    }
  }, [scheduledExperiments, scopedExperimentRecordsStorageKey])

  useEffect(() => {
    if (!calendarFocus?.date || !calendarViewportRef.current) return

    const targetEvent = Array.from(
      calendarViewportRef.current.querySelectorAll('[data-calendar-event="true"]'),
    ).find((element) =>
      element.dataset.date === calendarFocus.date
      && (!calendarFocus.time || element.dataset.time === calendarFocus.time),
    )

    if (!targetEvent) return

    targetEvent.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    onCalendarFocusHandled?.()
  }, [calendarFocus, onCalendarFocusHandled, scheduledExperiments, visibleWeekStart])

  const experimentMap = useMemo(() => {
    const visibleExperiments = selectedMember === 'all'
      ? scheduledExperiments
      : scheduledExperiments.filter((experiment) => getAssignedMembers(experiment).includes(selectedMember))

    return visibleExperiments.reduce((accumulator, experiment) => {
      const list = accumulator[experiment.date] ?? []
      list.push(experiment)
      accumulator[experiment.date] = list
      return accumulator
    }, {})
  }, [scheduledExperiments, selectedMember])

  const thisWeekExperiments = useMemo(
    () => visibleWeekDates.flatMap((date) => experimentMap[getDateKey(date)] ?? []),
    [experimentMap, visibleWeekDates],
  )

  const handleOpenForm = () => {
    setShowQuickEventForm(false)
    setShowForm((current) => !current)
    setFormError('')
    setFormState((current) => ({
      ...current,
      date: getDateKey(visibleWeekStart),
      repeatUntil: current.repeatUntil < getDateKey(visibleWeekStart)
        ? shiftDateKey(getDateKey(visibleWeekStart), 28)
        : current.repeatUntil,
    }))
  }

  const handleOpenQuickEventForm = () => {
    setShowForm(false)
    setQuickEventError('')
    setShowQuickEventForm((current) => !current)
  }

  const handleQuickEventSubmit = (event) => {
    event.preventDefault()

    if (!quickEvent.title.trim() || !quickEvent.description.trim() || !quickEvent.date || !quickEvent.time || !quickEvent.endTime) {
      setQuickEventError('Enter an event name, description, date, start time, and end time.')
      return
    }

    if (quickEvent.repeatFrequency !== 'never' && quickEvent.repeatUntil < quickEvent.date) {
      setQuickEventError('Repeat-until date must be on or after the event date.')
      return
    }

    const startMinutes = getTimeValue(quickEvent.time)
    let endMinutes = getTimeValue(quickEvent.endTime)
    if (endMinutes <= startMinutes) endMinutes += 24 * 60
    if (endMinutes - startMinutes > 24 * 60) {
      setQuickEventError('Event duration must be less than 24 hours.')
      return
    }

    const occurrenceDates = [quickEvent.date]
    if (quickEvent.repeatFrequency !== 'never') {
      const repeatStep = quickEvent.repeatFrequency === 'daily' ? 1 : 7
      for (
        let occurrenceDate = shiftDateKey(quickEvent.date, repeatStep);
        occurrenceDate <= quickEvent.repeatUntil;
        occurrenceDate = shiftDateKey(occurrenceDate, repeatStep)
      ) {
        occurrenceDates.push(occurrenceDate)
      }
    }
    const recurrenceId = quickEvent.repeatFrequency === 'never'
      ? null
      : `event-series-${Date.now()}-${Math.random().toString(36).slice(2)}`

    setScheduledExperiments((current) => [
      ...occurrenceDates.map((date, index) => ({
        id: recurrenceId ? `${recurrenceId}-${index}` : `event-${Date.now()}`,
        isCustomEvent: true,
        title: quickEvent.title.trim(),
        description: quickEvent.description.trim(),
        date,
        time: quickEvent.time,
        endTime: quickEvent.endTime,
        students: '',
        drugs: '',
        tools: quickEvent.tools.trim(),
        color: colorPalette[0],
        ...(recurrenceId
          ? {
              recurrenceId,
              repeatFrequency: quickEvent.repeatFrequency,
              repeatUntil: quickEvent.repeatUntil,
            }
          : {}),
      })),
      ...current,
    ])
    setVisibleWeekStart(getWeekStart(new Date(`${quickEvent.date}T12:00:00`)))
    setQuickEvent({
      title: '',
      description: '',
      date: getDateKey(new Date()),
      time: '09:00',
      endTime: '10:00',
      tools: '',
      repeatFrequency: 'never',
      repeatUntil: shiftDateKey(getDateKey(new Date()), 28),
    })
    setQuickEventError('')
    setShowQuickEventForm(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formState.selectedExperimentId || !formState.date || !formState.time || !formState.endTime) {
      setFormError('Choose an experiment, date, start time, and end time.')
      return
    }

    const startMinutes = getTimeValue(formState.time)
    let endMinutes = getTimeValue(formState.endTime)
    if (endMinutes <= startMinutes) endMinutes += 24 * 60
    if (endMinutes - startMinutes > 24 * 60) {
      setFormError('Event duration must be less than 24 hours.')
      return
    }
    if (formState.repeatFrequency !== 'never' && formState.repeatUntil < formState.date) {
      setFormError('Repeat-until date must be on or after the start date.')
      return
    }

    const baseExperiment = savedExperiments.find((experiment) => String(experiment.id) === String(formState.selectedExperimentId))

    if (!baseExperiment) {
      return
    }

    const repeatStep = formState.repeatFrequency === 'daily' ? 1 : 7
    const occurrenceDates = [formState.date]
    if (formState.repeatFrequency !== 'never') {
      for (
        let occurrenceDate = shiftDateKey(formState.date, repeatStep);
        occurrenceDate <= formState.repeatUntil;
        occurrenceDate = shiftDateKey(occurrenceDate, repeatStep)
      ) {
        occurrenceDates.push(occurrenceDate)
      }
    }
    const recurrenceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const occurrences = occurrenceDates.map((date, index) => ({
        ...baseExperiment,
        id: `${recurrenceId}-${index}`,
        sourceExperimentId: baseExperiment.sourceExperimentId ?? baseExperiment.id,
        recurrenceId,
        date,
        time: formState.time,
        endTime: formState.endTime,
        repeatFrequency: formState.repeatFrequency,
        repeatUntil: formState.repeatFrequency === 'never' ? '' : formState.repeatUntil,
        students: formState.assignedLabMembers.join(', '),
        color: formState.color || baseExperiment.color || '#93c5fd',
      }))

    setScheduledExperiments((current) => [...occurrences, ...current])

    setFormState({
      selectedExperimentId: '',
      assignedLabMembers: [],
      date: getDateKey(visibleWeekStart),
      time: '09:00',
      endTime: '10:00',
      repeatFrequency: 'never',
      repeatUntil: shiftDateKey(getDateKey(visibleWeekStart), 28),
      color: colorPalette[0],
    })
    setFormError('')
    setShowForm(false)
  }

  const handleDeleteExperiment = (experimentId) => {
    setScheduledExperiments((current) => current.filter((experiment) => experiment.id !== experimentId))
  }

  const handleDeleteSeries = (recurrenceId) => {
    setScheduledExperiments((current) =>
      current.filter((experiment) => experiment.recurrenceId !== recurrenceId),
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 pb-8 ">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-500">Schedule</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Weekly Lab Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-500">{lab.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LabSelector
            selectedLabId={selectedLabId}
            onSelectedLabChange={onSelectedLabChange}
            userEmail={userEmail}
          />
          <button
            type="button"
            onClick={handleOpenForm}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            {showForm ? 'Hide experiment form' : 'Add experiment'}
          </button>
          <button
            type="button"
            onClick={handleOpenQuickEventForm}
            className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            {showQuickEventForm ? 'Hide event form' : 'Add event'}
          </button>
        </div>
      </header>

      <div className="mt-6 max-w-sm">
        <label htmlFor="schedule-person-filter" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Show schedule for
        </label>
        <select
          id="schedule-person-filter"
          value={selectedMember}
          onChange={(event) => setSelectedMember(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All people</option>
          {labMembers.map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Upcoming</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{thisWeekExperiments.length} scheduled items this week</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">dates</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatWeekRange(visibleWeekStart)} view</p>
        </article>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Pick a saved experiment
              <select
                value={formState.selectedExperimentId}
                onChange={(event) => setFormState((current) => ({ ...current, selectedExperimentId: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500 "
              >
                <option value="" className="max-h-28 overflow-y-auto">
                  Choose an experiment
                </option>
                {savedExperiments.map((experiment) => (
                  <option key={experiment.id} value={experiment.id} className="max-h-28 overflow-y-auto">
                    {experiment.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Start Date
              <input
                type="date"
                value={formState.date}
                onChange={(event) => setFormState((current) => ({ ...current, date: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Start time
              <input
                type="time"
                value={formState.time}
                onChange={(event) => setFormState((current) => ({ ...current, time: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              End time
              <input
                type="time"
                value={formState.endTime}
                onChange={(event) => setFormState((current) => ({ ...current, endTime: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Repeat
              <select
                value={formState.repeatFrequency}
                onChange={(event) => setFormState((current) => ({ ...current, repeatFrequency: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              >
                <option value="never">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>

            {formState.repeatFrequency !== 'never' && (
              <label className="text-sm font-medium text-slate-700">
                Repeat until
                <input
                  type="date"
                  min={formState.date}
                  value={formState.repeatUntil}
                  onChange={(event) => setFormState((current) => ({ ...current, repeatUntil: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                />
              </label>
            )}

            <label className="text-sm font-medium text-slate-700 md:col-span-2 ">
              Lab members
              <select
                multiple
                value={formState.assignedLabMembers}
                onChange={(event) => {
                  const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value)
                  setFormState((current) => ({ ...current, assignedLabMembers: selectedOptions }))
                }}
                className="mt-1 h-28 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 overflow-y-auto max-h-28"
              >
                {labMembers.map((member) => (
                  <option key={member} value={member} className="max-h-28 overflow-y-auto">
                    {member}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Calendar color
              <div className="mt-2 flex flex-wrap gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormState((current) => ({ ...current, color }))}
                    className={`h-8 w-8 rounded-full border-2 transition ${formState.color === color ? 'border-slate-900' : 'border-white'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Choose ${color} as the calendar color`}
                  />
                ))}
              </div>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            {formError && <p role="alert" className="mr-auto text-sm text-rose-700">{formError}</p>}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Add to calendar
            </button>
          </div>
        </form>
      )}

      {showQuickEventForm && (
        <form
          onSubmit={handleQuickEventSubmit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add a calendar event</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Event name
              <input
                type="text"
                required
                value={quickEvent.title}
                onChange={(event) => setQuickEvent((current) => ({ ...current, title: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Event description
              <textarea
                required
                rows={3}
                value={quickEvent.description}
                onChange={(event) => setQuickEvent((current) => ({ ...current, description: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Equipment needed
              <input
                type="text"
                value={quickEvent.tools}
                onChange={(event) => setQuickEvent((current) => ({ ...current, tools: event.target.value }))}
                placeholder="Separate equipment names with commas"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Date
              <input
                type="date"
                required
                value={quickEvent.date}
                onChange={(event) => setQuickEvent((current) => ({
                  ...current,
                  date: event.target.value,
                  repeatUntil: current.repeatUntil < event.target.value
                    ? event.target.value
                    : current.repeatUntil,
                }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Start time
              <input
                type="time"
                required
                value={quickEvent.time}
                onChange={(event) => setQuickEvent((current) => ({ ...current, time: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              End time
              <input
                type="time"
                required
                value={quickEvent.endTime}
                onChange={(event) => setQuickEvent((current) => ({ ...current, endTime: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Repeat
              <select
                value={quickEvent.repeatFrequency}
                onChange={(event) => setQuickEvent((current) => ({
                  ...current,
                  repeatFrequency: event.target.value,
                }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              >
                <option value="never">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            {quickEvent.repeatFrequency !== 'never' && (
              <label className="text-sm font-medium text-slate-700">
                Repeat until
                <input
                  type="date"
                  required
                  min={quickEvent.date}
                  value={quickEvent.repeatUntil}
                  onChange={(event) => setQuickEvent((current) => ({
                    ...current,
                    repeatUntil: event.target.value,
                  }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                />
              </label>
            )}
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            {quickEventError && <p role="alert" className="mr-auto text-sm text-rose-700">{quickEventError}</p>}
            <button
              type="button"
              onClick={() => setShowQuickEventForm(false)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Add event
            </button>
          </div>
        </form>
      )}

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Week view</p>
            <p className="text-sm text-slate-500">{formatWeekRange(visibleWeekStart)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisibleWeekStart((current) => shiftWeek(current, -1))}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setVisibleWeekStart(getWeekStart(new Date()))}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => setVisibleWeekStart((current) => shiftWeek(current, 1))}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
            >
              Next
            </button>
          </div>
        </div>

        <div ref={calendarViewportRef} className="overflow-x-auto p-4 h-[80vh]">
          <div className="">
            <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] gap-1">
              <div />
              {visibleWeekDates.map((date) => {
                const dateKey = getDateKey(date)
                const dayName = weekdayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1]
                return (
                  <div key={dateKey} className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{dayName}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{date.getDate()}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-1 grid grid-cols-[72px_repeat(7,minmax(0,1fr))] gap-1">
              <div className="border border-slate-200 bg-white">
                {hourSlots.map((hour) => (
                  <div key={hour} className="flex items-start justify-end pr-2 text-[11px] text-slate-400" style={{ height: slotHeight }}>
                    {formatHour(hour)}
                  </div>
                ))}
              </div>

              {visibleWeekDates.map((date) => {
                const dateKey = getDateKey(date)
                const dayExperiments = experimentMap[dateKey] ?? []
                const eventLayouts = getEventLayout(dayExperiments)

                return (
                  <div key={dateKey} className="relative border border-slate-200 bg-slate-50">
                    {hourSlots.map((hour) => (
                      <div key={`${dateKey}-${hour}`} className="border-t border-slate-200" style={{ height: slotHeight }} />
                    ))}

                    {eventLayouts.map(({ experiment, laneIndex, laneCount, shouldHideDetails }) => {
                      const { start: eventStart, end: eventEnd } = getEventRange(experiment)
                      const top = ((eventStart - startHour * 60) / 60) * slotHeight
                      const height = Math.max(((eventEnd - eventStart) / 60) * slotHeight - 4, 28)
                      const laneWidth = 100 / laneCount
                      const backgroundColor = experiment.color || '#bfdbfe'

                      return (
                        <button
                          type="button"
                          key={experiment.id}
                          data-calendar-event="true"
                          data-date={dateKey}
                          data-time={experiment.time}
                          onClick={() => setSelectedExperiment(experiment)}
                          aria-label={`${experiment.title}, ${formatTimeLabel(experiment.time)}${experiment.description || experiment.notes ? `, ${experiment.description || experiment.notes}` : ''}`}
                          className="absolute overflow-hidden rounded-xl p-2 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md"
                          style={{
                            top: `${Math.max(0, top)}px`,
                            left: `calc(${laneIndex * laneWidth}% + 4px)`,
                            width: `calc(${laneWidth}% - 8px)`,
                            minHeight: `${height}px`,
                            backgroundColor,
                            border: `1px solid ${backgroundColor}`,
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                          }}
                        >
                          {!shouldHideDetails && (
                            <p className="truncate text-xs font-semibold text-slate-900" title={experiment.title}>
                              {experiment.title}
                            </p>
                          )}
                          {!shouldHideDetails && (
                            <p className="mt-1 truncate text-[11px] text-slate-700">
                              {formatTimeLabel(experiment.time)} – {formatTimeLabel(getEventEndTime(experiment))}
                            </p>
                          )}
                          {!shouldHideDetails && (
                            <p className="mt-1 truncate text-[11px] text-slate-700/80" title={experiment.description || experiment.notes || 'No notes added yet.'}>
                              {experiment.description || experiment.notes || 'No notes added yet.'}
                            </p>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <ExperimentDetailsModal
        experiment={selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
        onDelete={handleDeleteExperiment}
        onDeleteSeries={handleDeleteSeries}
      />
    </main>
  )
}

export default Schedule
