import { ref } from "vue";
import api from "@/config/api";

const followMap = new Map();

export function useFollowStatus(userId) {
  if (!followMap.has(userId)) {
    followMap.set(userId, ref(false));
  }

  const isFollowing = followMap.get(userId);

  const setFollowing = (val) => {
    isFollowing.value = val;
  };

  const checkFollow = async () => {
    try {
      const res = await api.get(`/api/follows/check/${userId}`);
      setFollowing(res.data.isFollowing);
    } catch (error) {
      console.error(`Failed to check follow status for user ${userId}:`, error);
    }
  };

  return {
    isFollowing,
    setFollowing,
    checkFollow,
  };
}
