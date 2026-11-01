import { useEffect, useState } from "react";
import ItemModal from "../UIparts/item_modal";
import NewItemModal from "../UIparts/New_Item_modal";
import LabSelector from "../UIparts/LabSelector";
import {
  calculateSupplyInventory,
  getEquipmentSchedule,
  getInventoryStorageKey,
  isEquipmentInUse,
  reconcileSupplyInventory,
} from "../utils/inventory";
// eslint-disable-next-line react-refresh/only-export-components
export const inventoryItems = [
{
  id: 1,
  category: "Supply",
  name: "Anti-GFP Antibody",
  imageUrl: "https://placehold.co/300x200?text=Anti-GFP+Antibody",
  description:
    "Primary antibody used to detect GFP-tagged proteins in biological samples.",
  price: 249.99,
  location: {
    building: "Life Sciences Building",
    room: "Lab 204",
    storageUnit: "Freezer 2",
    shelf: "Shelf B",
    temperature: "-20°C",
  },
  experimentsUsedIn: [
    "Western Blot – GFP Expression",
    "Immunofluorescence – Neuron Imaging",
  ],
  amount: {
    quantity: 750,
    unit: "µL",
  },
},
{
  id: 2,
  category: "Supply",
  name: "DMEM Cell Culture Medium",
  imageUrl: "https://placehold.co/300x200?text=DMEM",
  description:
    "High-glucose culture medium used to support mammalian cell growth.",
  price: 48.5,
  location: {
    building: "Life Sciences Building",
    room: "Cell Culture Room 210",
    storageUnit: "Refrigerator 1",
    shelf: "Shelf C",
    temperature: "4°C",
  },
  experimentsUsedIn: [
    "HEK293 Cell Culture",
    "Lentiviral Transduction Study",
  ],
  amount: {
    quantity: 3,
    unit: "500 mL bottles",
  },
},
{
  id: 3,
  category: "Supply",
  name: "Lipofectamine 3000",
  imageUrl: "https://placehold.co/300x200?text=Lipofectamine+3000",
  description:
    "Lipid-based transfection reagent for introducing DNA and RNA into cells.",
  price: 625,
  location: {
    building: "Life Sciences Building",
    room: "Lab 204",
    storageUnit: "Refrigerator 2",
    shelf: "Shelf A",
    temperature: "4°C",
  },
  experimentsUsedIn: [
    "CRISPR-Cas9 Gene Editing",
    "Plasmid Expression Assay",
    "siRNA Knockdown Study",
  ],
  amount: {
    quantity: 1.2,
    unit: "mL",
  },
},
{
  id: 4,
  category: "Supply",
  name: "96-Well Cell Culture Plates",
  imageUrl: "https://placehold.co/300x200?text=96-Well+Plates",
  description:
    "Sterile tissue-culture-treated plates used for high-throughput assays.",
  price: 132.75,
  location: {
    building: "Life Sciences Building",
    room: "Supply Room 201",
    storageUnit: "Cabinet 4",
    shelf: "Shelf D",
    temperature: "Room temperature",
  },
  experimentsUsedIn: [
    "Cell Viability Assay",
    "Drug Dose-Response Study",
  ],
  amount: {
    quantity: 24,
    unit: "plates",
  },
},
{
  id: 5,
  category: "Supply",
  name: "DAPI Nuclear Stain",
  imageUrl: "https://placehold.co/300x200?text=DAPI",
  description:
    "Fluorescent stain that binds strongly to DNA and labels cell nuclei.",
  price: 89.99,
  location: {
    building: "Imaging Center",
    room: "Microscopy Room 105",
    storageUnit: "Refrigerator 3",
    shelf: "Light-protected drawer",
    temperature: "4°C",
  },
  experimentsUsedIn: [
    "Immunofluorescence – Neuron Imaging",
    "Cell Counting Assay",
  ],
  amount: {
    quantity: 8,
    unit: "mL",
  },
}
];

