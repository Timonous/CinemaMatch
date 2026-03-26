import { apiFetch } from "./client";

// GET /movies?page=&limit=&genre=  → { items, total, page }
export async function getMovies({ page = 1, limit = 60, genre } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (genre) params.set("genre", genre);
  return apiFetch(`/movies?${params}`);
}

// GET /movies/{id}  → MovieDetail { id, title, year, description, genres[] }
export async function getMovie(id) {
  return apiFetch(`/movies/${id}`);
}
