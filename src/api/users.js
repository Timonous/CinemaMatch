import { apiFetch } from "./client";

// GET /users/me  → { user_id, email, name, surname }
export async function getMe() {
  return apiFetch("/users/me");
}

// PUT /users/me  → обновлённый профиль
export async function updateMe({ name, surname, password }) {
  return apiFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify({ name, surname, password }),
  });
}
