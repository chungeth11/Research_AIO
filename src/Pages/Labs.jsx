import { useState } from "react";
import ApplyModal from "../UIparts/ApplyModal";
// eslint-disable-next-line react-refresh/only-export-components
export const labs = [
{
    id: 1,
    name: "Martinez Neural Plasticity Lab",
    organization: "Helix Research Institute",
    type: "Environmental Sciences",
organizationImageUrl: "https://placehold.co/150x150?text=HRI",
    description:
      "Studies how synapses and neural circuits change during learning, memory formation, and neurological disease.",
    location: {
      institution: "Helix Research Institute",
      building: "Life Sciences Building",
      room: "204",
      city: "Los Angeles",
      state: "CA",
      country: "United States",

    },
    isHiring: true,
    hiringPositions: [
      {
        id: 1,
        title: "Research Assistant",
        employmentType: "Full-time",
        description:
          "Support neuronal cell culture, microscopy, and molecular biology experiments.",
        salaryRange: {
          minimum: 48000,
          maximum: 62000,
          currency: "USD",
          period: "year",
        },
        requirements: [
          "Bachelor's degree in neuroscience, biology, or a related field",
          "At least one year of laboratory experience",
          "Experience with cell culture or fluorescence microscopy",
          "Strong organization and record-keeping skills",
        ],
      },
      {
        id: 2,
        title: "Postdoctoral Research Fellow",
        employmentType: "Full-time",
        description:
          "Lead studies investigating synaptic plasticity and neural circuit function.",
        salaryRange: {
          minimum: 68000,
          maximum: 78000,
          currency: "USD",
          period: "year",
        },
        requirements: [
          "PhD in neuroscience, physiology, or a related field",
          "Experience with electrophysiology or two-photon microscopy",
          "Strong scientific writing and data-analysis skills",
          "At least one first-author publication",
        ],
      },
    ],
    benefits: [
      "Medical, dental, and vision insurance",
      "Paid vacation and sick leave",
      "Retirement plan",
      "Conference travel funding",
      "Flexible work scheduling",
    ],
  },
{
    id: 2,
    name: "Chen Molecular Therapeutics Lab",
    organization: "Pacific Biomedical Center",
    type:"Molecular biology" ,
organizationImageUrl: "https://placehold.co/150x150?text=PBC",
    description:
      "Develops gene therapies and RNA-based treatments for rare genetic disorders.",
    location: {
      institution: "Pacific Biomedical Center",
      building: "Translational Research Tower",
      room: "512",
      city: "San Diego",
      state: "CA",
      country: "United States",
    },
    isHiring: true,
    hiringPositions: [
      {
        id: 1,
        title: "Molecular Biology Technician",
        employmentType: "Full-time",
        description:
          "Perform PCR, DNA cloning, sequencing, and mammalian cell culture.",
        salaryRange: {
          minimum: 52000,
          maximum: 67000,
          currency: "USD",
          period: "year",
        },
        requirements: [
          "Bachelor's degree in molecular biology or biochemistry",
          "Experience with PCR and DNA cloning",
          "Experience maintaining mammalian cell cultures",
          "Knowledge of laboratory safety procedures",
        ],
      },
      {
        id: 2,
        title: "Bioinformatics Intern",
        employmentType: "Internship",
        description:
          "Assist with genomic data processing and gene-expression analysis.",
        salaryRange: {
          minimum: 22,
          maximum: 28,
          currency: "USD",
          period: "hour",
        },
        requirements: [
          "Currently pursuing a degree in bioinformatics or computer science",
          "Experience with Python or R",
          "Basic understanding of genetics and genomics",
          "Ability to work at least 20 hours per week",
        ],
      },
    ],
    benefits: [
      "Health insurance",
      "Paid holidays",
      "Research training",
      "Mentorship program",
      "Tuition assistance",
      "Hybrid work options for computational roles",
    ],
  },
{
    id: 3,
    name: "Brooks Genome Engineering Lab",
    organization: "North Valley University",
    type: "History",
organizationImageUrl: "https://placehold.co/150x150?text=NVU",
    description:
      "Uses CRISPR, base editing, and prime editing to develop models of inherited diseases.",
    location: {
      institution: "North Valley University",
      building: "Genome Sciences Center",
      room: "310",
      city: "Seattle",
      state: "WA",
      country: "United States",
    },
    isHiring: true,
    hiringPositions: [
      {
        id: 1,
        title: "CRISPR Research Associate",
        employmentType: "Full-time",
        description:
          "Design guide RNAs and generate genetically modified cell lines.",
        salaryRange: {
          minimum: 60000,
          maximum: 76000,
          currency: "USD",
          period: "year",
        },
        requirements: [
          "Master's degree in genetics, biotechnology, or a related field",
          "Hands-on experience with CRISPR-Cas9",
          "Experience with cell culture and DNA sequencing",
          "Ability to analyze gene-editing results",
        ],
      },
    ],
    benefits: [
      "Medical and dental insurance",
      "Retirement contribution",
      "Paid parental leave",
      "Publication bonuses",
      "Conference funding",
      "Employee wellness program",
    ],
  },
{
    id: 4,
    name: "Rivera Metabolic Disease Lab",
    type: "psychology",
    organization: "Central Health Sciences University",
organizationImageUrl: "https://placehold.co/150x150?text=CHSU",
    description:
      "Investigates the neural and hormonal mechanisms involved in obesity, diabetes, and appetite regulation.",
    location: {
      institution: "Central Health Sciences University",
      building: "Metabolic Research Center",
      room: "118",
      city: "Austin",
      state: "TX",
      country: "United States",
    },
    isHiring: false,
    hiringPositions: [],
    benefits: [
      "Medical, dental, and vision insurance",
      "Paid time off",
      "Retirement plan",
      "Professional development funding",
      "Access to university research facilities",
    ],
  },
{
    id: 5,
    name: "Patel Cellular Imaging Lab",
    type: "femboy and christian studies",
    organization: "East Coast Medical Institute",
organizationImageUrl: "https://placehold.co/150x150?text=ECMI",
    description:
      "Develops advanced microscopy methods for visualizing cellular structures and protein movement in living cells.",
    location: {
      institution: "East Coast Medical Institute",
      building: "Advanced Imaging Facility",
      room: "405",
      city: "Boston",
      state: "MA",
      country: "United States",
    },
    isHiring: true,
    hiringPositions: [
      {
        id: 1,
        title: "Microscopy Specialist",
        employmentType: "Full-time",
        description:
          "Operate imaging systems and train researchers in advanced microscopy techniques.",
        salaryRange: {
          minimum: 65000,
          maximum: 82000,
          currency: "USD",
          period: "year",
        },
        requirements: [
          "Bachelor's or master's degree in biology or biomedical engineering",
          "Experience with confocal or two-photon microscopy",
          "Knowledge of image-analysis software",
          "Strong communication and training skills",
        ],
      },
    ],
    benefits: [
      "Comprehensive health insurance",
      "Four weeks of paid vacation",
      "Retirement plan with employer matching",
      "Public transportation reimbursement",
      "Professional certification funding",
      "Flexible scheduling",
    ],
  }
];

