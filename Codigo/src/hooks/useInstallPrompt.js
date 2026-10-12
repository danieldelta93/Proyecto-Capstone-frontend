import { useEffect, useState } from "react";

// Escucha el evento que dispara Chrome/Edge/Android cuando la app
// cumple los requisitos para instalarse (manifest + service worker +
// servida por HTTPS), y expone una función para mostrar ese diálogo
// nativo bajo demanda (por ejemplo, desde un botón "Instalar app").
//
// En iOS Safari no existe este evento: ahí la instalación es manual
// (compartir → Agregar a pantalla de inicio), así que el botón
// simplemente no aparece y hay que indicarlo en la interfaz si se
// quiere guiar a esos usuarios.
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
  );

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return { canInstall: !!deferredPrompt && !installed, promptInstall, installed };
}
