function getInventoryStorageKey(labId) {
  return `research-aio-inventory-lab-${labId}`;
}

function getScheduleStorageKey(labId) {
  return labId === 1
    ? "research-aio-scheduled-experiments"
    : `research-aio-scheduled-experiments-lab-${labId}`;
}

function parseAmount(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^\s*([\d,]+(?:\.\d+)?)\s*(.*?)\s*$/);
  if (!match?.[2]) return null;
  return {
    quantity: Number(match[1].replaceAll(",", "")),
    unit: normalizeUnit(match[2]),
  };
}

function normalizeUnit(unit) {
  return String(unit).replace(/[µμ]/g, "u").trim().toLowerCase();
}

function calculateSupplyInventory(items, experiments, previousLedger) {
  if (
    !Array.isArray(items)
    || !Array.isArray(experiments)
    || !previousLedger
    || typeof previousLedger !== "object"
    || Array.isArray(previousLedger)
  ) {
    throw new Error("Inventory or consumption ledger data is not in the expected format.");
  }

  const warnings = new Set();
  const itemByName = new Map(
    items
      .filter((item) => item.category !== "Equipment")
      .map((item) => [item.name.trim().toLowerCase(), item]),
  );
  const oldTotals = new Map();
  Object.values(previousLedger).forEach((experimentUsage) => {
    Object.entries(experimentUsage).forEach(([itemId, quantity]) => {
      oldTotals.set(itemId, (oldTotals.get(itemId) ?? 0) + Number(quantity));
    });
  });

  const availableByItem = new Map(
    items.map((item) => {
      const currentQuantity = Number(item.amount?.quantity);
      const restoredQuantity = currentQuantity + (oldTotals.get(String(item.id)) ?? 0);
      return [String(item.id), Math.max(0, restoredQuantity)];
    }),
  );
  const nextLedger = {};
  const activeExperiments = experiments.filter(
    (experiment) => ["In Progress", "Completed"].includes(experiment.status),
  );

  activeExperiments.forEach((experiment) => {
    const experimentUsage = {};
    (experiment.Resources_Needed ?? []).forEach((resource) => {
      const supplyName = String(resource.name ?? "").trim();
      const item = itemByName.get(supplyName.toLowerCase());
      const needed = parseAmount(resource.Amount_needed);
      if (!item) {
        warnings.add(
          `${experiment.name}: no Supply inventory item matches "${supplyName || "unnamed supply"}".`,
        );
        return;
      }
      if (!needed) {
        warnings.add(
          `${experiment.name}: could not read the required amount for "${supplyName}".`,
        );
        return;
      }
      if (normalizeUnit(item.amount?.unit) !== needed.unit) {
        warnings.add(
          `${experiment.name}: "${supplyName}" uses ${item.amount?.unit || "no unit"} in inventory but requires ${needed.unit}.`,
        );
        return;
      }

      const itemId = String(item.id);
      const available = availableByItem.get(itemId) ?? 0;
      const consumed = Math.min(available, needed.quantity);
      if (consumed < needed.quantity) {
        warnings.add(
          `${experiment.name}: only ${consumed} ${item.amount.unit} of "${supplyName}" could be deducted; ${needed.quantity} ${item.amount.unit} is required.`,
        );
      }
      if (consumed > 0) {
        experimentUsage[itemId] = (experimentUsage[itemId] ?? 0) + consumed;
        availableByItem.set(itemId, available - consumed);
      }
    });
    if (Object.keys(experimentUsage).length) {
      nextLedger[String(experiment.id)] = experimentUsage;
    }
  });

  const nextTotals = new Map();
  Object.values(nextLedger).forEach((experimentUsage) => {
    Object.entries(experimentUsage).forEach(([itemId, quantity]) => {
      nextTotals.set(itemId, (nextTotals.get(itemId) ?? 0) + quantity);
    });
  });
  const reconciledItems = items.map((item) => {
    const itemId = String(item.id);
    const baseline = Number(item.amount?.quantity) + (oldTotals.get(itemId) ?? 0);
    const quantity = Math.max(0, baseline - (nextTotals.get(itemId) ?? 0));
    return {
      ...item,
      amount: {
        ...item.amount,
        quantity: Number(quantity.toFixed(6)),
      },
    };
  });

  const updatedExperiments = experiments.map((experiment) => ({
    ...experiment,
    Resources_Needed: (experiment.Resources_Needed ?? []).map((resource) => {
      const item = itemByName.get(String(resource.name).trim().toLowerCase());
      const needed = parseAmount(resource.Amount_needed);
      if (!item || !needed || normalizeUnit(item.amount?.unit) !== needed.unit) return resource;
      const currentItem = reconciledItems.find((candidate) => String(candidate.id) === String(item.id));
      return {
        ...resource,
        Amount_Left: `${currentItem.amount.quantity} ${currentItem.amount.unit}`,
      };
    }),
  }));
  return {
    items: reconciledItems,
    experiments: updatedExperiments,
    ledger: nextLedger,
    warnings: [...warnings],
  };
}

