import { useRef, useState } from "react";
const profileExample = {
  id: 1,
  name: "Dr. Maya Patel",
  email: "maya.patel@helix.edu",
  phoneNumber: "(310) 555-0148",
  profileImageUrl: "https://i.pravatar.cc/300?img=5",
  resume: {
    name: "Maya-Patel-Resume.pdf",
    url: "/resumes/maya-patel-resume.pdf",
    uploadedAt: "2026-09-15",
  },
  subscription: {
    plan: "Professional",
    status: "Active",
    billingCycle: "Monthly",
    price: 24.99,
    currency: "USD",
    renewalDate: "2026-11-22",
  },
  labsIn: [
    {
      id: 1,
      name: "Martinez Neural Plasticity Lab",
      organization: "Helix Research Institute",
      role: "Research Scientist",
    },
    {
      id: 2,
      name: "Cellular Imaging Core",
      organization: "Helix Research Institute",
      role: "Lab Member",
    },
    {
      id: 3,
      name: "Molecular Therapeutics Lab",
      organization: "Pacific Biomedical Center",
      role: "Collaborator",
    },
  ],
};


function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function Profile() {
  const [profile, setProfile] = useState(() => profileExample);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const resumeInputRef = useRef(null);
  const [draft, setDraft] = useState({
    name: profile.name,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
  });

  function handleEdit() {
    setDraft({
      name: profile.name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
    });
    setIsEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();
    setProfile((currentProfile) => ({ ...currentProfile, ...draft }));
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setResumeError(`Unable to read ${file.name}. Please try another file.`);
        return;
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        resume: {
          name: file.name,
          url: reader.result,
          uploadedAt: new Date().toISOString().slice(0, 10),
        },
      }));
      setResumeError("");
    };
    reader.onerror = () => {
      setResumeError(`Unable to read ${file.name}. Please try another file.`);
    };
    reader.readAsDataURL(file);
  }

  function handleResumeDelete() {
    setProfile((currentProfile) => ({ ...currentProfile, resume: null }));
    setResumeError("");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8 text-slate-900">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">Account</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">My profile</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal details, membership, and lab affiliations.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
            </svg>
            Edit profile
          </button>
        )}
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-blue-100 via-indigo-100 to-sky-100" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 items-end gap-4">
              <img
                src={profile.profileImageUrl}
                alt={`${profile.name} profile`}
                className="h-24 w-24 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
              />
              <div className="min-w-0 pb-1">
                <h2 className="truncate text-2xl font-bold text-slate-900">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Research professional
                </p>
              </div>
            </div>
            <span className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account active
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-5">
        <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your contact details for lab communications.
              </p>
            </div>
            {!isEditing && (
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                Profile details
              </span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input
                  type="tel"
                  value={draft.phoneNumber}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      phoneNumber: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Full name
                  </dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {profile.name}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email address
                  </dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:text-blue-600"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 3h3l2 5-2 1.5a14 14 0 0 0 4.5 4.5L16 12l5 2v3a2 2 0 0 1-2 2C10.7 19 5 13.3 5 6a3 3 0 0 1 2-3Z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {profile.phoneNumber}
                  </dd>
                </div>
              </div>
            </dl>
          )}
        </section>

        <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Membership</h2>
              <p className="mt-1 text-sm text-slate-500">Your current plan</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {profile.subscription.status}
            </span>
          </div>
          <div className="mt-5 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 p-5 text-white">
            <p className="text-sm text-blue-100">ResearchAIO</p>
            <p className="mt-3 text-2xl font-bold">
              {profile.subscription.plan}
            </p>
            <p className="mt-1 text-sm text-blue-100">
              ${profile.subscription.price.toFixed(2)}{" "}
              <span className="text-blue-200">/ {profile.subscription.billingCycle.toLowerCase()}</span>
            </p>
          </div>
          <div className="mt-5 flex items-start justify-between gap-4 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">Next renewal</p>
            <p className="text-right text-sm font-semibold text-slate-800">
              {formatDate(profile.subscription.renewalDate)}
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Resume</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest uploaded document
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6M8 13h8M8 17h8" />
              </svg>
            </span>
          </div>
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
          />
          {profile.resume ? (
            <>
              <a
                href={profile.resume.url}
                download={profile.resume.name}
                className="mt-5 block break-all text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                {profile.resume.name}
              </a>
              <p className="mt-1 text-xs text-slate-500">
                Uploaded {formatDate(profile.resume.uploadedAt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Replace resume
                </button>
                <button
                  type="button"
                  onClick={handleResumeDelete}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-5 text-sm text-slate-600">
                No resume uploaded.
              </p>
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="mt-4 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Upload resume
              </button>
            </>
          )}
          {resumeError && (
            <p role="alert" className="mt-3 text-sm text-rose-700">
              {resumeError}
            </p>
          )}
        </section>

        <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Lab affiliations</h2>
              <p className="mt-1 text-sm text-slate-500">
                Labs and research groups connected to your account.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {profile.labsIn.length} affiliations
            </span>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {profile.labsIn.map((lab) => (
              <li key={lab.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    lab.id === 1
                      ? "bg-blue-100 text-blue-700"
                      : lab.id === 2
                        ? "bg-violet-100 text-violet-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {lab.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 3)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {lab.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {lab.organization}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {lab.role}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Profile;
