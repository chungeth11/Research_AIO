import { useRef, useState } from "react";
import ExperimentModal from "../UIparts/ExperimentModal";
const experiments = [
  {
    id: 1,
    name: "GFP Expression in HEK293 Cells",
    description:
      "Measure GFP expression following plasmid transfection in HEK293 cells.",
    status: "In Progress",
    leader: {
      name: "Dr. Maya Patel",
      profileImageUrl: "https://i.pravatar.cc/150?img=5",
    },
    isRunning: true,
    schedule: {
      startDate: "2026-10-19",
      endDate: "2026-10-26",
    },
    notes: [
      {
        id: 1,
        date: "2026-10-19",
        content: "Cells were seeded at approximately 70% confluency.",
      },
      {
        id: 2,
        date: "2026-10-20",
        content: "Transfection completed with no visible contamination.",
      },
    ],
    protocol: {
      name: "HEK293 Plasmid Transfection Protocol",
      version: "2.1",
      steps: [
        "Seed HEK293 cells in a 6-well plate.",
        "Prepare the plasmid DNA and transfection reagent.",
        "Add the transfection mixture to the cells.",
        "Incubate the cells for 24–48 hours.",
        "Measure GFP expression using fluorescence microscopy.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "transfection-protocol.pdf",
        type: "PDF",
        url: "/attachments/transfection-protocol.pdf",
      },
      {
        id: 2,
        name: "gfp-microscopy-results.png",
        type: "Image",
        url: "/attachments/gfp-microscopy-results.png",
      },
    ],
    Resources_Needed: [
      {
      id:1,
      name: "Cationic Lipids",
      Amount_Left: "5000mL",
      Amount_needed: "1000mL"
      },
      {
      id:2,
      name: "LNPs",
      Amount_Left: "250mL",
      Amount_needed: "750mL"
      }
    ]
  },
  {
    id: 2,
    name: "siRNA Gene Knockdown Study",
    description:
      "Evaluate the effect of targeted siRNA treatment on gene expression.",
    status: "Planned",
    leader: {
      name: "Jordan Lee",
      profileImageUrl: "https://i.pravatar.cc/150?img=12",
    },
    isRunning: false,
    schedule: null,
    notes: [
      {
        id: 1,
        date: "2026-10-18",
        content: "Waiting for the siRNA shipment before scheduling the study.",
      },
    ],
    protocol: {
      name: "siRNA Transfection and Gene Expression Protocol",
      version: "1.0",
      steps: [
        "Seed cells in a 24-well plate.",
        "Prepare the siRNA transfection mixture.",
        "Treat the cells with targeted and control siRNA.",
        "Incubate the cells for 48 hours.",
        "Measure gene expression using RT-qPCR.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "siRNA-target-sequences.xlsx",
        type: "Spreadsheet",
        url: "/attachments/siRNA-target-sequences.xlsx",
      },
    ],
    Resources_Needed: [
      {
      id:1,
      name: "Cationic Lipids",
      Amount_Left: "400mL",
      Amount_needed: "1000mL"
      },
      {
      id:2,
      name: "LNPs",
      Amount_Left: "250mL",
      Amount_needed: "750mL"
      }
    ]
  },
  {
    id: 3,
    name: "Neuronal Calcium Imaging",
    description:
      "Monitor calcium activity in cultured hippocampal neurons following stimulation.",
    status: "In Progress",
    leader: {
      name: "Dr. Elena Martinez",
      profileImageUrl: "https://i.pravatar.cc/150?img=47",
    },
    isRunning: true,
    schedule: {
      startDate: "2026-10-15",
      endDate: "2026-11-05",
    },
    notes: [
      {
        id: 1,
        date: "2026-10-15",
        content: "Neurons were plated on poly-D-lysine-coated coverslips.",
      },
      {
        id: 2,
        date: "2026-10-21",
        content: "Baseline calcium activity was successfully recorded.",
      },
    ],
    protocol: {
      name: "Live-Cell Calcium Imaging Protocol",
      version: "3.0",
      steps: [
        "Culture hippocampal neurons on coated coverslips.",
        "Load neurons with the calcium indicator.",
        "Place the coverslip in the imaging chamber.",
        "Record baseline fluorescence.",
        "Apply stimulation and record changes in fluorescence.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "calcium-imaging-settings.pdf",
        type: "PDF",
        url: "/attachments/calcium-imaging-settings.pdf",
      },
      {
        id: 2,
        name: "baseline-recording.mp4",
        type: "Video",
        url: "/attachments/baseline-recording.mp4",
      },
    ],
  },
  {
    id: 4,
    name: "Drug Dose-Response Assay",
    description:
      "Determine the effect of increasing drug concentrations on cell viability.",
    status: "Completed",
    leader: {
      name: "Sofia Martinez",
      profileImageUrl: "https://i.pravatar.cc/150?img=32",
    },
    isRunning: false,
    schedule: {
      startDate: "2026-09-28",
      endDate: "2026-10-04",
    },
    notes: [
      {
        id: 1,
        date: "2026-09-28",
        content: "Cells were seeded in 96-well plates.",
      },
      {
        id: 2,
        date: "2026-10-04",
        content: "Final viability measurements were collected and analyzed.",
      },
    ],
    protocol: {
      name: "Cell Viability Dose-Response Protocol",
      version: "1.4",
      steps: [
        "Seed an equal number of cells into each well.",
        "Prepare serial dilutions of the test compound.",
        "Treat cells with the compound and vehicle control.",
        "Incubate the cells for 72 hours.",
        "Measure cell viability and calculate the IC50.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "dose-response-results.xlsx",
        type: "Spreadsheet",
        url: "/attachments/dose-response-results.xlsx",
      },
      {
        id: 2,
        name: "dose-response-curve.png",
        type: "Image",
        url: "/attachments/dose-response-curve.png",
      },
    ],
    Resources_Needed: [
      {
      id:1,
      name: "Cationic Lipids",
      Amount_Left: "5000mL",
      Amount_needed: "1000mL"
      },
      {
      id:2,
      name: "LNPs",
      Amount_Left: "1000mL",
      Amount_needed: "750mL"
      }
    ]
  },
  {
    id: 5,
    name: "Western Blot Protein Analysis",
    description:
      "Compare target protein expression across control and treatment groups.",
    status: "Paused",
    leader: {
      name: "Alex Kim",
      profileImageUrl: "https://i.pravatar.cc/150?img=11",
    },
    isRunning: false,
    schedule: {
      startDate: "2026-10-10",
      endDate: null,
    },
    notes: [
      {
        id: 1,
        date: "2026-10-10",
        content: "Protein samples were extracted and quantified.",
      },
      {
        id: 2,
        date: "2026-10-12",
        content: "Experiment paused because the primary antibody is out of stock.",
      },
    ],
    protocol: {
      name: "Western Blot Protocol",
      version: "2.5",
      steps: [
        "Extract and quantify protein samples.",
        "Separate proteins using SDS-PAGE.",
        "Transfer proteins to a membrane.",
        "Block and incubate with primary and secondary antibodies.",
        "Image the membrane and quantify protein bands.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "protein-concentrations.csv",
        type: "CSV",
        url: "/attachments/protein-concentrations.csv",
      },
      {
        id: 2,
        name: "western-blot-protocol.pdf",
        type: "PDF",
        url: "/attachments/western-blot-protocol.pdf",
      },
    ],
    Resources_Needed: [
      {
      id:1,
      name: "Cationic Lipids",
      Amount_Left: "5000mL",
      Amount_needed: "1000mL"
      },
      {
      id:2,
      name: "LNPs",
      Amount_Left: "250mL",
      Amount_needed: "750mL"
      }
    ]
  },
  {
    id: 6,
    name: "CRISPR-Cas9 Gene Knockout",
    description:
      "Generate and validate a knockout cell line using CRISPR-Cas9 editing.",
    status: "Planned",
    leader: {
      name: "Dr. Daniel Brooks",
      profileImageUrl: "https://i.pravatar.cc/150?img=53",
    },
    isRunning: false,
    schedule: null,
    notes: [
      {
        id: 1,
        date: "2026-10-20",
        content: "Guide RNA candidates have been selected for validation.",
      },
    ],
    protocol: {
      name: "CRISPR-Cas9 Knockout Protocol",
      version: "1.2",
      steps: [
        "Design and validate guide RNAs.",
        "Deliver Cas9 and guide RNA into the cells.",
        "Isolate individual cell clones.",
        "Screen clones for the desired edit.",
        "Confirm the knockout using sequencing and Western blotting.",
      ],
    },
    attachments: [
      {
        id: 1,
        name: "guide-rna-designs.xlsx",
        type: "Spreadsheet",
        url: "/attachments/guide-rna-designs.xlsx",
      },
      {
        id: 2,
        name: "target-gene-sequence.fasta",
        type: "FASTA",
        url: "/attachments/target-gene-sequence.fasta",
      },
    ],
  },
];

