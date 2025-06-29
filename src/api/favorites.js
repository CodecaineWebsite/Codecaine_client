import api from "@/config/api.js";

export function addFavoriteAPI(pen_id) {
  return api.post("/api/favorites", { pen_id });
}

export function removeFavoriteAPI(pen_id) {
  return api.delete("/api/favorites", { data: { pen_id } });
}

export function checkFavoriteAPI(pen_id) {
  return api.get(`/api/favorites/check/${pen_id}`);
}

export function countFavoritesAPI(pen_id) {
  return api.get(`/api/favorites/count/${pen_id}`);
}
