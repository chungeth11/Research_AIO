import { useState } from "react";
import CertificationTrainingItemModal from "./CertificationTrainingItemModal";
import Modal from "./Modal";

function CertificationsTrainingModal({
  certifications,
  trainings,
  uploads,
  onUpload,
  canManage = false,
  onUpdate,
  onClose,
}) {
  const [uploadErrors, setUploadErrors] = useState({});
  const [editingRequirement, setEditingRequirement] = useState(null);

  function handleFileSelection(section, id, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const key = `${section}-${id}`;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setUploadErrors((current) => ({
          ...current,
          [key]: `Unable to read ${file.name}. Please choose another file.`,
        }));
        return;
      }

      onUpload(key, { name: file.name, url: reader.result });
      setUploadErrors((current) => ({ ...current, [key]: "" }));
    };
    reader.onerror = () => {
      setUploadErrors((current) => ({
        ...current,
        [key]: `Unable to read ${file.name}. Please choose another file.`,
      }));
    };
    reader.readAsDataURL(file);
  }

  function renderRequirement(requirement, section, detail, status) {
    const key = `${section}-${requirement.id}`;
    const uploadedFile = uploads[key];

    return (
      <li
        key={key}
        className="rounded-xl border border-slate-200 p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-800">{requirement.name}</h4>
            <p className="mt-1 text-sm text-slate-500">{detail}</p>
            <p className="mt-2 text-xs font-medium text-slate-600">{status}</p>
            {uploadedFile && (
              <a
                href={uploadedFile.url}
                download={uploadedFile.name}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-blue-600 underline hover:text-blue-700"
              >
                Uploaded: {uploadedFile.name}
              </a>
            )}
            {uploadErrors[key] && (
              <p role="alert" className="mt-2 text-sm text-rose-700">
                {uploadErrors[key]}
              </p>
            )}
          </div>
          <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500">
            {uploadedFile ? "Replace file" : "Upload proof"}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => handleFileSelection(section, requirement.id, event)}
              className="sr-only"
              aria-label={`Upload proof for ${requirement.name}`}
            />
          </label>
        </div>
        {canManage && (
          <div className="mt-3 flex justify-end gap-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setEditingRequirement({ section, requirement })}
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onUpdate(
                section === "certification" ? "certifications" : "trainings",
                (section === "certification" ? certifications : trainings)
                  .filter((item) => item.id !== requirement.id),
              )}
              className="text-sm font-semibold text-rose-700 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </li>
    );
  }

  function handleSaveRequirement(item) {
    if (!canManage) return;
    const collection = editingRequirement.section === "certification" ? "certifications" : "trainings";
    const originalItems = collection === "certifications" ? certifications : trainings;
    const updatedItem = item.id === null ? { ...item, id: crypto.randomUUID() } : item;
    onUpdate(
      collection,
      editingRequirement.requirement.id === null
        ? [...originalItems, updatedItem]
        : originalItems.map((existing) => existing.id === updatedItem.id ? updatedItem : existing),
    );
    setEditingRequirement(null);
  }

  function addRequirement(section) {
    setEditingRequirement({
      section,
      requirement: section === "certification"
        ? { id: null, name: "", status: "Active", expires: "" }
        : { id: null, name: "", completed: 0, total: 0 },
    });
  }

  return (
    <Modal
      titleId="certifications-training-title"
      onClose={() => {
        if (editingRequirement) {
          setEditingRequirement(null);
        } else {
          onClose();
        }
      }}
      className="max-w-3xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Lab compliance
          </p>
          <h2
            id="certifications-training-title"
            className="mt-1 text-2xl font-bold text-slate-900"
          >
            Certifications &amp; training
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review the lab requirements and upload certificates or training
            records as PDF, JPG, or PNG files.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certifications and training"
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

      <section aria-labelledby="required-certifications" className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 id="required-certifications" className="text-lg font-bold text-slate-900">
            Required certifications
          </h3>
          {canManage && <button type="button" onClick={() => addRequirement("certification")} className="text-sm font-semibold text-blue-700 hover:underline">Add</button>}
        </div>
        <ul className="mt-3 space-y-3">
          {certifications.map((certification) =>
            renderRequirement(
              certification,
              "certification",
              `Renewal date: ${certification.expires}`,
              certification.status,
            ),
          )}
        </ul>
      </section>

      <section aria-labelledby="required-trainings" className="mt-7">
        <div className="flex items-center justify-between gap-3">
          <h3 id="required-trainings" className="text-lg font-bold text-slate-900">
            Required training
          </h3>
          {canManage && <button type="button" onClick={() => addRequirement("training")} className="text-sm font-semibold text-blue-700 hover:underline">Add</button>}
        </div>
        <ul className="mt-3 space-y-3">
          {trainings.map((training) =>
            renderRequirement(
              training,
              "training",
              `${training.completed} of ${training.total} lab members completed`,
              training.completed < training.total
                ? `${training.total - training.completed} completion${training.total - training.completed === 1 ? "" : "s"} needed`
                : "All lab members complete",
            ),
          )}
        </ul>
      </section>
      {editingRequirement && canManage && (
        <CertificationTrainingItemModal
          section={editingRequirement.section}
          requirement={editingRequirement.requirement}
          onClose={() => setEditingRequirement(null)}
          onSave={handleSaveRequirement}
        />
      )}
    </Modal>
  );
}

export default CertificationsTrainingModal;
