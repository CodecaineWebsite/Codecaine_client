import api from "@/config/api";

export const syncUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};
