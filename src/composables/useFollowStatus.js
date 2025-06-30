// composables/useFollowStatus.js
import { ref } from "vue";

const followMap = new Map();

export function useFollowStatus(userId) {
  if (!followMap.has(userId)) {
    followMap.set(userId, ref(false));
  }

  const isFollowing = followMap.get(userId);

  const setFollowing = (val) => {
    isFollowing.value = val;
  };

  return {
    isFollowing,
    setFollowing,
  };
}
