import { useState } from "react";
import ItemModal from "../UIparts/item_modal";
import NewItemModal from "../UIparts/New_Item_modal";
const inventoryItems = [
  {
    id: 1,
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
  },
];

function Inventory({ lab }) {
  const [items, setItems] = useState(lab.id === 1 ? inventoryItems : []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
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

  function updateInventoryItem(updatedItem) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
    setSelectedItem(updatedItem);
  }

  function addInventoryItem(newItem) {
    setItems((currentItems) => [newItem, ...currentItems]);
    setSearchTerm("");
    setIsNewItemModalOpen(false);
  }

  return (
    
    <div className="flex min-h-full gap-4 pr-4 pb-4 text-slate-900">
      <aside className="sticky top-0 max-h-[calc(100vh-2rem)] w-48 shrink-0 self-start overflow-y-auto border-r border-gray-200 pr-3 sm:max-h-[calc(100vh-4rem)]">
        <h2 className="mb-3 text-lg font-semibold">Inventory</h2>
        <nav aria-label="Inventory items">
          <ul className="space-y-1">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-200"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="mt-1 text-sm text-slate-500">{lab.name}</p>
      </div>
      <button
        type="button"
        className="rounded-3xl bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={() => setIsNewItemModalOpen(true)}
      >
        Add
      </button>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search inventory..."
        aria-label="Search inventory"
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3"
      />
      <div className="grid grid-cols-1  gap-4">
        {filteredItems.map((item) => (
          <button 
          key={item.id} 
          className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-200 hover:shadow-lg transition-shadow w-full text-left"
          onClick={() => setSelectedItem(item)}>
            <div className="flex">
            <img src={item.imageUrl} alt={item.name} className="mr-6 w-32 h-32 object-cover rounded-md mb-4" />
            <div>
            <h2 className="text-3xl font-bold mb-2 text-start">{item.name}</h2>
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
        ))}
        {filteredItems.length === 0 && (
          <p className="text-gray-600">
            {items.length === 0
              ? `No inventory items have been added for ${lab.name}.`
              : "No inventory items match your search."}
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