import { useState } from "react";
import Modal from "./Modal";

function getInitialDraft(experiment) {
  return {
    name: experiment?.name ?? "",
    description: experiment?.description ?? "",
    status: experiment?.status ?? "Planned",
    leader: experiment?.leader?.name ?? "",
    startDate: experiment?.schedule?.startDate ?? "",
    endDate: experiment?.schedule?.endDate ?? "",
    protocolName: experiment?.protocol?.name ?? "",
    protocolVersion: experiment?.protocol?.version ?? "",
    protocolSteps: experiment?.protocol?.steps?.join("\n") ?? "",
  };
}

function ExperimentModal({ experiment, onClose, onSave }) {
  const [draft, setDraft] = useState(() => getInitialDraft(experiment));

  function updateField(event) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const status = draft.status;
    const protocolSteps = draft.protocolSteps
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    onSave({
      ...experiment,
      id: experiment?.id ?? Date.now(),
      name: draft.name.trim(),
      description: draft.description.trim(),
      status,
      leader: {
        ...experiment?.leader,
        name: draft.leader.trim(),
        profileImageUrl:
          experiment?.leader?.profileImageUrl ?? "https://i.pravatar.cc/150?img=5",
      },
      isRunning: status === "In Progress",
      schedule:
        draft.startDate || draft.endDate
          ? {
              startDate: draft.startDate || null,
              endDate: draft.endDate || null,
            }
          : null,
      protocol: {
        ...experiment?.protocol,
        name: draft.protocolName.trim(),
        version: draft.protocolVersion.trim(),
        steps: protocolSteps,
      },
      notes: experiment?.notes ?? [],
      attachments: experiment?.attachments ?? [],
    });
  }

  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <Modal
      titleId="experiment-modal-title"
      onClose={onClose}
      className="max-w-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Experiment details
          </p>
          <h2
            id="experiment-modal-title"
            className="mt-1 text-2xl font-bold text-slate-900"
          >
            {experiment ? "Edit experiment" : "Add experiment"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the experiment overview, schedule, and protocol information.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close experiment form"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Experiment name
            </span>
            <input
              name="name"
              value={draft.name}
              onChange={updateField}
              required
              className={inputClassName}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              name="description"
              value={draft.description}
              onChange={updateField}
              rows={3}
              required
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              name="status"
              value={draft.status}
              onChange={updateField}
              className={inputClassName}
            >
              <option>Planned</option>
              <option>In Progress</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Experiment lead</span>
            <input
              name="leader"
              value={draft.leader}
              onChange={updateField}
              required
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Start date</span>
            <input
              name="startDate"
              type="date"
              value={draft.startDate}
              onChange={updateField}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">End date</span>
            <input
              name="endDate"
              type="date"
              value={draft.endDate}
              onChange={updateField}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Protocol name</span>
            <input
              name="protocolName"
              value={draft.protocolName}
              onChange={updateField}
              required
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Protocol version</span>
            <input
              name="protocolVersion"
              value={draft.protocolVersion}
              onChange={updateField}
              required
              className={inputClassName}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Protocol steps
            </span>
            <textarea
              name="protocolSteps"
              value={draft.protocolSteps}
              onChange={updateField}
              rows={4}
              placeholder="Enter one step per line"
              className={inputClassName}
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {experiment ? "Save changes" : "Add experiment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ExperimentModal;
