import { NavigateFunction } from "react-router-dom";
import { useAuthStore } from "../API/store/AuthStore/authStore";

export const signOut = (navigate: NavigateFunction) => {
  const resetAuth = useAuthStore.getState().resetAuth; // Akses resetAuth dengan getState
  resetAuth(); 
  localStorage.clear();

  navigate("/signin", { replace: true });
};