function formatScheduledDate(date) {
  const parsedDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function formatScheduledTime(time) {
  const match = String(time ?? "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time || "Time not specified";
  const parsedTime = new Date();
  parsedTime.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedTime);
}

function loadInitialInventory(labId) {
  const inventoryKey = getInventoryStorageKey(labId);
  const experimentRecordsStorageKey = `research-aio-experiment-records-lab-${labId}`;
  try {
    const savedItems = window.localStorage.getItem(inventoryKey);
    const items = savedItems
      ? JSON.parse(savedItems)
      : (labId === 1 ? inventoryItems : []);
    const savedExperiments = window.localStorage.getItem(experimentRecordsStorageKey);
    const savedLedger = window.localStorage.getItem(
      `research-aio-supply-consumption-lab-${labId}`,
    );
    return calculateSupplyInventory(
      items,
      savedExperiments ? JSON.parse(savedExperiments) : [],
      savedLedger ? JSON.parse(savedLedger) : {},
    );
  } catch (error) {
    console.error("Could not load inventory stock state:", error);
    return calculateSupplyInventory(
      (labId === 1 ? inventoryItems : []),
      [],
      {},
    );
  }
}

function Inventory({
  lab,
  selectedLabId,
  onSelectedLabChange,
  userEmail,
  onCalendarNavigate,
  inventoryFocus,
  onInventoryFocusHandled,
}) {
  const inventoryStorageKey = getInventoryStorageKey(selectedLabId);
  const experimentRecordsStorageKey = `research-aio-experiment-records-lab-${selectedLabId}`;
  const [initialInventory] = useState(() => loadInitialInventory(selectedLabId));
  const [items, setItems] = useState(initialInventory.items);
  const focusedItem = inventoryFocus?.itemName
    ? items.find(
        (item) => item.name.trim().toLowerCase() === inventoryFocus.itemName.trim().toLowerCase(),
      ) ?? null
    : null;
  const [selectedItem, setSelectedItem] = useState(focusedItem);
  const [warning, setWarning] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Supply");
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(inventoryFocus?.itemName ?? "");
  const [equipmentStatuses, setEquipmentStatuses] = useState({});
  const [equipmentSchedules, setEquipmentSchedules] = useState({});
  const [equipmentUsageError, setEquipmentUsageError] = useState("");
  const [inventoryError, setInventoryError] = useState("");
  const [inventoryWarnings, setInventoryWarnings] = useState(initialInventory.warnings);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    (item.category ?? "Supply") === selectedCategory
    &&
    [
      item.name,
      item.description,
      ...Object.values(item.location),
      ...item.experimentsUsedIn,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearchTerm),
  );

  useEffect(() => {
    if (inventoryFocus) onInventoryFocusHandled?.();
  }, [inventoryFocus, onInventoryFocusHandled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(inventoryStorageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Could not save inventory items:", error);
    }
  }, [items, inventoryStorageKey]);

  useEffect(() => {
    try {
      const savedExperiments = window.localStorage.getItem(experimentRecordsStorageKey);
      const experiments = savedExperiments ? JSON.parse(savedExperiments) : [];
      const reconciliation = reconcileSupplyInventory(
        selectedLabId,
        experiments,
        items,
      );
      if (!reconciliation) return;
    } catch (error) {
      console.error("Could not reconcile experiment supply usage:", error);
    }
  }, [experimentRecordsStorageKey, items, selectedLabId]);

  useEffect(() => {
    const refreshEquipmentStatuses = () => {
      try {
        const equipment = items.filter((item) => item.category === "Equipment");
        const statuses = Object.fromEntries(equipment.map((item) => [
          item.id,
          isEquipmentInUse(selectedLabId, item.name),
        ]));
        const schedules = Object.fromEntries(equipment.map((item) => [
          item.id,
          getEquipmentSchedule(selectedLabId, item.name),
        ]));
        setEquipmentStatuses(statuses);
        setEquipmentSchedules(schedules);
        setEquipmentUsageError("");
      } catch (error) {
        console.error("Could not load equipment schedule usage:", error);
        setEquipmentUsageError("Equipment schedule usage is unavailable.");
      }
    };

    refreshEquipmentStatuses();
    const intervalId = window.setInterval(refreshEquipmentStatuses, 60_000);
    return () => window.clearInterval(intervalId);
  }, [items, selectedLabId]);

  function reconcileItems(candidateItems) {
    try {
      const savedExperiments = window.localStorage.getItem(experimentRecordsStorageKey);
      const experiments = savedExperiments ? JSON.parse(savedExperiments) : [];
      const reconciliation = reconcileSupplyInventory(
        selectedLabId,
        experiments,
        candidateItems,
      );
      setInventoryError("");
      setInventoryWarnings(reconciliation.warnings);
      return reconciliation.items;
    } catch (error) {
      console.error("Could not reconcile inventory stock:", error);
      setInventoryError("Could not update stock from experiment usage.");
      return candidateItems;
    }
  }

  function updateInventoryItem(updatedItem) {
    const candidateItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    const reconciledItems = reconcileItems(candidateItems);
    setItems(reconciledItems);
    setSelectedItem(
      reconciledItems.find((item) => item.id === updatedItem.id) ?? updatedItem,
    );
  }

  function addInventoryItem(newItem) {
    setItems(reconcileItems([newItem, ...items]));
    setSearchTerm("");
    setIsNewItemModalOpen(false);
  }

  return (
    
    <div className="flex min-h-full gap-4 pr-4 pb-4 text-slate-900">
      <aside className=" sticky top-0 max-h-[calc(100vh-2rem)] w-48 shrink-0 self-start overflow-y-auto border-r border-gray-200 pr-3 sm:max-h-[calc(100vh-4rem)]">
        <h2 className="mb-3 text-lg font-semibold">Inventory</h2>
        <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          {["Supply", "Equipment"].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                selectedCategory === category
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {category === "Supply" ? "Supplies" : "Equipment"}
            </button>
          ))}
        </div>
        <nav aria-label="Inventory items">
          <ul className="space-y-1">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <div className="rounded-md hover:bg-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="w-full rounded-md px-3 py-2 text-left text-sm"
                  >
                    <span className="block truncate">{item.name}</span>
                    {item.category === "Equipment" && (
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          equipmentUsageError
                            ? "bg-slate-100 text-slate-600"
                            : equipmentStatuses[item.id]
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {equipmentUsageError
                          ? "Usage unavailable"
                          : equipmentStatuses[item.id]
                            ? "In use"
                            : "Not in use"}
                      </span>
                    )}
                  </button>
                </div>
              </li>
            ))}
            {filteredItems.length === 0 && (
              <li className="px-2 py-1 text-xs text-slate-500">
                No {selectedCategory.toLowerCase()} items found.
              </li>
            )}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
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
        className="rounded-3xl bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={() => setIsNewItemModalOpen(true)}
      >
        Add
      </button>
      </div>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search inventory..."
        aria-label="Search inventory"
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3"
      />
      {inventoryError && warning (
        <p role="alert" className="mb-4 text-sm text-rose-700">
          {inventoryError}
        </p>
      )}
      {warning && inventoryWarnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className = "flex justify-between">
          <p className="font-semibold">Supply stock needs attention</p>
          <button
            className="-mt-1.5 px-3 text-left text-lg font-semibold text-slate-600 hover:text-black"
            type = "button"
            onClick={() => setWarning(false)}
          >
            x
          </button>
          </div>
          <ul className="mt-1 list-inside list-disc space-y-1">
            {inventoryWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1  gap-4">
        {filteredItems.map((item) => (
          <article
          key={item.id} 
          className="bg-white rounded-lg shadow-md p-4 transition-shadow hover:shadow-lg">
            <button
              type="button"
              className="w-full text-left hover:bg-gray-50"
              onClick={() => setSelectedItem(item)}
            >
            <div className="flex">
            <img src={item.imageUrl} alt={item.name} className="mr-6 w-32 h-32 object-cover rounded-md mb-4" />
            <div>
            <h2 className="text-3xl font-bold mb-2 text-start">{item.name}</h2>
            <p className="text-gray-600 mb-2 text-start">
              Type: {item.category ?? "Supply"}
              {item.category === "Equipment" && (
                <span
                  className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    equipmentUsageError
                      ? "bg-slate-100 text-slate-600"
                      : equipmentStatuses[item.id]
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {equipmentUsageError
                    ? "Usage unavailable"
                    : equipmentStatuses[item.id]
                      ? "In use"
                      : "Not in use"}
                </span>
              )}
            </p>
            <p className="text-gray-600 mb-2 text-start">
              Location: {item.location.building}, {item.location.room}, {item.location.storageUnit}, {item.location.shelf} ({item.location.temperature})
            </p>
            <p className="text-gray-600 mb-2 text-start">
              Amount: {item.amount.quantity} {item.amount.unit}
            </p>
            <p className="text-gray-800 font-bold mb-2 text-start">
              Price: ${item.price.toFixed(2) }
            </p>
            </div>
            </div>
            <p className="text-gray-600 mb-2 text-start">Description: {item.description}</p>
            <p className="text-gray-600 mb-2 text-start">
              Experiments Used In: {item.experimentsUsedIn.join(", ")}
            </p>
            </button>
            {item.category === "Equipment" && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    equipmentUsageError
                      ? "bg-slate-100 text-slate-600"
                      : equipmentStatuses[item.id]
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {equipmentUsageError
                      ? "Usage unavailable"
                      : equipmentStatuses[item.id]
                        ? "In use now"
                        : "Not in use"}
                  </span>
                </div>
                {equipmentUsageError ? (
                  <p role="alert" className="mt-2 text-sm text-rose-700">
                    Scheduled times could not be loaded.
                  </p>
                ) : equipmentSchedules[item.id]?.length ? (
                  <ul className="mt-2 max-h-40 divide-y divide-slate-100 overflow-y-auto rounded-lg bg-slate-50 px-3 hover:bg-slate-200">
                    {equipmentSchedules[item.id].map((event) => (
                      <li key={`${event.id}-${event.date}-${event.time}`} className="py-2">
                        <button
                          type="button"
                          onClick={() => onCalendarNavigate?.(event.date, event.time)}
                          className="w-full text-left hover:text-blue-700"
                          title="Open this scheduled use on the calendar"
                        >
                          <span className="block text-sm font-medium text-slate-800">
                            {formatScheduledDate(event.date)}
                          </span>
                          <span className="block text-xs text-slate-600">
                            {formatScheduledTime(event.time)}
                            {event.endTime
                              ? ` – ${formatScheduledTime(event.endTime)}`
                              : ""}
                            {event.title ? ` · ${event.title}` : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No scheduled use found.
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-gray-600">
            {items.filter((item) => (item.category ?? "Supply") === selectedCategory).length === 0
              ? `No ${selectedCategory.toLowerCase()} items have been added for ${lab.name}.`
              : `No ${selectedCategory.toLowerCase()} items match your search.`}
          </p>
        )}
      </div>
      </div>
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={updateInventoryItem}
        />
      )}
      {isNewItemModalOpen && (
        <NewItemModal
          onClose={() => setIsNewItemModalOpen(false)}
          onSave={addInventoryItem}
        />
      )}
    </div>
  )
}
export default Inventory