import { useState } from "react";
import CertificationsTrainingModal from "../UIparts/CertificationsTrainingModal";
import LabSelector from "../UIparts/LabSelector";
import LabDetailsModal from "../UIparts/LabDetailsModal";
import LabHomeItemModal from "../UIparts/LabHomeItemModal";
import LabMembersModal from "../UIparts/LabMembersModal";
import {
  canManageLabContent,
  getLabHomeStorageKey,
  getLabMembersStorageKey,
  isLabOwner,
} from "../utils/labHome";
import { labs } from "./Labs";

const labHomeExamples = {
  1: {
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
},
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
  }
};


function loadLabHomeContent(labId) {
  const lab = labs.find(({ id }) => id === labId) ?? labs[0];
  const example = labHomeExamples[labId] ?? {};
  const defaultContent = {
    ...example,
    name: example.name ?? lab.name,
    organization: {
      ...(typeof example.organization === "object" ? example.organization : {}),
      name: example.organization?.name ?? lab.organization,
      organizationImageUrl: example.organization?.organizationImageUrl ?? lab.organizationImageUrl,
    },
    type: example.type ?? lab.type,
    description: example.description ?? lab.description,
    email: example.email ?? "",
    phone: example.phone ?? "",
    biosafetyLevel: example.biosafetyLevel ?? "",
    principalInvestigator: example.principalInvestigator ?? { name: "", title: "Principal Investigator" },
    location: {
      ...lab.location,
      ...example.location,
      campus: example.location?.campus ?? "",
      building: example.location?.building ?? lab.location.building,
      address: example.location?.address ?? "",
      room: example.location?.room ?? lab.location.room,
      rooms: example.location?.rooms ?? `Room ${lab.location.room}`,
      city: example.location?.city ?? lab.location.city,
      state: example.location?.state ?? lab.location.state,
    },
    statistics: example.statistics ?? { members: 0, activeProjects: 0, publications: 0 },
    certifications: example.certifications ?? [],
    trainings: example.trainings ?? [],
    announcements: example.announcements ?? [],
    attentionItems: example.attentionItems ?? [],
    papers: example.papers ?? [],
  };

  try {
    const storedContent = window.localStorage.getItem(getLabHomeStorageKey(labId));
    if (!storedContent) return { content: defaultContent, error: "" };

    const parsedContent = JSON.parse(storedContent);
    if (!parsedContent || typeof parsedContent !== "object" || Array.isArray(parsedContent)) {
      throw new Error("Saved lab home data is not in the expected format.");
    }

    return {
      content: {
        ...defaultContent,
        ...parsedContent,
      },
      error: "",
    };
  } catch (error) {
    return {
      content: defaultContent,
      error: `Could not load saved lab home items: ${error.message}`,
    };
  }
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createLabHomeItemId() {
  return crypto.randomUUID();
}

function loadLabMembers(labId) {
  try {
    const storedMembers = window.localStorage.getItem(getLabMembersStorageKey(labId));
    if (!storedMembers) return { members: [], error: "" };

    const members = JSON.parse(storedMembers);
    if (
      !Array.isArray(members) ||
      members.some((member) =>
        !member ||
        typeof member.email !== "string" ||
        !["Admin", "Member", "Viewer"].includes(member.role)
      )
    ) {
      throw new Error("Saved member permissions are not in the expected format.");
    }

    return { members, error: "" };
  } catch (error) {
    return { members: [], error: `Could not load lab members: ${error.message}` };
  }
}

function Lab_home({ selectedLabId, onSelectedLabChange, userEmail }) {
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [complianceUploads, setComplianceUploads] = useState({});
  const [contentState, setContentState] = useState(() => loadLabHomeContent(selectedLabId));
  const [activeAddType, setActiveAddType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [membersState, setMembersState] = useState(() => loadLabMembers(selectedLabId));
  const selectedLab = labs.find(({ id }) => id === selectedLabId) ?? labs[0];
  const isOwner = isLabOwner(selectedLab, userEmail);
  const canManageLab = canManageLabContent(selectedLab, userEmail, membersState.members);
  const selectedLabContent = contentState.content;

  function updateMembers(nextMembers) {
    if (!isOwner) return "Only the lab owner can change member permissions.";
    try {
      window.localStorage.setItem(
        getLabMembersStorageKey(selectedLab.id),
        JSON.stringify(nextMembers),
      );
      setMembersState({ members: nextMembers, error: "" });
      return "";
    } catch (error) {
      return `Could not save lab member permissions: ${error.message}`;
    }
  }

  function updateLabContent(update) {
    const nextContent = update(selectedLabContent);
    setContentState({ content: nextContent, error: "" });

    try {
      window.localStorage.setItem(
        getLabHomeStorageKey(selectedLab.id),
        JSON.stringify(nextContent),
      );
    } catch (error) {
      setContentState({
        content: nextContent,
        error: `Could not save lab home items: ${error.message}`,
      });
    }
  }

  function openAddForm(type, item = null) {
    setEditingItem(item);
    setActiveAddType(type);
  }

  function handleAddItem(event) {
    event.preventDefault();
    if (!canManageLab) return;
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const id = editingItem?.id ?? createLabHomeItemId();
    let item;
    let collection;

    if (activeAddType === "announcement") {
      collection = "announcements";
      item = { id, title, description, date: editingItem?.date ?? getTodayLabel() };
    } else if (activeAddType === "attention") {
      collection = "attentionItems";
      item = {
        id,
        title,
        description,
        priority: formData.get("priority"),
        category: String(formData.get("category") ?? "").trim(),
      };
    } else {
      collection = "papers";
      item = {
        id,
        title,
        authors: String(formData.get("authors") ?? "").split(",").map((author) => author.trim()).filter(Boolean),
        journal: String(formData.get("journal") ?? "").trim(),
        year: Number(formData.get("year")),
        tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
        url: String(formData.get("url") ?? "").trim() || "#",
      };
    }

    updateLabContent((currentContent) => ({
      ...currentContent,
      [collection]: editingItem
        ? currentContent[collection].map((currentItem) => currentItem.id === id ? item : currentItem)
        : [...currentContent[collection], item],
    }));
    setActiveAddType("");
    setEditingItem(null);
  }

  function handleDeleteItem(collection, id) {
    if (!canManageLab) return;
    updateLabContent((currentContent) => ({
      ...currentContent,
      [collection]: currentContent[collection].filter((item) => item.id !== id),
    }));
  }

  function handleSaveLabDetails(event) {
    event.preventDefault();
    if (!canManageLab) return;
    const formData = new FormData(event.currentTarget);
    updateLabContent((currentContent) => ({
      ...currentContent,
      name: String(formData.get("name")).trim(),
      type: String(formData.get("type")).trim(),
      description: String(formData.get("description")).trim(),
      organization: {
        ...currentContent.organization,
        name: String(formData.get("organization")).trim(),
        organizationImageUrl: String(formData.get("organizationImageUrl")).trim(),
      },
      email: String(formData.get("email")).trim(),
      phone: String(formData.get("phone")).trim(),
      biosafetyLevel: String(formData.get("biosafetyLevel")).trim(),
      principalInvestigator: {
        name: String(formData.get("principalInvestigatorName")).trim(),
        title: String(formData.get("principalInvestigatorTitle")).trim(),
      },
      location: {
        ...currentContent.location,
        institution: String(formData.get("institution")).trim(),
        campus: String(formData.get("campus")).trim(),
        building: String(formData.get("building")).trim(),
        address: String(formData.get("address")).trim(),
        room: String(formData.get("room")).trim(),
        rooms: `Room ${String(formData.get("room")).trim()}`,
        city: String(formData.get("city")).trim(),
        state: String(formData.get("state")).trim(),
      },
      statistics: {
        members: Number(formData.get("members")),
        activeProjects: Number(formData.get("activeProjects")),
        publications: Number(formData.get("publications")),
      },
    }));
    setIsDetailsModalOpen(false);
  }

  return (
    <div className="mx-auto w-full space-y-8 text-slate-900">
      {contentState.error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {contentState.error}
        </p>
      )}
      {membersState.error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {membersState.error}
        </p>
      )}
      {!canManageLab && !selectedLab.ownerEmail && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Lab editing is read-only until an owner email is configured for this lab.
        </p>
      )}
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-label={`${selectedLabContent.organization.name} logo`}
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white"
            >
              <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 150 150">
                <image
                  href={selectedLabContent.organization.organizationImageUrl}
                  width="150"
                  height="150"
                  preserveAspectRatio="xMidYMid meet"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-500">{selectedLabContent.organization.name}</p>
              <p className="mt-1 text-sm text-slate-500">{selectedLabContent.type}</p>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {selectedLabContent.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{selectedLabContent.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <LabSelector
              selectedLabId={selectedLabId}
              onSelectedLabChange={onSelectedLabChange}
              userEmail={userEmail}
            />
            <button
              type="button"
              onClick={() => setIsComplianceModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Certifications &amp; training
            </button>
            {canManageLab && (
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit lab details
              </button>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsMembersModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Manage members
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <p className="mt-1 font-medium text-slate-800">
              {selectedLabContent.location.building}, Room {selectedLabContent.location.room}
            </p>
            <p className="text-slate-500">
              {selectedLabContent.location.institution} · {selectedLabContent.location.city}, {selectedLabContent.location.state}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Research area</p>
            <p className="mt-1 font-medium text-slate-800">{selectedLabContent.type}</p>
          </div>
        </div>
      </header>

      {/* <section aria-label="Lab overview" className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Lab members", value: selectedLabContent.statistics.members },
          { label: "Active projects", value: selectedLabContent.statistics.activeProjects },
          { label: "Publications", value: selectedLabContent.statistics.publications },
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

      <section aria-label="Updates and items needing attention" className="h-[300px] grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
              <p className="mt-1 text-sm text-slate-500">News and updates from your lab</p>
            </div>
            <div className="flex items-center gap-2 -mt-4">
              {canManageLab && <button
                type="button"
                onClick={() => openAddForm("announcement")}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>}
            </div>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {selectedLabContent.announcements.map((announcement) => (
              <li key={announcement.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium text-blue-500">{announcement.date}</p>
                  <h3 className="mt-1 font-semibold text-slate-800">{announcement.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{announcement.description}</p>
                </div>
                {canManageLab && (
                  <div className="flex shrink-0 items-center gap-2">
                    {/* <button
                      type="button"
                      onClick={() => openAddForm("announcement", announcement)}
                      aria-label={`Edit announcement: ${announcement.title}`}
                      className="text-sm font-medium text-blue-700 hover:underline"
                    >
                      Edit
                    </button> */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem("announcements", announcement.id)}
                      aria-label={`Delete announcement: ${announcement.title}`}
                      className="text-lg font-medium text-gray-600 hover:text-gray-900"
                    >
                      x
                    </button>
                  </div>
                )}
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
            <div className="flex items-center gap-2">
              {canManageLab && <button
                type="button"
                onClick={() => openAddForm("attention")}
                className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 -mt-3"
              >
                Add
              </button>}
            </div>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {selectedLabContent.attentionItems.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
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
                </div>
                {canManageLab && (
                  <div className="flex shrink-0 items-center gap-2">
                    {/* <button
                      type="button"
                      onClick={() => openAddForm("attention", item)}
                      aria-label={`Edit attention item: ${item.title}`}
                      className="text-sm font-medium text-blue-700 hover:underline"
                    >
                      Edit
                    </button> */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem("attentionItems", item.id)}
                      aria-label={`Delete attention item: ${item.title}`}
                      className="text-lg font-medium text-gray-600 hover:text-gray-900"
                    >
                      x
                    </button>
                  </div>
                )}
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
          <div className="flex items-center gap-2">
            {canManageLab && <button
              type="button"
              onClick={() => openAddForm("publication")}
              className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add publication
            </button>}
          </div>
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {selectedLabContent.papers.map((publication) => (
            <li key={publication.id} className="flex flex-col rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                {publication.journal} · {publication.year}
              </p>
              <h3 className="mt-2 flex-1 font-semibold leading-5 text-slate-800">{publication.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{publication.authors.join(", ")}</p>
              {publication.url && publication.url !== "#" && (
                <p className="mt-2 text-sm leading-5 text-slate-600">
                  <a href={publication.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-800 underline">
                    Read full paper
                  </a>
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {publication.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            <div className="mt-4 flex gap-2">
                 {canManageLab && (
              <button
                type="button"
                onClick={() => openAddForm("publication", publication)}
                aria-label={`Edit publication: ${publication.title}`}
                className=" self-start rounded px-2 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              )}
              {canManageLab && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem("papers", publication.id)}
                  aria-label={`Delete publication: ${publication.title}`}
                  className="self-start rounded px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Delete
                </button>
              )}
            </div>
            </li>
          ))}
        </ul>
      </section>
      {isDetailsModalOpen && canManageLab && (
        <LabDetailsModal
          labContent={selectedLabContent}
          onClose={() => setIsDetailsModalOpen(false)}
          onSubmit={handleSaveLabDetails}
        />
      )}
      {isMembersModalOpen && isOwner && (
        <LabMembersModal
          labName={selectedLabContent.name}
          ownerEmail={selectedLab.ownerEmail}
          members={membersState.members}
          onChange={updateMembers}
          onClose={() => setIsMembersModalOpen(false)}
        />
      )}
      {activeAddType && canManageLab && (
        <LabHomeItemModal
          type={activeAddType}
          item={editingItem}
          labName={selectedLabContent.name}
          onClose={() => {
            setActiveAddType("");
            setEditingItem(null);
          }}
          onSubmit={handleAddItem}
        />
      )}
      {isComplianceModalOpen && (
        <CertificationsTrainingModal
          certifications={selectedLabContent.certifications}
          trainings={selectedLabContent.trainings}
          canManage={canManageLab}
          onUpdate={(collection, items) =>
            updateLabContent((currentContent) => ({
              ...currentContent,
              [collection]: items,
            }))
          }
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