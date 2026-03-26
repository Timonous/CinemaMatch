import { apiFetch } from "./client";

// POST /groups  { name }  → { group_id, name }
export async function createGroup(name) {
  return apiFetch("/groups", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// GET /groups  → [ { group_id, name } ]
export async function getGroups() {
  return apiFetch("/groups");
}

// GET /groups/{group_id}  → { group_id, name, members: [{user_id, name}] }
export async function getGroup(group_id) {
  return apiFetch(`/groups/${group_id}`);
}

// POST /groups/{group_id}/invite  { user_id?, email? }
export async function inviteToGroup(group_id, { user_id, email }) {
  return apiFetch(`/groups/${group_id}/invite`, {
    method: "POST",
    body: JSON.stringify({ user_id, email }),
  });
}

// DELETE /groups/{group_id}/members/{user_id}
export async function leaveGroup(group_id, user_id) {
  return apiFetch(`/groups/${group_id}/members/${user_id}`, {
    method: "DELETE",
  });
}

// POST /recommendations/group  { group_id }
// → { items: [{title, year, genres, reason, score}], group_profile }
export async function getGroupRecommendations(group_id) {
  return apiFetch("/recommendations/group", {
    method: "POST",
    body: JSON.stringify({ group_id }),
  });
}
