import { useEffect } from "react";
import { useAuthStore } from "../API/store/AuthStore/authStore";
import axiosInstance from "../API/services/AxiosInstance";

export function useAutoLogout() {
  const { user, accessToken } = useAuthStore();

  const employee_id = user?.employee_id;

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user/profile/${employee_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

      } catch (error) {
        console.error("Failed to fetch user profile for auto logout", error);
      }
    }, 10000); // cek tiap 10 detik, sesuaikan kebutuhan

    return () => clearInterval(interval);
  }, [accessToken, user]);
}
