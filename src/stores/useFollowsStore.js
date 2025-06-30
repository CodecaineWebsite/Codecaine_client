import { defineStore } from "pinia";
import { ref } from "vue";
import {
  followUserAPI,
  unfollowUserAPI,
  checkFollowStateAPI,
} from "@/api/follows.js";

export const useFollowsStore = defineStore("follows", () => {
  const followsMap = ref(new Map());

  function setFollow(userId, isFollowed, followersCount) {
    let stateRef = followsMap.value.get(userId);

    if (!stateRef) {
      stateRef = ref({ isFollowed, followersCount });
      followsMap.value.get(userId);
    } else {
      stateRef = ref({ isFollowed, followersCount });
      stateRef.value.followersCount = followersCount;
    }

    return stateRef;
  };

  function getFollow(userId) {
    let stateRef = followsMap.value.get(userId);

    if (!stateRef) {
      stateRef = ref({ isFollowed: false, followersCount: 0 });
      followsMap.value.set(userId, stateRef);

      try {
        fetchFollowState(userId);
      } catch(err) {
        console.error('Failed to fetch follow state', err)
      }
    }

    return stateRef;
  };

  async function fetchFollowState(userId) {
    try {
        const { is_followed, followers_count } = await checkFollowStateAPI(userId);
        setFollow(userId, is_followed, followers_count);
    } catch (err) {
        console.error('Error fetching follow state', err);
    }
  }
  async function toggleFollow(userId) {
    const stateRef = getFollow();
    if (stateRef.value.isFollowed) {
        await unfollowUserAPI(userId);
        setFollow(userId, false, stateRef.value.followersCount - 1);
    } else {
        await followUserAPI(userId);
        setFollow(userId, true, stateRef.value.followersCount + 1);
    }
  }

  return {
    followsMap,
    setFollow,
    getFollow,
    fetchFollowState,
    toggleFollow,
  }
});
