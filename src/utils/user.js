import api from "@/config/api";

export const syncUser = async () => {
  const res = await api.get("/api/auth/me");
  console.log("syncUser response:", res.data);
  return res.data;
};
