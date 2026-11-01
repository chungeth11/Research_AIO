import Modal from "./Modal";

function LabApplicationsModal({ labName, applications, onClose }) {
  return (
    <Modal titleId="lab-applications-title" onClose={onClose} className="max-w-3xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Hiring</p>
        <h2 id="lab-applications-title" className="mt-1 text-2xl font-bold text-slate-900">
          Incoming applications
        </h2>
        <p className="mt-1 text-sm text-slate-500">{labName} · {applications.length} received</p>
        <p className="mt-2 text-xs text-amber-800">
          Applications are saved only in this browser. Uploaded resume files are not retained.
        </p>
      </div>
      {applications.length ? (
        <ul className="mt-5 space-y-3">
          {[...applications].reverse().map((application) => (
            <li key={application.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{application.applicantName}</h3>
                  <a className="text-sm text-blue-700 hover:underline" href={`mailto:${application.applicantEmail}`}>
                    {application.applicantEmail}
                  </a>
                  {application.applicantPhone && <p className="mt-1 text-sm text-slate-600">{application.applicantPhone}</p>}
                </div>
                <time className="text-xs text-slate-500">{application.submittedAt}</time>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Applied for: {application.positionTitle}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{application.message}</p>
              <p className="mt-3 text-xs text-slate-500">
                Resume selected: {application.resumeFileName || "No file name provided"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No applications have been received yet.
        </p>
      )}
      <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
          Done
        </button>
      </div>
    </Modal>
  );
}

export default LabApplicationsModal;
