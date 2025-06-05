import { ToastContainer } from "react-toastify";
import { useTheme } from "../hooks/useTheme";

const ThemedToastContainer = () => {
  const { isDark } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "light"}
    />
  );
};

export default ThemedToastContainer;
