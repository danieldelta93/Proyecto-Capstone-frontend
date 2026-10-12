import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/variables.css";
import "./styles/base.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra el service worker para que la app sea instalable y
// funcione offline. Solo en producción: en modo desarrollo la caché
// del service worker suele confundir al recargar cambios.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("No se pudo registrar el service worker", err);
    });
  });
}
