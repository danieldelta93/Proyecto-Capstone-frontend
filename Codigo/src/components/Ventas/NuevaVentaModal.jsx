import { useState } from "react";
import { fmtCLP } from "../../utils/format.js";
import { IconPlus, IconClose } from "../Icons/Icons.jsx";
import "./NuevaVentaModal.css";

export default function NuevaVentaModal({ productos, onClose, onConfirm }) {
  const [cart, setCart] = useState({}); // productoId -> cantidad
  const [productoSel, setProductoSel] = useState(productos[0]?.id || "");
  const [metodo, setMetodo] = useState("Efectivo");

  const addToCart = () => {
    if (!productoSel) return;
    setCart((c) => ({ ...c, [productoSel]: (c[productoSel] || 0) + 1 }));
  };

  const changeQty = (id, delta) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const items = Object.entries(cart)
    .map(([id, cantidad]) => {
      const p = productos.find((p) => p.id === Number(id));
      return p
        ? {
            productoId: p.id,
            cantidad,
            precioUnit: p.precio,
            costoUnit: typeof p.costo === "number" ? p.costo : null,
            nombre: p.nombre,
            disponible: p.stock,
          }
        : null;
    })
    .filter(Boolean);

  const total = items.reduce((a, it) => a + it.cantidad * it.precioUnit, 0);
  // ganancia estimada de esta venta (solo si todos los productos tienen precio de compra)
  const gananciaEst = items.every((it) => it.costoUnit !== null)
    ? items.reduce((a, it) => a + it.cantidad * (it.precioUnit - it.costoUnit), 0)
    : null;
  const excedeStock = items.some((it) => it.cantidad > it.disponible);
  const puedeConfirmar = items.length > 0 && !excedeStock;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-row">
          <h3>Nueva venta</h3>
          <button className="icon-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <div className="field-wrap">
          <label className="field">Producto</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={productoSel} onChange={(e) => setProductoSel(Number(e.target.value))}>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {fmtCLP(p.precio)}
                </option>
              ))}
            </select>
            <button className="btn btn-ghost" onClick={addToCart}>
              <IconPlus size={16} />
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="field-wrap">
            <label className="field">Carrito de venta</label>
            {items.map((it) => (
              <div className="cart-item" key={it.productoId}>
                <div>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>{it.nombre}</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11.5,
                      color: it.cantidad > it.disponible ? "var(--danger)" : "var(--ink-soft)",
                    }}
                  >
                    {it.cantidad > it.disponible
                      ? `Solo quedan ${it.disponible} unidades`
                      : `${fmtCLP(it.precioUnit)} c/u`}
                  </p>
                </div>
                <div className="stepper">
                  <button onClick={() => changeQty(it.productoId, -1)}>–</button>
                  <span className="n">{it.cantidad}</span>
                  <button onClick={() => changeQty(it.productoId, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="field-wrap">
          <label className="field">Método de pago</label>
          <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </div>

        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--primary-tint)",
            border: "none",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>Total a cobrar</span>
          <span className="num" style={{ fontWeight: 800, fontSize: 19 }}>
            {fmtCLP(total)}
          </span>
        </div>

        {items.length > 0 && gananciaEst !== null && (
          <p className="ganancia-venta">
            Ganancia estimada: <b>{fmtCLP(gananciaEst)}</b>
          </p>
        )}

        <button
          className="btn btn-primary btn-block"
          disabled={!puedeConfirmar}
          onClick={() =>
            onConfirm(
              items.map(({ productoId, cantidad, precioUnit, costoUnit }) => ({
                productoId,
                cantidad,
                precioUnit,
                costoUnit,
              })),
              metodo
            )
          }
          style={{ marginTop: 10 }}
        >
          Registrar venta
        </button>
      </div>
    </div>
  );
}
