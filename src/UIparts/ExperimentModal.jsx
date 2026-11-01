import { useState } from "react";
import Modal from "./Modal";

function parseAmount(value) {
  const match = String(value ?? "").match(/^\s*([\d,]+(?:\.\d+)?)\s*(.*?)\s*$/);
  if (!match?.[2]) return null;
  return {
    quantity: Number(match[1].replaceAll(",", "")),
    unit: match[2],
  };
}

function getInitialDraft(experiment, inventoryItems) {
  const supplies = inventoryItems.filter((item) => (item.category ?? "Supply") === "Supply");
  const equipment = inventoryItems.filter((item) => item.category === "Equipment");
  const selectedSupplyIds = [];
  const supplyAmounts = {};
  const retainedResources = [];

  (experiment?.Resources_Needed ?? []).forEach((resource) => {
    const inventoryItem = supplies.find(
      (item) => item.name.trim().toLowerCase() === String(resource.name).trim().toLowerCase(),
    );
    const amount = parseAmount(resource.Amount_needed);
    if (!inventoryItem || !amount) {
      retainedResources.push(resource);
      return;
    }

    const itemId = String(inventoryItem.id);
    if (!selectedSupplyIds.includes(itemId)) selectedSupplyIds.push(itemId);
    supplyAmounts[itemId] = (Number(supplyAmounts[itemId]) || 0) + amount.quantity;
  });

  const existingTools = (Array.isArray(experiment?.tools)
    ? experiment.tools
    : String(experiment?.tools ?? "").split(",")
  ).map((tool) => String(tool).trim()).filter(Boolean);
  const selectedEquipmentIds = equipment
    .filter((item) => existingTools.some(
      (tool) => tool.toLowerCase() === item.name.trim().toLowerCase(),
    ))
    .map((item) => String(item.id));
  const additionalEquipment = existingTools.filter(
    (tool) => !equipment.some((item) => item.name.trim().toLowerCase() === tool.toLowerCase()),
  );

  return {
    name: experiment?.name ?? "",
    description: experiment?.description ?? "",
    status: experiment?.status ?? "Planned",
    leader: experiment?.leader?.name ?? "",
    selectedSupplyIds,
    supplyAmounts,
    retainedResources,
    selectedEquipmentIds,
    additionalEquipment: additionalEquipment.join(", "),
    startDate: experiment?.schedule?.startDate ?? "",
    endDate: experiment?.schedule?.endDate ?? "",
    protocolName: experiment?.protocol?.name ?? "",
    protocolVersion: experiment?.protocol?.version ?? "",
    protocolSteps: experiment?.protocol?.steps?.join("\n") ?? "",
  };
}

function ExperimentModal({
  experiment,
  newExperimentId,
  inventoryItems,
  onClose,
  onSave,
}) {
  const supplies = inventoryItems.filter((item) => (item.category ?? "Supply") === "Supply");
  const equipment = inventoryItems.filter((item) => item.category === "Equipment");
  const [draft, setDraft] = useState(() => getInitialDraft(experiment, inventoryItems));

  function updateField(event) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  }

  function toggleInventorySelection(field, id) {
    const itemId = String(id);
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].includes(itemId)
        ? currentDraft[field].filter((selectedId) => selectedId !== itemId)
        : [...currentDraft[field], itemId],
    }));
  }

  function updateSupplyAmount(id, quantity) {
    const itemId = String(id);
    setDraft((currentDraft) => ({
      ...currentDraft,
      supplyAmounts: { ...currentDraft.supplyAmounts, [itemId]: quantity },
    }));
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
      id: experiment?.id ?? newExperimentId,
      name: draft.name.trim(),
      description: draft.description.trim(),
      status,
      tools: [
        ...equipment
          .filter((item) => draft.selectedEquipmentIds.includes(String(item.id)))
          .map((item) => item.name.trim()),
        ...draft.additionalEquipment
        .split(",")
        .map((tool) => tool.trim())
        .filter(Boolean)
      ].filter((tool, index, tools) =>
        tools.findIndex((candidate) => candidate.toLowerCase() === tool.toLowerCase()) === index,
      ).join(", "),
      Resources_Needed: [
        ...draft.retainedResources,
        ...supplies
          .filter((item) => draft.selectedSupplyIds.includes(String(item.id)))
          .map((item) => ({
            id: (experiment?.Resources_Needed ?? []).find(
              (resource) => resource.name.trim().toLowerCase() === item.name.trim().toLowerCase(),
            )?.id ?? item.id,
            name: item.name,
            Amount_Left: `${item.amount.quantity} ${item.amount.unit}`,
            Amount_needed: `${Number(draft.supplyAmounts[item.id] ?? 0)} ${item.amount.unit}`,
          })),
      ],
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
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Supplies needed</span>
            {supplies.length === 0 ? (
              <p className="mt-1 text-sm text-slate-500">
                No supplies in this lab&apos;s inventory yet. Add them in Inventory before selecting them here.
              </p>
            ) : (
              <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {supplies.map((item) => {
                  const itemId = String(item.id);
                  const isSelected = draft.selectedSupplyIds.includes(itemId);
                  return (
                    <div key={itemId} className="flex flex-wrap items-center gap-3">
                      <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleInventorySelection("selectedSupplyIds", itemId)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{item.name}</span>
                        <span className="shrink-0 text-xs text-slate-500">
                          ({item.amount.quantity} {item.amount.unit} available)
                        </span>
                      </label>
                      {isSelected && (
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          Needed
                          <input
                            type="number"
                            min="0"
                            step="any"
                            required
                            value={draft.supplyAmounts[itemId] ?? ""}
                            onChange={(event) => updateSupplyAmount(itemId, event.target.value)}
                            aria-label={`Amount of ${item.name} needed`}
                            className={`${inputClassName} mt-0 w-24`}
                          />
                          {item.amount.unit}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {draft.retainedResources.length > 0 && (
              <p className="mt-2 text-xs text-amber-700">
                Existing supply requirements not matched to inventory will be kept unchanged.
              </p>
            )}
          </label>
          <div className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Equipment needed</span>
            {equipment.length === 0 ? (
              <p className="mt-1 text-sm text-slate-500">
                No equipment in this lab&apos;s inventory yet. Add equipment in Inventory before selecting it here.
              </p>
            ) : (
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {equipment.map((item) => {
                  const itemId = String(item.id);
                  return (
                    <label key={itemId} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={draft.selectedEquipmentIds.includes(itemId)}
                        onChange={() => toggleInventorySelection("selectedEquipmentIds", itemId)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {item.name}
                    </label>
                  );
                })}
              </div>
            )}
            <label className="mt-3 block text-sm text-slate-700">
              Additional equipment (optional)
              <input
                name="additionalEquipment"
                value={draft.additionalEquipment}
                onChange={updateField}
                placeholder="Comma-separated equipment not in inventory"
                className={inputClassName}
              />
            </label>
          </div>
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
