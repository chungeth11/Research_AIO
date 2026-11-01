import { useState } from "react";
import Modal from "./Modal";

function CertificationTrainingItemModal({ section, requirement, onClose, onSave }) {
  const isCertification = section === "certification";
  const [formError, setFormError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (isCertification) {
      onSave({
        id: requirement.id,
        name,
        status: String(formData.get("status") ?? "").trim(),
        expires: String(formData.get("expires") ?? "").trim(),
      });
      return;
    }

    const completed = Number(formData.get("completed"));
    const total = Number(formData.get("total"));
    if (
      !Number.isInteger(completed) ||
      !Number.isInteger(total) ||
      completed < 0 ||
      total < 0 ||
      completed > total
    ) {
      setFormError("Completed members must be a whole number no greater than the total.");
      return;
    }

    onSave({ id: requirement.id, name, completed, total });
  }

  return (
    <Modal
      titleId="edit-certification-training-item-title"
      onClose={onClose}
      className="max-w-xl"
      zIndex={60}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 id="edit-certification-training-item-title" className="text-xl font-bold text-slate-900">
          {requirement.id === null ? "Add" : "Edit"}{" "}
          {isCertification ? "certification" : "training"}
        </h3>
        {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            name="name"
            required
            defaultValue={requirement.name}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900"
          />
        </label>
        {isCertification ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Status
              <input
                name="status"
                required
                defaultValue={requirement.status}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Renewal date
              <input
                name="expires"
                required
                defaultValue={requirement.expires}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900"
              />
            </label>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Completed
                <input
                  name="completed"
                  type="number"
                  min="0"
                  required
                  defaultValue={requirement.completed}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Total members
                <input
                  name="total"
                  type="number"
                  min="0"
                  required
                  defaultValue={requirement.total}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900"
                />
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Completed members must be a whole number no greater than the total.
            </p>
          </>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CertificationTrainingItemModal;