function reconcileSupplyInventory(labId, experiments, inventoryItemsOverride) {
  const inventoryKey = getInventoryStorageKey(labId);
  const ledgerKey = `research-aio-supply-consumption-lab-${labId}`;
  const storedItems = window.localStorage.getItem(inventoryKey);
  if (!storedItems && !inventoryItemsOverride) return null;

  const items = inventoryItemsOverride ?? JSON.parse(storedItems);
  const previousLedger = JSON.parse(window.localStorage.getItem(ledgerKey) ?? "{}");
  const reconciliation = calculateSupplyInventory(items, experiments, previousLedger);
  window.localStorage.setItem(inventoryKey, JSON.stringify(reconciliation.items));
  window.localStorage.setItem(ledgerKey, JSON.stringify(reconciliation.ledger));
  window.localStorage.setItem(
    `research-aio-experiment-records-lab-${labId}`,
    JSON.stringify(reconciliation.experiments),
  );
  return reconciliation;
}

function isEquipmentInUse(labId, equipmentName, now = new Date()) {
  const scheduledExperiments = JSON.parse(
    window.localStorage.getItem(getScheduleStorageKey(labId)) ?? "[]",
  );
  if (!Array.isArray(scheduledExperiments)) {
    throw new Error("Scheduled experiment data is not in the expected format.");
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const normalizedName = equipmentName.trim().toLowerCase();

  return scheduledExperiments.some((event) => {
    if (!event.date || !event.tools) return false;
    const eventDate = new Date(`${event.date}T00:00:00`);
    if (Number.isNaN(eventDate.getTime())) return false;
    const dayOffset = Math.round((todayStart - eventDate) / (24 * 60 * 60 * 1000));
    if (dayOffset !== 0 && dayOffset !== 1) return false;

    const tools = Array.isArray(event.tools)
      ? event.tools
      : String(event.tools).split(",").map((tool) => tool.trim());
    if (!tools.some((tool) => String(tool).toLowerCase() === normalizedName)) return false;

    const startMinutes = timeToMinutes(event.time);
    let endMinutes = timeToMinutes(event.endTime ?? "");
    if (event.endTime && endMinutes <= startMinutes) endMinutes += 24 * 60;
    if (!event.endTime) endMinutes = startMinutes + 60;
    if (dayOffset === 1 && endMinutes <= 24 * 60) return false;
    const relativeCurrentMinutes = currentMinutes + dayOffset * 24 * 60;
    return relativeCurrentMinutes >= startMinutes && relativeCurrentMinutes < endMinutes;
  });
}

function getEquipmentSchedule(labId, equipmentName) {
  const scheduledExperiments = JSON.parse(
    window.localStorage.getItem(getScheduleStorageKey(labId)) ?? "[]",
  );
  if (!Array.isArray(scheduledExperiments)) {
    throw new Error("Scheduled experiment data is not in the expected format.");
  }

  const normalizedName = equipmentName.trim().toLowerCase();
  return scheduledExperiments
    .filter((event) => {
      if (!event.date || !event.tools) return false;
      const tools = Array.isArray(event.tools)
        ? event.tools
        : String(event.tools).split(",").map((tool) => tool.trim());
      return tools.some((tool) => String(tool).toLowerCase() === normalizedName);
    })
    .sort((left, right) =>
      left.date.localeCompare(right.date)
      || String(left.time ?? "").localeCompare(String(right.time ?? "")),
    );
}

function timeToMinutes(time) {
  if (!/^\d{1,2}:\d{2}$/.test(String(time))) return Number.NaN;
  const [hours = "0", minutes = "0"] = String(time).split(":");
  const result = Number(hours) * 60 + Number(minutes);
  return Number(hours) < 24 && Number(minutes) < 60 ? result : Number.NaN;
}

export {
  calculateSupplyInventory,
  getEquipmentSchedule,
  getInventoryStorageKey,
  isEquipmentInUse,
  reconcileSupplyInventory,
};