function Labs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [applicationPosition, setApplicationPosition] = useState(null);
  const [directoryView, setDirectoryView] = useState("labs");
  const [initialSavedJobs] = useState(() => {
    try {
      const savedJobs = JSON.parse(
        window.localStorage.getItem("research-aio-saved-jobs") ?? "[]",
      );
      if (!Array.isArray(savedJobs) || !savedJobs.every((key) => typeof key === "string")) {
        throw new Error("Saved job data is not in the expected format.");
      }
      return { keys: savedJobs, error: "" };
    } catch (error) {
      return { keys: [], error: `Could not load saved jobs: ${error.message}` };
    }
  });
  const [savedJobKeys, setSavedJobKeys] = useState(initialSavedJobs.keys);
  const [savedJobsError, setSavedJobsError] = useState(initialSavedJobs.error);
  const selectedLab = labs.find((lab) => lab.id === selectedLabId);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const savedJobs = labs.flatMap((lab) =>
    lab.hiringPositions
      .filter((position) => savedJobKeys.includes(`${lab.id}-${position.id}`))
      .map((position) => ({ lab, position, key: `${lab.id}-${position.id}` })),
  );
  const filteredLabs = labs.filter((lab) =>
    [lab.name, lab.description, lab.location.institution, lab.location.city, lab.location.state]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearchTerm),
  );

  function toggleSavedJob(labId, positionId) {
    const key = `${labId}-${positionId}`;
    const updatedSavedJobKeys = savedJobKeys.includes(key)
      ? savedJobKeys.filter((savedKey) => savedKey !== key)
      : [...savedJobKeys, key];
    setSavedJobKeys(updatedSavedJobKeys);
    try {
      window.localStorage.setItem(
        "research-aio-saved-jobs",
        JSON.stringify(updatedSavedJobKeys),
      );
      setSavedJobsError("");
    } catch (error) {
      setSavedJobsError(`Could not save your saved jobs: ${error.message}`);
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-slate-50 text-slate-900 md:flex-row">
      <aside
        aria-label="Labs sidebar"
        className="flex h-[40%] min-h-[280px] w-full shrink-0 flex-col border-b border-slate-200 bg-white md:h-full md:min-h-0 md:w-[34%] md:min-w-64 md:max-w-sm md:border-b-0 md:border-r"
      >
        <div className="shrink-0 border-b border-slate-200 px-5 pb-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Directory
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Available labs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse research teams and opportunities.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setDirectoryView("labs")}
              aria-pressed={directoryView === "labs"}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                directoryView === "labs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Labs
            </button>
            <button
              type="button"
              onClick={() => setDirectoryView("saved")}
              aria-pressed={directoryView === "saved"}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                directoryView === "saved" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Saved jobs ({savedJobs.length})
            </button>
          </div>
          {directoryView === "labs" && (
            <>
          <label htmlFor="lab-search" className="sr-only">
            Search labs
          </label>
          <div className="relative mt-4">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="lab-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search labs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <p className="mt-3 text-xs font-medium text-slate-400">
            {filteredLabs.length} {filteredLabs.length === 1 ? "lab" : "labs"}
          </p>
            </>
          )}
          {savedJobsError && (
            <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">
              {savedJobsError}
            </p>
          )}
        </div>
        {directoryView === "labs" ? (
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {filteredLabs.map((lab) => (
            <li key={lab.id}>
              <button
                type="button"
                aria-pressed={selectedLabId === lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selectedLabId === lab.id
                    ? "border-blue-200 bg-blue-50 shadow-sm ring-1 ring-blue-100"
                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white">
                    <svg
                      aria-hidden="true"
                      className="h-full w-full"
                      viewBox="0 0 150 150"
                    >
                      <image
                        href={lab.organizationImageUrl}
                        width="150"
                        height="150"
                        preserveAspectRatio="xMidYMid meet"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-5 text-slate-800">
                      {lab.name}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {lab.organization}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {lab.location.city}, {lab.location.state}
                    </span>
                  </span>
                  {lab.isHiring && (
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Hiring" />
                  )}
                </span>
              </button>
            </li>
          ))}
          {filteredLabs.length === 0 && (
            <li className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">No labs found</p>
              <p className="mt-1 text-xs text-slate-500">
                Try another name, institution, or location.
              </p>
            </li>
          )}
        </ul>
        ) : (
          <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {savedJobs.map(({ lab, position, key }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedLabId === lab.id
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className = " flex justify-between">
                    <span className="block text-sm font-semibold text-slate-800">{position.title}</span>
                    <button
                      type="button"
                      onClick={() => toggleSavedJob(lab.id, position.id)}
                      aria-label={`Remove ${position.title} from saved jobs`}
                      className="-mt-1.5 px-3 text-left text-lg font-semibold text-slate-600 hover:text-black"
                    >
                  x
                </button>
                  </div>
                  <span className="mt-1 block text-xs text-slate-500">{lab.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">{position.employmentType}</span>
                </button>

              </li>
            ))}
            {savedJobs.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-700">No saved jobs yet</p>
                <p className="mt-1 text-xs text-slate-500">Save a role from a lab to find it here.</p>
              </li>
            )}
          </ul>
        )}
      </aside>

      <section
        aria-live="polite"
        className="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 sm:p-8"
      >
        {selectedLab ? (
          <div className="mx-auto max-w-4xl space-y-6">
            <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
              <div className="flex flex-wrap items-center gap-4 p-6 sm:p-8">
                <svg
                  role="img"
                  aria-label={`${selectedLab.organization} logo`}
                  className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 bg-white shadow-sm"
                  viewBox="0 0 150 150"
                >
                  <image
                    href={selectedLab.organizationImageUrl}
                    width="150"
                    height="150"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-blue-700">
                    {selectedLab.organization}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {selectedLab.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedLab.type}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    selectedLab.isHiring
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedLab.isHiring ? "Currently hiring" : "Not hiring"}
                </span>
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-900">About the lab</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {selectedLab.description}
                </p>
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedLab.location.institution}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedLab.location.building}, Room {selectedLab.location.room}
                      {" · "}
                      {selectedLab.location.city}, {selectedLab.location.state}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Open positions</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {selectedLab.hiringPositions.length}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedLab.isHiring
                    ? "Opportunities available"
                    : "No current openings"}
                </p>
              </article>
            </div>

            {selectedLab.hiringPositions.length > 0 && (
              <section>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                      Join the team
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      Open positions
                    </h3>
                  </div>
                  <span className="text-sm text-slate-500">
                    {selectedLab.hiringPositions.length}{" "}
                    {selectedLab.hiringPositions.length === 1 ? "opening" : "openings"}
                  </span>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {selectedLab.hiringPositions.map((position) => (
                    <article
                      key={position.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setApplicationPosition(position);
                            }}
                            className="text-left font-semibold text-slate-900 underline decoration-transparent underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-500 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            {position.title}
                          </button>
                          <p className="mt-1 text-sm text-slate-500">
                            {position.employmentType}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                          Open role
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSavedJob(selectedLab.id, position.id)}
                        aria-pressed={savedJobKeys.includes(`${selectedLab.id}-${position.id}`)}
                        className={`mt-4 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                          savedJobKeys.includes(`${selectedLab.id}-${position.id}`)
                            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {savedJobKeys.includes(`${selectedLab.id}-${position.id}`)
                          ? "Saved"
                          : "Save job"}
                      </button>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {position.description}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: position.salaryRange.currency,
                          maximumFractionDigits: 0,
                        }).format(position.salaryRange.minimum)}
                        {" – "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: position.salaryRange.currency,
                          maximumFractionDigits: 0,
                        }).format(position.salaryRange.maximum)}
                        <span className="font-normal text-slate-500">
                          {" "}/ {position.salaryRange.period}
                        </span>
                      </p>
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Requirements
                        </p>
                        <ul className="mt-2 space-y-2">
                          {position.requirements.map((requirement) => (
                            <li
                              key={requirement}
                              className="flex gap-2 text-sm leading-5 text-slate-600"
                            >
                              <span aria-hidden="true" className="text-blue-600">•</span>
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setApplicationPosition(position);
                        }}
                        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Apply for this role
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01" />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Explore research labs
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Choose a lab from the directory to view its research, location,
              openings, and benefits.
            </p>
          </div>
        )}
      </section>
      {applicationPosition && selectedLab && (
        <ApplyModal
          labName={selectedLab.name}
          position={applicationPosition}
          onClose={() => setApplicationPosition(null)}
        />
      )}
    </div>
  );
}

export default Labs;
