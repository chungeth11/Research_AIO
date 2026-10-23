import { useState } from "react";
import CertificationsTrainingModal from "../UIparts/CertificationsTrainingModal";
import { labs } from "./Labs";

const lab = {
  organization: {
    name: "Helix Research Institute",
    organizationImageUrl: "https://placehold.co/150x150?text=HRI",
    division: "Division of Neuroscience",
    logo: {
      name: "Helix Research Institute Logo",
      initials: "HRI",
    },
  },

  name: "Martinez Neural Plasticity Lab",
  type: "Academic Research Lab",
  email: "martinez.lab@helix.edu",
  phone: "(555) 123-4567",
  biosafetyLevel: "BSL-2",

  description:
    "We investigate how synapses and neural circuits change during learning, memory formation, and metabolic disease. Our team combines two-photon imaging, electrophysiology, molecular biology, and computational analysis.",

  principalInvestigator: {
    name: "Dr. Elena Martinez",
    title: "Principal Investigator",
  },

  location: {
    campus: "Health Sciences Center",
    building: "Building B",
    address: "123 Science Drive",
    rooms: "Rooms 402",
    city: "Los Angeles",
    state: "California",
  },

  statistics: {
    members: 12,
    activeProjects: 7,
    publications: 24,
  },

  certifications: [
    {
      id: 1,
      name: "Biosafety Level 2",
      status: "Active",
      expires: "May 18, 2027",
    },
    {
      id: 2,
      name: "Institutional Animal Care and Use",
      status: "Active",
      expires: "January 12, 2027",
    },
    {
      id: 3,
      name: "Chemical Safety",
      status: "Renewal Required",
      expires: "November 4, 2026",
    },
  ],

  trainings: [
    {
      id: 1,
      name: "Bloodborne Pathogens",
      completed: 11,
      total: 12,
    },
    {
      id: 2,
      name: "Animal Handling",
      completed: 8,
      total: 8,
    },
    {
      id: 3,
      name: "Laboratory Chemical Safety",
      completed: 10,
      total: 12,
    },
  ],

  announcements: [
    {
      id: 1,
      title: "Lab meeting moved",
      description: "This week's lab meeting will be held in HSC 410.",
      date: "October 23, 2026",
    },
    {
      id: 2,
      title: "New confocal microscope",
      description:
        "Training sessions are now available for the new microscope.",
      date: "October 20, 2026",
    },
  ],

  attentionItems: [
    {
      id: 1,
      title: "Chemical Safety training",
      description: "Two lab members must renew their training.",
      priority: "High",
      category: "Training",
    },
    {
      id: 2,
      title: "Low antibody inventory",
      description:
        "Anti-GFAP antibody has approximately two experiments remaining.",
      priority: "Medium",
      category: "Inventory",
    },
    {
      id: 3,
      title: "Freezer temperature alert",
      description: "Freezer 2 reached −72°C this morning.",
      priority: "High",
      category: "Equipment",
    },
  ],

  papers: [
    {
      id: 1,
      title: "Structural Plasticity of Dendritic Spines in Learning",
      authors: ["Elena Martinez", "Lena Chen", "Ravi Patel"],
      journal: "Nature Neuroscience",
      year: 2026,
      tags: ["Synaptic plasticity", "Imaging"],
      url: "#",
    },
    {
      id: 2,
      title:
        "AMPA Receptor Trafficking After NMDA Receptor Activation",
      authors: ["Lena Chen", "James Williams", "Elena Martinez"],
      journal: "Journal of Neuroscience",
      year: 2025,
      tags: ["AMPA receptors", "LTP"],
      url: "#",
    },
    {
      id: 3,
      title: "Neural Circuit Adaptations in Metabolic Disease",
      authors: ["Ravi Patel", "Elena Martinez"],
      journal: "Cell Metabolism",
      year: 2025,
      tags: ["Metabolism", "Neural circuits"],
      url: "#",
    },
  ],
};

