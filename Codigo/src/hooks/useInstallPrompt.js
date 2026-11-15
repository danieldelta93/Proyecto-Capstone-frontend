import { useEffect, useState } from "react";

// Captura el evento desde que se carga el módulo, antes de que React monte
// el Header. Así no se pierde beforeinstallprompt si Chrome lo dispara pronto.
let deferredPrompt = null;
const subscribers = new Set();

const notify = () => {
  subscribers.forEach((callback) => callback(deferredPrompt));
};

if (typeof window !== "undefined" && !window.__vendixInstallPromptReady) {
  window.__vendixInstallPromptReady = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(deferredPrompt);
  const [installed, setInstalled] = useState(() =>
    typeof window !== "undefined" && (
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    )
  );

  useEffect(() => {
    const updatePrompt = (event) => setPromptEvent(event);
    subscribers.add(updatePrompt);
    setPromptEvent(deferredPrompt);

    const displayMode = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = (event) => {
      if (event.matches) setInstalled(true);
    };
    displayMode?.addEventListener?.("change", onDisplayModeChange);

    return () => {
      subscribers.delete(updatePrompt);
      displayMode?.removeEventListener?.("change", onDisplayModeChange);
    };
  }, []);

  const promptInstall = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice?.outcome === "accepted") setInstalled(true);
    deferredPrompt = null;
    setPromptEvent(null);
    notify();
  };

  return {
    canInstall: Boolean(promptEvent) && !installed,
    promptInstall,
    installed,
  };
}
