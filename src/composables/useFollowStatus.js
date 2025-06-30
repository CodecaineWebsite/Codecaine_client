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

  const handleFollowAction = async (userId) => {
    try {
      if (!isFollowing.value) {
        const res = await api.post(`/api/follows/${userId}`);
        setFollowing(res.data.result);
      } else {
        const res = await api.delete(`/api/follows/${userId}`);
        setFollowing(res.data.result);
      }
    } catch (error) {
      console.error(`Failed to follow/unfollow user ${userId}:`, error);
    }
  };

  return {
    isFollowing,
    setFollowing,
    checkFollow,
    handleFollowAction,
  };
}