const labHomeContent = {
  1: lab,
  2: {
    announcements: [
      {
        id: 1,
        title: "RNA therapy review",
        description: "The team will review delivery results in the weekly project meeting.",
        date: "October 22, 2026",
      },
      {
        id: 2,
        title: "Sequencing instrument maintenance",
        description: "The sequencing core will be unavailable Friday morning.",
        date: "October 20, 2026",
      },
    ],
    attentionItems: [
      {
        id: 1,
        title: "Molecular biology safety renewal",
        description: "Two team members need to renew their lab safety training.",
        priority: "High",
        category: "Training",
      },
      {
        id: 2,
        title: "Sequencing reagents running low",
        description: "Review stock before the next sequencing run.",
        priority: "Medium",
        category: "Inventory",
      },
    ],
    papers: [
      {
        id: 1,
        title: "Targeted RNA Delivery for Rare Genetic Disorders",
        authors: ["Lena Chen", "Sofia Rivera", "Daniel Kim"],
        journal: "Molecular Therapy",
        year: 2026,
        tags: ["RNA therapy", "Delivery"],
        url: "#",
      },
    ],
    certifications: [
      { id: 1, name: "Molecular Biology Laboratory Safety", status: "Active", expires: "June 30, 2027" },
      { id: 2, name: "Recombinant DNA Research", status: "Renewal Required", expires: "December 10, 2026" },
    ],
    trainings: [
      { id: 1, name: "Chemical Hygiene", completed: 9, total: 10 },
      { id: 2, name: "Genetic Engineering Safety", completed: 10, total: 10 },
    ],
  },
  3: {
    announcements: [
      {
        id: 1,
        title: "Genome editing seminar",
        description: "The department seminar on prime editing is scheduled for next Tuesday.",
        date: "October 21, 2026",
      },
    ],
    attentionItems: [
      {
        id: 1,
        title: "CRISPR protocol review",
        description: "Update the shared protocol before the next editing series.",
        priority: "Medium",
        category: "Protocol",
      },
    ],
    papers: [
      {
        id: 1,
        title: "Improving Precision in Prime Editing",
        authors: ["A. Brooks", "M. Shah", "R. Nguyen"],
        journal: "Genome Biology",
        year: 2026,
        tags: ["Prime editing", "CRISPR"],
        url: "#",
      },
    ],
    certifications: [
      { id: 1, name: "Recombinant DNA Research", status: "Active", expires: "August 14, 2027" },
      { id: 2, name: "Biosafety Level 2", status: "Active", expires: "March 2, 2027" },
    ],
    trainings: [
      { id: 1, name: "CRISPR Laboratory Safety", completed: 7, total: 8 },
      { id: 2, name: "Biosafety Level 2", completed: 8, total: 8 },
    ],
  },
  4: {
    announcements: [
      {
        id: 1,
        title: "Metabolic study enrollment",
        description: "Recruitment for the upcoming metabolic study begins next week.",
        date: "October 23, 2026",
      },
    ],
    attentionItems: [
      {
        id: 1,
        title: "Human subjects refresher",
        description: "Annual human-subjects training is due for one team member.",
        priority: "High",
        category: "Training",
      },
    ],
    papers: [
      {
        id: 1,
        title: "Neural and Hormonal Signals in Appetite Regulation",
        authors: ["M. Rivera", "J. Park", "E. Gomez"],
        journal: "Endocrinology",
        year: 2025,
        tags: ["Metabolism", "Appetite"],
        url: "#",
      },
    ],
    certifications: [
      { id: 1, name: "Human Subjects Research", status: "Renewal Required", expires: "November 18, 2026" },
      { id: 2, name: "Clinical Research Compliance", status: "Active", expires: "April 9, 2027" },
    ],
    trainings: [
      { id: 1, name: "Human Subjects Protection", completed: 11, total: 12 },
      { id: 2, name: "Research Data Privacy", completed: 12, total: 12 },
    ],
  },
  5: {
    announcements: [
      {
        id: 1,
        title: "Imaging facility orientation",
        description: "New microscope orientation slots are available in the facility calendar.",
        date: "October 22, 2026",
      },
    ],
    attentionItems: [
      {
        id: 1,
        title: "Microscope access renewal",
        description: "Complete the annual imaging-facility refresher to retain instrument access.",
        priority: "Medium",
        category: "Training",
      },
    ],
    papers: [
      {
        id: 1,
        title: "Live-Cell Imaging of Protein Transport",
        authors: ["M. Patel", "K. Wilson", "A. Chen"],
        journal: "Cell Reports Methods",
        year: 2026,
        tags: ["Microscopy", "Live-cell imaging"],
        url: "#",
      },
    ],
    certifications: [
      { id: 1, name: "Laser Safety", status: "Active", expires: "July 7, 2027" },
      { id: 2, name: "Imaging Facility Access", status: "Active", expires: "February 16, 2027" },
    ],
    trainings: [
      { id: 1, name: "Confocal Microscope Operation", completed: 6, total: 7 },
      { id: 2, name: "Laser Safety", completed: 7, total: 7 },
    ],
  },
};

