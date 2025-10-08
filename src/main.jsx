import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      style={{ marginTop: "50px" }} // Điều chỉnh khoảng cách từ trên
      autoClose={1000} // Thời gian hiển thị của toast là 2 giây
    />
  </StrictMode>,
);
