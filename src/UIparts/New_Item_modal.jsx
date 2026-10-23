import { useRef, useState } from "react";
import Modal from "./Modal";

const emptyItem = {
  name: "",
  description: "",
  price: "",
  building: "",
  room: "",
  storageUnit: "",
  shelf: "",
  temperature: "",
  quantity: "",
  unit: "",
  experimentsUsedIn: "",
};

function NewItemModal({ onClose, onSave }) {
  const imageInputRef = useRef(null);
  const [draft, setDraft] = useState(emptyItem);
  const [imageUrl, setImageUrl] = useState(
    "https://placehold.co/300x200?text=New+Item",
  );
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  }

  function handleImageSelection(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setImageError("");
      } else {
        setImageError(`Unable to read ${file.name}. Please choose another image.`);
      }
    };
    reader.onerror = () => {
      setImageError(`Unable to read ${file.name}. Please choose another image.`);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const price = Number(draft.price);
    const quantity = Number(draft.quantity);

    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity < 0) {
      setFormError("Enter a valid non-negative price and quantity.");
      return;
    }

    onSave({
      id: Date.now(),
      name: draft.name.trim(),
      imageUrl,
      description: draft.description.trim(),
      price,
      location: {
        building: draft.building.trim(),
        room: draft.room.trim(),
        storageUnit: draft.storageUnit.trim(),
        shelf: draft.shelf.trim(),
        temperature: draft.temperature.trim(),
      },
      experimentsUsedIn: draft.experimentsUsedIn
        .split(",")
        .map((experiment) => experiment.trim())
        .filter(Boolean),
      amount: {
        quantity,
        unit: draft.unit.trim(),
      },
    });
  }

  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <Modal
      titleId="new-inventory-item-title"
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Inventory
          </p>
          <h2
            id="new-inventory-item-title"
            className="mt-1 text-2xl font-bold text-slate-900"
          >
            Add inventory item
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close new item form"
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelection}
              className="hidden"
              aria-label="Choose item image"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              aria-label="Choose item image"
              className="group relative block w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <img
                src={imageUrl}
                alt={draft.name ? `${draft.name} preview` : "New item image preview"}
                className="h-48 w-full rounded-xl border border-slate-200 bg-slate-50 object-cover transition group-hover:brightness-75"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 text-sm font-semibold text-white opacity-0 transition group-hover:bg-slate-950/25 group-hover:opacity-100">
                Click image to upload
              </span>
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Image is optional. Click the preview to upload or change it.
            </p>
            {imageError && (
              <p role="alert" className="mt-2 text-sm text-rose-700">
                {imageError}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                name="name"
                value={draft.name}
                onChange={updateField}
                required
                className={inputClassName}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={draft.description}
                onChange={updateField}
                rows={3}
                required
                className={inputClassName}
              />
            </label>
          </div>
        </div>
         <div className="grid grid-cols-5 gap-4">
              <label className="block col-span-2">
                <span className="text-sm font-medium text-slate-700">Price</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.price}
                  onChange={updateField}
                  required
                  className={inputClassName}
                />
              </label>
              <label className="block col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Quantity
                </span>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="any"
                  value={draft.quantity}
                  onChange={updateField}
                  required
                  className={inputClassName}
                />
              </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Unit</span>
              <input
                name="unit"
                value={draft.unit}
                onChange={updateField}
                placeholder="e.g. mL, bottles, plates"
                required
                className={inputClassName}
              />
            </label>
            </div>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-800">
            Storage location
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {[
              ["building", "Building"],
              ["room", "Room"],
              ["storageUnit", "Storage unit"],
              ["shelf", "Shelf"],
              ["temperature", "Temperature"],
            ].map(([name, label]) => (
              <label key={name} className="block">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input
                  name={name}
                  value={draft[name]}
                  onChange={updateField}
                  required
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Experiments used in
          </span>
          <textarea
            name="experimentsUsedIn"
            value={draft.experimentsUsedIn}
            onChange={updateField}
            rows={3}
            placeholder="Separate experiment names with commas"
            className={inputClassName}
          />
        </label>

        {formError && (
          <p role="alert" className="text-sm text-rose-700">
            {formError}
          </p>
        )}
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
            Add item
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default NewItemModal;