function Lab_home({ selectedLabId, onSelectedLabChange }) {
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [complianceUploads, setComplianceUploads] = useState({});
  const selectedLab = labs.find(({ id }) => id === selectedLabId) ?? labs[0];
  const selectedLabContent = labHomeContent[selectedLab.id] ?? lab;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 text-slate-900">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-label={`${selectedLab.organization} logo`}
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white"
            >
              <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 150 150">
                <image
                  href={selectedLab.organizationImageUrl}
                  width="150"
                  height="150"
                  preserveAspectRatio="xMidYMid meet"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-500">{selectedLab.organization}</p>
              <p className="mt-1 text-sm text-slate-500">{selectedLab.type}</p>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {selectedLab.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{selectedLab.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-slate-700">
              <span className="sr-only">Choose lab to view</span>
              <select
                aria-label="Choose lab to view"
                value={selectedLabId}
                onChange={(event) => onSelectedLabChange(Number(event.target.value))}
                className="max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {labs.map((availableLab) => (
                  <option key={availableLab.id} value={availableLab.id}>
                    {availableLab.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setIsComplianceModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Certifications &amp; training
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <p className="mt-1 font-medium text-slate-800">
              {selectedLab.location.building}, Room {selectedLab.location.room}
            </p>
            <p className="text-slate-500">
              {selectedLab.location.institution} · {selectedLab.location.city}, {selectedLab.location.state}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Research area</p>
            <p className="mt-1 font-medium text-slate-800">{selectedLab.type}</p>
          </div>
        </div>
      </header>

      {/* <section aria-label="Lab overview" className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Lab members", value: lab.statistics.members },
          { label: "Active projects", value: lab.statistics.activeProjects },
          { label: "Publications", value: lab.statistics.publications },
        ].map((stat) => (
          <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.detail}</p>
            </div>
          </article>
        ))}
      </section> */}

      <section aria-label="Updates and items needing attention" className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
              <p className="mt-1 text-sm text-slate-500">News and updates from your lab</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {selectedLabContent.announcements.length} updates
            </span>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {selectedLabContent.announcements.map((announcement) => (
              <li key={announcement.id} className="py-4 first:pt-0 last:pb-0">
                <p className="text-xs font-medium text-blue-500">{announcement.date}</p>
                <h3 className="mt-1 font-semibold text-slate-800">{announcement.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{announcement.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-red-700">Needs attention</h2>
              <p className="mt-1 text-sm text-slate-500">Items that may need follow-up</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              {selectedLabContent.attentionItems.length} items
            </span>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {selectedLabContent.attentionItems.map((item) => (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.priority === "High"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {item.priority} priority
                  </span>
                </div>
                <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs font-medium text-slate-400">{item.category}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section aria-labelledby="publications-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="publications-heading" className="text-xl font-bold text-slate-900">Recent publications</h2>
            <p className="mt-1 text-sm text-slate-500">Selected work from the research team</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {selectedLabContent.papers.length} papers
          </span>
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {selectedLabContent.papers.map((publication) => (
            <li key={publication.id} className="flex flex-col rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                {publication.journal} · {publication.year}
              </p>
              <h3 className="mt-2 flex-1 font-semibold leading-5 text-slate-800">{publication.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{publication.authors.join(", ")}</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">
                <a href={publication.url} className="text-blue-500 hover:text-blue-800 underline">
                  Read full paper
                </a>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publication.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      {isComplianceModalOpen && (
        <CertificationsTrainingModal
          certifications={selectedLabContent.certifications}
          trainings={selectedLabContent.trainings}
          uploads={complianceUploads[selectedLab.id] ?? {}}
          onUpload={(key, file) =>
            setComplianceUploads((currentUploads) => ({
              ...currentUploads,
              [selectedLab.id]: {
                ...currentUploads[selectedLab.id],
                [key]: file,
              },
            }))
          }
          onClose={() => setIsComplianceModalOpen(false)}
        />
      )}
    </div>
  )
}
export default Lab_home