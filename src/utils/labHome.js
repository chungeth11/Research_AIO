export function getLabHomeStorageKey(labId) {
  return `research-aio-lab-home-${labId}`;
}

export function getLabMembersStorageKey(labId) {
  return `research-aio-lab-members-${labId}`;
}

export function getLabApplicationsStorageKey(labId) {
  return `research-aio-lab-applications-${labId}`;
}

export function isLabOwner(lab, userEmail) {
  return Boolean(
    lab?.ownerEmail &&
    userEmail &&
    lab.ownerEmail.trim().toLowerCase() === userEmail.trim().toLowerCase(),
  );
}

export function getLabMembers(labId) {
  try {
    const storedMembers = window.localStorage.getItem(getLabMembersStorageKey(labId));
    if (!storedMembers) return [];

    const members = JSON.parse(storedMembers);
    if (
      !Array.isArray(members) ||
      members.some((member) =>
        !member ||
        typeof member.email !== "string" ||
        !["Admin", "Member", "Viewer"].includes(member.role)
      )
    ) {
      return [];
    }

    return members;
  } catch {
    return [];
  }
}

export function getLabRole(lab, userEmail, members = []) {
  if (isLabOwner(lab, userEmail)) return "Owner";
  const member = members.find(
    (entry) => entry.email?.trim().toLowerCase() === userEmail?.trim().toLowerCase(),
  );
  return member?.role ?? null;
}

export function canManageLabContent(lab, userEmail, members = []) {
  return ["Owner", "Admin"].includes(getLabRole(lab, userEmail, members));
}
