import { useState } from "react";
import { fmtCLP } from "../../utils/format.js";
import { useInstallPrompt } from "../../hooks/useInstallPrompt.js";
import { IconDownload, IconLogout } from "../Icons/Icons.jsx";
import "./Header.css";

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export default function Header({ user, onLogout, ventasHoy, stockBajoCount }) {
  const { canInstall, promptInstall, installed } = useInstallPrompt();
  const [dismissedIOSHint, setDismissedIOSHint] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const showIOSHint = isIOS() && !installed && !dismissedIOSHint;

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
            <button className="header-btn" onClick={promptInstall} title="Instalar Vendix">
              <IconDownload size={15} />
            </button>
          )}
          {confirmingLogout ? (
            <button className="header-btn" onClick={onLogout} onBlur={() => setConfirmingLogout(false)}>
              ¿Salir?
            </button>
          ) : (
            <button className="header-btn" onClick={() => setConfirmingLogout(true)} title="Cerrar sesión">
              <IconLogout size={15} />
            </button>
          )}
        </div>
      </div>

      {showIOSHint && (
        <div className="ios-hint">
          <span>
            Para instalarla: toca <strong>Compartir</strong> y luego{" "}
            <strong>Agregar a inicio</strong>.
          </span>
          <button onClick={() => setDismissedIOSHint(true)} aria-label="Cerrar aviso">
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
