import { useState } from "react";
import LabSelector from "../UIparts/LabSelector";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadNotebook(storageKey) {
  try {
    const storedEntries = window.localStorage.getItem(storageKey);
    if (!storedEntries) return { entries: [], error: "" };

    const entries = JSON.parse(storedEntries);
    if (!Array.isArray(entries)) {
      throw new Error("Notebook data is not in the expected format.");
    }

    return { entries, error: "" };
  } catch (error) {
    return {
      entries: [],
      error: `Could not load saved notebook entries: ${error.message}`,
    };
  }
}

function loadFolders(storageKey) {
  try {
    const storedFolders = window.localStorage.getItem(storageKey);
    if (!storedFolders) return ["Unfiled"];

    const folders = JSON.parse(storedFolders);
    if (!Array.isArray(folders) || !folders.every((folder) => typeof folder === "string")) {
      throw new Error("Folder data is not in the expected format.");
    }

    return [...new Set(["Unfiled", ...folders])];
  } catch (error) {
    return {
      folders: ["Unfiled"],
      error: `Could not load notebook folders: ${error.message}`,
    };
  }
}

function ELN({ lab, selectedLabId, onSelectedLabChange }) {
  const storageKey = `research-aio-eln-lab-${selectedLabId}`;
  const foldersStorageKey = `${storageKey}-folders`;
  const [initialNotebook] = useState(() => loadNotebook(storageKey));
  const [entries, setEntries] = useState(initialNotebook.entries);
  const [initialFolders] = useState(() => loadFolders(foldersStorageKey));
  const [folders, setFolders] = useState(
    [
      ...(Array.isArray(initialFolders) ? initialFolders : initialFolders.folders),
      ...initialNotebook.entries.map((entry) => entry.folder || "Unfiled"),
    ].filter((folder, index, availableFolders) =>
      availableFolders.findIndex((candidate) => candidate.toLowerCase() === folder.toLowerCase()) === index,
    ),
  );
  const [storageError, setStorageError] = useState(
    initialNotebook.error || (Array.isArray(initialFolders) ? "" : initialFolders.error),
  );
  const [selectedEntryId, setSelectedEntryId] = useState(
    initialNotebook.entries[0]?.id ?? null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All folders");
  const [folderDraft, setFolderDraft] = useState("");
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [formError, setFormError] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    date: getToday(),
    experiment: "",
    folder: "Unfiled",
    objective: "",
    methods: "",
    observations: "",
    results: "",
  });

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) ?? null;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredEntries = entries.filter((entry) =>
    [
      entry.title,
      entry.folder,
      entry.experiment,
      entry.objective,
      entry.methods,
      entry.observations,
      entry.results,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
      && (selectedFolder === "All folders" || (entry.folder || "Unfiled") === selectedFolder),
  );

  function persistNotebook(nextEntries, nextFolders = folders) {
    setEntries(nextEntries);
    setFolders(nextFolders);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextEntries));
      window.localStorage.setItem(foldersStorageKey, JSON.stringify(nextFolders));
      setStorageError("");
    } catch (error) {
      setStorageError(`Could not save notebook: ${error.message}`);
    }
  }

  function handleCreateEntry(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.date) {
      setFormError("Enter an entry title and date.");
      return;
    }

    const entryDraft = {
      ...draft,
      title: draft.title.trim(),
      experiment: draft.experiment.trim(),
      folder: draft.folder || "Unfiled",
      objective: draft.objective.trim(),
      methods: draft.methods.trim(),
      observations: draft.observations.trim(),
      results: draft.results.trim(),
    };
    let updatedEntries;
    let savedEntry;
    if (editingEntryId !== null) {
      savedEntry = { ...entries.find((entry) => entry.id === editingEntryId), ...entryDraft };
      updatedEntries = entries.map((entry) =>
        entry.id === editingEntryId ? savedEntry : entry,
      );
    } else {
      savedEntry = {
        ...entryDraft,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
      };
      updatedEntries = [savedEntry, ...entries];
    }
    persistNotebook(updatedEntries);
    setSelectedEntryId(savedEntry.id);
    setDraft({
      title: "",
      date: getToday(),
      experiment: "",
      folder: "Unfiled",
      objective: "",
      methods: "",
      observations: "",
      results: "",
    });
    setFormError("");
    setIsEditingEntry(false);
    setEditingEntryId(null);
  }

  function startCreateEntry() {
    setDraft({
      title: "",
      date: getToday(),
      experiment: "",
      folder: selectedFolder === "All folders" ? "Unfiled" : selectedFolder,
      objective: "",
      methods: "",
      observations: "",
      results: "",
    });
    setEditingEntryId(null);
    setIsEditingEntry(true);
    setFormError("");
  }

  function startEditEntry() {
    if (!selectedEntry) return;
    setDraft({
      title: selectedEntry.title ?? "",
      date: selectedEntry.date ?? getToday(),
      experiment: selectedEntry.experiment ?? "",
      folder: selectedEntry.folder || "Unfiled",
      objective: selectedEntry.objective ?? "",
      methods: selectedEntry.methods ?? "",
      observations: selectedEntry.observations ?? "",
      results: selectedEntry.results ?? "",
    });
    setEditingEntryId(selectedEntry.id);
    setIsEditingEntry(true);
    setFormError("");
  }

  function handleCreateFolder(event) {
    event.preventDefault();
    const name = folderDraft.trim();
    if (
      !name
      || name.toLowerCase() === "all folders"
      || folders.some((folder) => folder.toLowerCase() === name.toLowerCase())
    ) return;
    const updatedFolders = [...folders, name];
    persistNotebook(entries, updatedFolders);
    setFolderDraft("");
    setSelectedFolder(name);
  }

  function handleCancelEntryEdit() {
    setIsEditingEntry(false);
    setEditingEntryId(null);
    setFormError("");
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="mx-auto min-h-full w-full max-w-7xl text-slate-900">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">Electronic lab notebook</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Lab notebook</h1>
          <p className="mt-1 text-sm text-slate-500">{lab.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LabSelector
            selectedLabId={selectedLabId}
            onSelectedLabChange={onSelectedLabChange}
          />
          <button
            type="button"
            onClick={isEditingEntry ? handleCancelEntryEdit : startCreateEntry}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {isEditingEntry ? "Cancel entry" : "New entry"}
          </button>
        </div>
      </header>

      {storageError && (
        <p role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {storageError}
        </p>
      )}

      {isEditingEntry ? (
        <form onSubmit={handleCreateEntry} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingEntryId !== null ? "Edit notebook entry" : "New notebook entry"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Entry title
              <input
                autoFocus
                required
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                className={inputClassName}
                placeholder="e.g. Cell culture observations"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Entry date
              <input
                type="date"
                required
                value={draft.date}
                onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                className={inputClassName}
              />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Related experiment (optional)
              <input
                value={draft.experiment}
                onChange={(event) => setDraft((current) => ({ ...current, experiment: event.target.value }))}
                className={inputClassName}
                placeholder="Experiment or project name"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Folder
              <select
                value={draft.folder}
                onChange={(event) => setDraft((current) => ({ ...current, folder: event.target.value }))}
                className={inputClassName}
              >
                {folders.map((folder) => <option key={folder} value={folder}>{folder}</option>)}
              </select>
            </label>
            {[
              ["objective", "Objective"],
              ["methods", "Methods and materials"],
              ["observations", "Observations"],
              ["results", "Results and conclusions"],
            ].map(([field, label]) => (
              <label key={field} className="text-sm font-medium text-slate-700 sm:col-span-2">
                {label}
                <textarea
                  rows={field === "objective" ? 2 : 4}
                  value={draft[field]}
                  onChange={(event) => setDraft((current) => ({ ...current, [field]: event.target.value }))}
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
          {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}
          <div className="flex justify-end">
            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              {editingEntryId !== null ? "Save changes" : "Save notebook entry"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,2fr)]">
          <section className="flex max-h-[75vh] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="shrink-0 text-sm font-semibold text-slate-900">Notebook folders</h2>
            <form onSubmit={handleCreateFolder} className="mt-3 flex shrink-0 gap-2">
              <label className="sr-only" htmlFor="eln-new-folder">New folder name</label>
              <input
                id="eln-new-folder"
                value={folderDraft}
                onChange={(event) => setFolderDraft(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Create folder..."
              />
              <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Add
              </button>
            </form>
            <nav aria-label="Notebook folders" className="mt-3 shrink-0 space-y-1">
              {["All folders", ...folders].map((folder) => (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setSelectedFolder(folder)}
                  aria-current={selectedFolder === folder ? "page" : undefined}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedFolder === folder ? "bg-blue-50 font-semibold text-blue-900" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {folder}
                  <span className="float-right text-xs text-slate-400">
                    {folder === "All folders"
                      ? entries.length
                      : entries.filter((entry) => (entry.folder || "Unfiled") === folder).length}
                  </span>
                </button>
              ))}
            </nav>
            <label className="sr-only" htmlFor="eln-search">Search notebook entries</label>
            <input
              id="eln-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`${inputClassName} mb-3 shrink-0`}
              placeholder="Search entries..."
            />
            <h3 className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">Entries</h3>
            {filteredEntries.length ? (
              <ul className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
                {filteredEntries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedEntryId(entry.id)}
                      aria-current={selectedEntryId === entry.id ? "true" : undefined}
                      className={`w-full rounded-lg px-3 py-3 text-left transition ${
                        selectedEntryId === entry.id ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="block truncate text-sm font-semibold">{entry.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {entry.date}{entry.experiment ? ` · ${entry.experiment}` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">
                {entries.length ? "No entries match your search." : "No notebook entries yet."}
              </p>
            )}
          </section>

          <article className="min-h-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {selectedEntry ? (
              <>
                <header className="border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        {selectedEntry.date}{selectedEntry.experiment ? ` · ${selectedEntry.experiment}` : ""}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedEntry.title}</h2>
                      <p className="mt-1 text-xs font-medium text-blue-700">{selectedEntry.folder || "Unfiled"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={startEditEntry}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit entry
                    </button>
                  </div>
                </header>
                <div className="mt-5 space-y-5">
                  {[
                    ["Objective", selectedEntry.objective],
                    ["Methods and materials", selectedEntry.methods],
                    ["Observations", selectedEntry.observations],
                    ["Results and conclusions", selectedEntry.results],
                  ].map(([heading, content]) => content && (
                    <section key={heading}>
                      <h3 className="text-sm font-semibold text-slate-700">{heading}</h3>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{content}</p>
                    </section>
                  ))}
                  {!selectedEntry.objective && !selectedEntry.methods && !selectedEntry.observations && !selectedEntry.results && (
                    <p className="text-sm text-slate-500">This entry has no additional notes.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <h2 className="text-lg font-semibold text-slate-800">Your lab notebook</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Select an entry to read it, or create a new entry to document your research.
                </p>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
}

export default ELN;
