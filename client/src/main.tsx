import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./App.tsx";
import "./index.css";

console.log(import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <App />
  </StrictMode>
);
