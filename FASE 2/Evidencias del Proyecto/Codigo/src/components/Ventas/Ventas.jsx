import { useState } from "react";
import { fmtCLP } from "../../utils/format.js";
import { IconPlus } from "../Icons/Icons.jsx";
import NuevaVentaModal from "./NuevaVentaModal.jsx";
import "./Ventas.css";

export default function Ventas({ productos, ventas, onRegistrarVenta }) {
  const [showNew, setShowNew] = useState(false);

  const registrarVenta = (items, metodo) => {
    onRegistrarVenta(items, metodo);
    setShowNew(false);
  };

  const sorted = [...ventas].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id
  );

  return (
    <div>
      <h2 className="screen-title">Ventas</h2>
      <p className="screen-sub">Registra una venta y el stock se descuenta solo.</p>

      <button
        className="btn btn-accent btn-block"
        onClick={() => setShowNew(true)}
        style={{ marginBottom: 14 }}
      >
        <IconPlus size={17} /> Registrar nueva venta
      </button>

      <div className="card" style={{ padding: "4px 12px" }}>
        {sorted.length === 0 && <p className="empty">🧾 Todavía no registras ventas.</p>}
        {sorted.map((v) => (
          <div className="prod-row" key={v.id}>
            <div
              className="prod-swatch"
              style={{ background: "var(--accent-tint)", color: "#8A5A00" }}
            >
              {new Date(v.fecha + "T12:00:00").getDate()}
            </div>
            <div className="prod-main">
              <p className="prod-name">
                {v.items
                  .map((it) => {
                    const p = productos.find((p) => p.id === it.productoId);
                    return `${it.cantidad}× ${p ? p.nombre : "Producto eliminado"}`;
                  })
                  .join(", ")}
              </p>
              <p className="prod-meta">
                {new Date(v.fecha + "T12:00:00").toLocaleDateString("es-CL", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div className="prod-right">
              <p className="prod-price">{fmtCLP(v.total)}</p>
              <span className="payment-tag">{v.metodo}</span>
            </div>
          </div>
        ))}
      </div>

      {showNew && (
        <NuevaVentaModal
          productos={productos}
          onClose={() => setShowNew(false)}
          onConfirm={registrarVenta}
        />
      )}
    </div>
  );
}
