import Modal from "./Modal";

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900";

function LabDetailsModal({ labContent, onClose, onSubmit }) {
  const fields = [
    ["name", "Lab name", labContent.name, "text", true],
    ["type", "Research area", labContent.type, "text", true],
    ["organization", "Organization", labContent.organization.name, "text", true],
    ["organizationImageUrl", "Organization logo URL", labContent.organization.organizationImageUrl, "url"],
    ["email", "Contact email", labContent.email, "email"],
    ["phone", "Phone", labContent.phone, "tel"],
    ["biosafetyLevel", "Biosafety level", labContent.biosafetyLevel],
    ["principalInvestigatorName", "Principal investigator", labContent.principalInvestigator.name],
    ["principalInvestigatorTitle", "Investigator title", labContent.principalInvestigator.title],
  ];
  const locationFields = [
    ["institution", "Institution"],
    ["campus", "Campus"],
    ["building", "Building"],
    ["room", "Room"],
    ["address", "Street address"],
    ["city", "City"],
    ["state", "State / region"],
  ];
  const statistics = [
    ["members", "Members"],
    ["activeProjects", "Active projects"],
    ["publications", "Publications"],
  ];

  function getValue(name) {
    if (name === "organization") return labContent.organization.name;
    if (name === "organizationImageUrl") return labContent.organization.organizationImageUrl;
    if (name === "principalInvestigatorName") return labContent.principalInvestigator.name;
    if (name === "principalInvestigatorTitle") return labContent.principalInvestigator.title;
    return labContent[name] ?? "";
  }

  return (
    <Modal titleId="edit-lab-details-title" onClose={onClose} className="max-w-3xl">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <h2 id="edit-lab-details-title" className="text-xl font-bold text-slate-900">
            Edit lab details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the information shown on this lab home page.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.slice(0, 4).map(([name, label, , type = "text", required = false]) => (
            <label key={name} className="block text-sm font-medium text-slate-700">
              {label}
              <input
                name={name}
                type={type}
                required={required}
                maxLength={name === "name" || name === "type" || name === "organization" ? 120 : undefined}
                defaultValue={getValue(name)}
                className={inputClassName}
              />
            </label>
          ))}
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            name="description"
            rows="3"
            required
            defaultValue={labContent.description}
            className={inputClassName}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          {fields.slice(4, 7).map(([name, label, , type = "text"]) => (
            <label key={name} className="block text-sm font-medium text-slate-700">
              {label}
              <input name={name} type={type} defaultValue={getValue(name)} className={inputClassName} />
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.slice(7).map(([name, label]) => (
            <label key={name} className="block text-sm font-medium text-slate-700">
              {label}
              <input name={name} defaultValue={getValue(name)} className={inputClassName} />
            </label>
          ))}
        </div>
        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-800">Location</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {locationFields.map(([name, label]) => (
              <label key={name} className="block text-sm font-medium text-slate-700">
                {label}
                <input
                  name={name}
                  defaultValue={labContent.location[name] ?? ""}
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-800">Lab statistics</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            {statistics.map(([name, label]) => (
              <label key={name} className="block text-sm font-medium text-slate-700">
                {label}
                <input
                  name={name}
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={labContent.statistics[name]}
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save details
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default LabDetailsModal;
