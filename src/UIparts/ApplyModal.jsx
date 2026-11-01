import { useState } from "react";
import Modal from "./Modal";

function ApplyModal({ labName, position, onClose, onSubmit }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = onSubmit({
      applicantName: String(formData.get("applicantName") ?? "").trim(),
      applicantEmail: String(formData.get("applicantEmail") ?? "").trim(),
      applicantPhone: String(formData.get("applicantPhone") ?? "").trim(),
      message: String(formData.get("coverLetter") ?? "").trim(),
      resumeFileName: formData.get("resume")?.name ?? "",
      positionTitle: position.title,
    });

    if (result) {
      setSubmitError(result);
      return;
    }

    setSubmitError("");
    setIsSubmitted(true);
  }

  return (
    <Modal titleId="application-title" onClose={onClose} className="max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">{labName}</p>
            <h2
              id="application-title"
              className="mt-1 text-2xl font-bold text-slate-900"
            >
              {isSubmitted ? "Application prepared" : "Apply for this role"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{position.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application"
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
        {isSubmitted ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Your application was saved for the lab owner in this browser.
            Resume files are not uploaded or retained.
            <button
              type="button"
              onClick={onClose}
              className="mt-4 block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {submitError && (
              <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {submitError}
              </p>
            )}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                name="applicantName"
                autoComplete="name"
                required
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  name="applicantEmail"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input
                  name="applicantPhone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Resume</span>
              <input
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
              />
              <span className="mt-1 block text-xs text-slate-500">
                PDF, DOC, or DOCX
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Cover letter or message
              </span>
              <textarea
                name="coverLetter"
                rows={4}
                required
                placeholder="Tell the lab why you are interested in this role..."
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
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
                Submit application
              </button>
            </div>
          </form>
        )}
    </Modal>
  );
}

export default ApplyModal;
