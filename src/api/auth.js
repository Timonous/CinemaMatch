import { apiFetch } from "./client";

// POST /auth/register
export async function register({ surname, name, email, password }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ surname, name, email, password }),
  });
}

// POST /auth/login  → { access_token, token_type, user_id }
export async function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