function formatDate(date) {
  if (!date) return "Ongoing";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function parseAmount(amount) {
  const match = amount.match(/^\s*([\d,]+(?:\.\d+)?)\s*([a-zA-Zµμ]+)\s*$/);
  if (!match) return null;

  return {
    quantity: Number(match[1].replaceAll(",", "")),
    unit: match[2].toLowerCase(),
  };
}

function getSupplyAvailability(resources) {
  if (!resources?.length) return null;

  return resources.map((resource) => {
    const available = parseAmount(resource.Amount_Left);
    const needed = parseAmount(resource.Amount_needed);
    const enough =
      available && needed && available.unit === needed.unit
        ? available.quantity >= needed.quantity
        : null;

    return { ...resource, enough };
  });
}

function readFileAsDataUrl(file, index) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve({
          id: `${index}-${file.name}-${file.lastModified}-${file.size}`,
          name: file.name,
          type: file.type || "application/octet-stream",
          url: reader.result,
        });
      } else {
        reject(new Error(`Unable to read ${file.name}.`));
      }
    };
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function Experiments({ lab }) {
  const [experimentList, setExperimentList] = useState(lab.id === 1 ? experiments : []);
  const [selectedExperimentId, setSelectedExperimentId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteFiles, setNoteFiles] = useState([]);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);
  const [experimentToEdit, setExperimentToEdit] = useState(null);
  const noteFileInputRef = useRef(null);
  const selectedExperiment = experimentList.find(
    (experiment) => experiment.id === selectedExperimentId,
  ) ?? null;
  const supplyAvailability = selectedExperiment
    ? getSupplyAvailability(selectedExperiment.Resources_Needed)
    : null;
  const hasSupplyShortage = supplyAvailability?.some((resource) => resource.enough === false);
  const hasEnoughSupplies =
    supplyAvailability?.length &&
    supplyAvailability.every((resource) => resource.enough === true);
  const supplyStatus = hasSupplyShortage
    ? "Shortage"
    : hasEnoughSupplies
      ? "Enough supplies"
      : supplyAvailability
        ? "Check quantities"
        : "Not recorded";

  function openAddExperimentModal() {
    setExperimentToEdit(null);
    setIsExperimentModalOpen(true);
  }

  function openEditExperimentModal() {
    setExperimentToEdit(selectedExperiment);
    setIsExperimentModalOpen(true);
  }

  function handleSaveExperiment(updatedExperiment) {
    setExperimentList((currentExperiments) =>
      experimentToEdit
        ? currentExperiments.map((experiment) =>
            experiment.id === updatedExperiment.id
              ? updatedExperiment
              : experiment,
          )
        : [...currentExperiments, updatedExperiment],
    );
    setSelectedExperimentId(updatedExperiment.id);
    setIsExperimentModalOpen(false);
    setExperimentToEdit(null);
  }

  async function handleAddNote(event) {
    event.preventDefault();
    if (!selectedExperiment || (!noteDraft.trim() && noteFiles.length === 0)) return;

    let attachments;
    try {
      attachments = await Promise.all(noteFiles.map(readFileAsDataUrl));
    } catch (error) {
      window.alert(error.message);
      return;
    }

    const newNote = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      content: noteDraft.trim(),
      attachments,
    };
    setExperimentList((currentExperiments) =>
      currentExperiments.map((experiment) =>
        experiment.id === selectedExperiment.id
          ? { ...experiment, notes: [...experiment.notes, newNote] }
          : experiment,
      ),
    );
    setNoteDraft("");
    setNoteFiles([]);
    if (noteFileInputRef.current) noteFileInputRef.current.value = "";
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto grid lg:grid-cols-3 lg:grid-rows-1 lg:overflow-hidden">

    <div className="min-w-0 flex-none p-4 text-slate-900 sm:p-8 lg:col-span-2 lg:min-h-0 lg:overflow-y-auto">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Experiments</h1>
          <p className="mt-1 text-sm text-slate-500">{lab.name}</p>
        </div>
        <button
          type="button"
          onClick={openAddExperimentModal}
          className="shrink-0 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      {experimentList.length === 0 && (
        <p className="mt-4 rounded-lg bg-white p-4 text-sm text-slate-600">
          No experiments have been added for {lab.name}.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {experimentList.map((experiment) => {
          const experimentSupplies = getSupplyAvailability(experiment.Resources_Needed);
          const experimentHasShortage = experimentSupplies?.some(
            (resource) => resource.enough === false,
          );
          const experimentHasEnough =
            experimentSupplies?.length &&
            experimentSupplies.every((resource) => resource.enough === true);
          const experimentSupplyStatus = experimentHasShortage
            ? "Shortage"
            : experimentHasEnough
              ? "Enough supplies"
              : experimentSupplies
                ? "Check quantities"
                : "Not recorded";

          return (
            <button
              type="button"
              onClick={() => setSelectedExperimentId(experiment.id)}
              key={experiment.id}
              id={`experiment-${experiment.id}`}
              className="rounded-lg bg-white p-4 text-left shadow-md transition-colors hover:bg-gray-100"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="mb-2 text-xl font-bold">{experiment.name}</h2>
                <p className="mt-0.5 font-semibold text-gray-800">
                  Status: {experiment.status}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    experimentHasShortage
                      ? "bg-rose-50 text-rose-700"
                      : experimentHasEnough
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {experimentSupplyStatus}
                </span>
              </div>

              <p className="mb-2 text-start text-gray-600">
                Leader: {experiment.leader.name}
              </p>
              <p className="mb-2 text-start text-gray-600">
                Details: {experiment.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
    {/* all the right sidebar stuff */}
    <aside
      aria-label="Experiment details"
      className="min-w-0 flex-none border-t border-slate-200 bg-slate-50 p-4 text-slate-900 sm:p-6 lg:col-span-1 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0"
    >
      {selectedExperiment ? (
        <div className="mx-auto max-w-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">
                Experiment overview
              </p>
              <h2 className="mt-1 text-sm font-semibold text-slate-800">Details</h2>
            </div>
            <button
              type="button"
              onClick={openEditExperimentModal}
              className="rounded-full bg-blue-500 px-4 py-2 text-xs font-medium text-white ring-1 ring-slate-200 transition hover:bg-blue-700"
            >
             edit
            </button>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  selectedExperiment.status === "In Progress"
                    ? "bg-emerald-50 text-emerald-700"
                    : selectedExperiment.status === "Completed"
                      ? "bg-blue-50 text-blue-700"
                      : selectedExperiment.status === "Paused"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                }`}
              >
                {selectedExperiment.status}
              </span>
            </div>
            <h3 className="mt-3 break-words text-xl font-bold leading-snug text-slate-900">
              {selectedExperiment.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {selectedExperiment.description}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Supply check
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Stock compared with experiment needs
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  hasSupplyShortage
                    ? "bg-rose-50 text-rose-700"
                    : hasEnoughSupplies
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {supplyStatus}
              </span>
            </div>
            {!supplyAvailability?.length ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-600">
                Supply requirements have not been recorded for this experiment.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {supplyAvailability.map((resource) => (
                  <li key={resource.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {resource.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {resource.Amount_Left} available · {resource.Amount_needed} needed
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                        resource.enough === true
                          ? "bg-emerald-50 text-emerald-700"
                          : resource.enough === false
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {resource.enough === true
                        ? "Enough"
                        : resource.enough === false
                          ? "Short"
                          : "Check units"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Project details
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={selectedExperiment.leader.profileImageUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-50"
              />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Experiment lead</p>
                <p className="truncate text-sm font-semibold text-slate-800">
                  {selectedExperiment.leader.name}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">Schedule</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {selectedExperiment.schedule
                  ? `${formatDate(selectedExperiment.schedule.startDate)} – ${formatDate(selectedExperiment.schedule.endDate)}`
                  : "Not scheduled"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Protocol
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Protocol</p>
                <p className="mt-1 text-sm font-medium leading-5 text-slate-800">
                  {selectedExperiment.protocol.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Version {selectedExperiment.protocol.version}
                </p>
                <p className="mt-1 text-xs text-slate-500">{selectedExperiment.protocol.steps}</p>
                <p className="mt-1 text-xs text-slate-500">{selectedExperiment.protocol.steps.join(", ")}</p>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Attachments
            </h3>
            <div className="mt-4 space-y-2">
              {selectedExperiment.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
                >
                  {attachment.name} ({attachment.type})
                </a>
              ))}
            </div>
          </section >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-h-2/3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Notes
              </h3>
              <span className="text-xs text-slate-500">
                {selectedExperiment.notes.length} {selectedExperiment.notes.length === 1 ? "note" : "notes"}
              </span>
            </div>
            {selectedExperiment.notes.length === 0 ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                No notes yet. Add a note to record experiment updates.
              </p>
            ) : (
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {selectedExperiment.notes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <time
                      dateTime={note.date}
                      className="text-xs font-medium text-slate-500"
                    >
                      {formatDate(note.date)}
                    </time>
                    {note.content && (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-700">
                        {note.content}
                      </p>
                    )}
                    {note.attachments?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {note.attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              className="break-all text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                              {attachment.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddNote} className="mt-4 space-y-3">
              <label
                htmlFor="experiment-note"
                className="block text-sm font-medium text-slate-700"
              >
                Add a note
              </label>
              <textarea
                id="experiment-note"
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={3}
                placeholder="Record an observation or update..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <input
                    ref={noteFileInputRef}
                    id="experiment-note-files"
                    type="file"
                    multiple
                    onChange={(event) => setNoteFiles(Array.from(event.target.files ?? []))}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => noteFileInputRef.current?.click()}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Attach files
                  </button>
                  {noteFiles.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {noteFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <span className="min-w-0 break-all">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNoteFiles((currentFiles) =>
                                currentFiles.filter((_, fileIndex) => fileIndex !== index),
                              );
                              if (noteFileInputRef.current) noteFileInputRef.current.value = "";
                            }}
                            aria-label={`Remove ${file.name}`}
                            className="shrink-0 font-medium text-rose-600 hover:text-rose-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!noteDraft.trim() && noteFiles.length === 0}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Save note
                </button>
              </div>
            </form>
          </section>


        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center py-12 text-center lg:min-h-full">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg
              aria-hidden="true"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path d="M9 3h6M10 3v6.5l-5.1 8.1A2.3 2.3 0 0 0 6.8 21h10.4a2.3 2.3 0 0 0 1.9-3.4L14 9.5V3" />
              <path d="M8 15h8" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-800">
            Your experiment details
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            Select an experiment from the list to see its status, schedule, and resources.
          </p>
        </div>
      )}
    </aside>
    {isExperimentModalOpen && (
      <ExperimentModal
        experiment={experimentToEdit}
        onClose={() => {
          setIsExperimentModalOpen(false);
          setExperimentToEdit(null);
        }}
        onSave={handleSaveExperiment}
      />
    )}
    </div>
  )
}
export default Experiments