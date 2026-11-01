import { useState } from "react";
import Modal from "./Modal";

const roles = ["Admin", "Member", "Viewer"];

function LabMembersModal({ labName, ownerEmail, members, onChange, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function addMember(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (normalizedEmail === ownerEmail?.trim().toLowerCase()) {
      setError("The lab owner already has Owner access.");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === normalizedEmail)) {
      setError("That email already has a role in this lab.");
      return;
    }

    const result = onChange([...members, { email: normalizedEmail, role: "Member" }]);
    if (result) {
      setError(result);
      return;
    }
    setEmail("");
    setError("");
  }

  function updateMemberRole(memberEmail, role) {
    const result = onChange(members.map((member) =>
      member.email === memberEmail ? { ...member, role } : member,
    ));
    if (result) setError(result);
  }

  function removeMember(memberEmail) {
    const result = onChange(members.filter((member) => member.email !== memberEmail));
    if (result) setError(result);
  }

  return (
    <Modal titleId="lab-members-title" onClose={onClose} className="max-w-2xl">
      <div>
        <h2 id="lab-members-title" className="text-xl font-bold text-slate-900">
          Lab members and permissions
        </h2>
        <p className="mt-1 text-sm text-slate-500">{labName}</p>
        <p className="mt-2 text-xs leading-5 text-amber-800">
          Access is saved in this browser. Members must sign in with the email listed here.
        </p>
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-slate-800">{ownerEmail}</p>
            <p className="text-xs text-slate-500">Lab owner</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Owner</span>
        </li>
        {members.map((member) => (
          <li key={member.email} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0 break-all text-sm font-medium text-slate-800">{member.email}</span>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`role-${member.email}`}>Permission for {member.email}</label>
              <select
                id={`role-${member.email}`}
                value={member.role}
                onChange={(event) => updateMemberRole(member.email, event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              >
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removeMember(member.email)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {members.length === 0 && (
          <li className="p-5 text-center text-sm text-slate-500">No members have been added yet.</li>
        )}
      </ul>
      <form onSubmit={addMember} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="new-lab-member-email">Member email</label>
        <input
          id="new-lab-member-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="person@example.com"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Add member
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">New members start with Member access. Owners can assign Admin, Member, or Viewer.</p>
      <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
          Done
        </button>
      </div>
    </Modal>
  );
}

export default LabMembersModal;
