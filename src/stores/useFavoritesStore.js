import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { addFavoriteAPI, removeFavoriteAPI, checkFavoriteAPI, countFavoritesAPI } from "@/api/favorites";

const authStore = useAuthStore();
export const useFavoritesStore = defineStore("favorites", () => {
  const favoritesMap = ref(new Map());

  function setFavorite(penId, isLiked, favoritesCount) {
    favoritesMap.value.set(penId, { isLiked, favoritesCount });
    return favoritesMap.value.get(penId);
  }

  function getFavorite(penId) {
    return favoritesMap.value.get(penId) || { isLiked: false, favoritesCount: 0 };
  }

  async function fetchFavoriteState(penId) {
  try {
    let likedRes;
    if(authStore.user){
    likedRes = await checkFavoriteAPI(penId);
    }
    const countRes = await countFavoritesAPI(penId);    const newState = {
      isLiked: likedRes?.data?.liked || false,
      favoritesCount: countRes.data.favoritesCount ?? 0,
    };
    favoritesMap.value.set(penId, newState);
    return newState;
  } catch (err) {
    console.error("Failed to fetch favorite state for pen:", penId, err);
    return { isLiked: false, favoritesCount: 0 };
  }
}

  async function toggleFavorite(penId) {
    const current = getFavorite(penId);
    const newState = { ...current };

    if (current.isLiked) {
      await removeFavoriteAPI(penId);
      newState.isLiked = false;
      newState.favoritesCount--;
    } else {
      await addFavoriteAPI(penId);
      newState.isLiked = true;
      newState.favoritesCount++;
    }

    favoritesMap.value.set(penId, newState);
  }

  return {
    setFavorite,
    getFavorite,
    fetchFavoriteState,
    toggleFavorite,
  };
});
