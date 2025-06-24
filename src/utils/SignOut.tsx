import { NavigateFunction } from "react-router-dom";
import { useStoreMenu } from "../DynamicAPI/stores/Store/MasterStore";
import { useAuthStore } from "../API/store/AuthStore/authStore";

export const signOut = (navigate: NavigateFunction) => {
  const resetAuth = useAuthStore.getState().resetAuth; // Akses resetAuth dengan getState
// menuStore  const menuStore = .getState();
//   menuStore.reset();

  resetAuth(); // Panggil resetAuth untuk mereset state auth
  localStorage.clear();

  // Pastikan navigate dipanggil setelah state diperbarui
  navigate("/signin", { replace: true });
};
