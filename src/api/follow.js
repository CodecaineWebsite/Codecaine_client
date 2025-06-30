import api from "@/config/api.js";

export function checkFollowStateAPI(userId){
  return api.get(`/api/follows/check/${userId}`);
}

export function followUserAPI(userId) {
  return api.post(`/api/follows/${userId}`);
}

export function unfollowUserAPI(userId) {
  return api.delete(`/api/follows/${userId}`);
}

