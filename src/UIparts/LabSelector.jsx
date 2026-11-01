import { labs } from "../Pages/Labs";

function LabSelector({ selectedLabId, onSelectedLabChange }) {
  return (
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
  );
}

export default LabSelector;
