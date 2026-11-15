import { useState } from "react";
import { fmtCLP } from "../../utils/format.js";
import { useInstallPrompt } from "../../hooks/useInstallPrompt.js";
import { IconDownload, IconLogout } from "../Icons/Icons.jsx";
import "./Header.css";

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export default function Header({ user, onLogout, ventasHoy, stockBajoCount }) {
  const { canInstall, promptInstall, installed } = useInstallPrompt();
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const iosNeedsHelp = isIOS() && !installed;

  const fechaLarga = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="top">
      <div className="row">
        <div className="who">
          <div className="avatar">{user.nombreDueño.slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="greet">{user.nombreNegocio}</p>
            <h1>Hola, {user.nombreDueño} 👋</h1>
          </div>
        </div>
        <div className="header-actions">
          {canInstall && (
            <button
              className="header-btn install-btn"
              onClick={promptInstall}
              title="Instalar Vendix"
              aria-label="Instalar Vendix"
            >
              <IconDownload size={15} />
              <span>Instalar Vendix</span>
            </button>
          )}
          {iosNeedsHelp && (
            <button
              className="header-btn install-btn"
              onClick={() => setShowIOSHint((visible) => !visible)}
              aria-expanded={showIOSHint}
              aria-label="Cómo instalar Vendix"
            >
              <IconDownload size={15} />
              <span>Cómo instalar</span>
            </button>
          )}
          {confirmingLogout ? (
            <button className="header-btn" onClick={onLogout} onBlur={() => setConfirmingLogout(false)}>
              ¿Salir?
            </button>
          ) : (
            <button className="header-btn logout-btn" onClick={() => setConfirmingLogout(true)} title="Cerrar sesión" aria-label="Cerrar sesión">
              <IconLogout size={15} />
            </button>
          )}
        </div>
      </div>

      {iosNeedsHelp && showIOSHint && (
        <div className="ios-hint" role="status">
          <span>
            Para instalar Vendix en tu iPhone: toca <strong>Compartir</strong> en Safari,
            luego <strong>Agregar a pantalla de inicio</strong> y confirma con <strong>Agregar</strong>.

          </span>
          <button onClick={() => setShowIOSHint(false)} aria-label="Cerrar instrucciones">
            ✕
          </button>
        </div>
      )}

      <div className="chips">
        <div className="chip">
          <p className="label">Hoy, {fechaLarga}</p>
          <p className="val">{fmtCLP(ventasHoy)} vendidos</p>
        </div>
        <div className="chip">
          <p className="label">Alertas de stock</p>
          <p className="val">
            {stockBajoCount} producto{stockBajoCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </header>
  );
}
