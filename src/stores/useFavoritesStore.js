import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addFavoriteAPI,
  removeFavoriteAPI,
  checkFavoriteAPI,
  countFavoritesAPI,
} from "@/api/favorites";

export const useFavoritesStore = defineStore("favorites", () => {
  const favoritesMap = ref(new Map());

  function setFavorite(penId, isLiked, favoritesCount) {
    let stateRef = favoritesMap.value.get(penId);

    if (!stateRef) {
      stateRef = ref({ isLiked, favoritesCount });
      favoritesMap.value.set(penId, stateRef);
    } else {
      stateRef.isLiked = isLiked;
      stateRef.favoritesCount = favoritesCount;
    }

    return stateRef;
  }

  function getFavorite(penId) {
    let stateRef = favoritesMap.value.get(penId);

    if (!stateRef) {
      stateRef = ref({ isLiked: false, favoritesCount: 0 });
      favoritesMap.value.set(penId, stateRef);
      fetchFavoriteState(penId).catch((err) =>
        console.error("Failed to fetch favorite state", err)
      );
    }

    return stateRef;
  }

  async function fetchFavoriteState(penId) {
    try {
      const likedRes = await checkFavoriteAPI(penId);
      const countRes = await countFavoritesAPI(penId);
      const newState = ref({
        isLiked: likedRes.data.liked,
        favoritesCount: countRes.data.favoritesCount ?? 0,
      });
      favoritesMap.value.set(penId, newState);
      return newState;
    } catch (err) {
      console.error("Failed to fetch favorite state for pen:", penId, err);
      return { isLiked: false, favoritesCount: 0 };
    }
  }

  async function toggleFavorite(penId) {
    const current = getFavorite(penId);

    if (current.isLiked) {
      await removeFavoriteAPI(penId);
      current.isLiked = false;
      current.favoritesCount--;
    } else {
      await addFavoriteAPI(penId);
      current.isLiked = true;
      current.favoritesCount++;
    }
  }

  return {
    favoritesMap,
    setFavorite,
    getFavorite,
    fetchFavoriteState,
    toggleFavorite,
  };
});
