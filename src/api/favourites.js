import { apiFetch } from "./client";

// GET /movies/favourites?page=&limit=  → { items, total, page }
export async function getFavourites({ page = 1, limit = 100 } = {}) {
  return apiFetch(`/movies/favourites?page=${page}&limit=${limit}`);
}

// POST /movies/favourites/add  { movie_id }
export async function addFavourite(movie_id) {
  return apiFetch("/movies/favourites/add", {
    method: "POST",
    body: JSON.stringify({ movie_id }),
  });
}

// DELETE /movies/favourites/delete  { movie_id }
export async function removeFavourite(movie_id) {
  return apiFetch("/movies/favourites/delete", {
    method: "DELETE",
    body: JSON.stringify({ movie_id }),
  });
}
