// ─── Базовый API-клиент ──────────────────────────────────────────────────────
// Замените BASE_URL на адрес вашего FastAPI сервера
export const BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.detail ||
      (typeof data === "string" ? data : `Ошибка ${res.status}`);
    throw new Error(message);
  }

  return data;
}
