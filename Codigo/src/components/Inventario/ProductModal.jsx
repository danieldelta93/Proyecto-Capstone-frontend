import { useState } from "react";
import { fmtCLP } from "../../utils/format.js";
import { margenPct } from "../../utils/finanzas.js";
import { IconClose } from "../Icons/Icons.jsx";
import "./ProductModal.css";

// "" mientras el campo está vacío; número cuando tiene algo
const num = (v) => (v === "" ? "" : Number(v));

export default function ProductModal({ producto, onClose, onSave }) {
  const [form, setForm] = useState({
    id: producto.id || null,
    nombre: producto.nombre || "",
    categoria: producto.categoria || "",
    costo: producto.costo ?? "", // precio de compra
    precio: producto.precio ?? "", // precio de venta
    stock: producto.stock ?? "",
    stockMin: producto.stockMin ?? 3,
  });
  const valid =
    form.nombre.trim() && form.costo !== "" && form.precio !== "" && form.stock !== "";

  const hayPrecios = form.costo !== "" && form.precio !== "";
  const ganancia = hayPrecios ? form.precio - form.costo : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-row">
          <h3>{form.id ? "Editar producto" : "Nuevo producto"}</h3>
          <button className="icon-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <div className="field-wrap">
          <label className="field">Nombre del producto</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Gorro de lana"
          />
        </div>

        <div className="field-wrap">
          <label className="field">Categoría</label>
          <input
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            placeholder="Ej: Gorros, Ropa, Accesorios"
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div className="field-wrap" style={{ flex: 1 }}>
            <label className="field">Precio de compra</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Ej: 3000"
              value={form.costo}
              onChange={(e) => setForm({ ...form, costo: num(e.target.value) })}
            />
          </div>
          <div className="field-wrap" style={{ flex: 1 }}>
            <label className="field">Precio de venta</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Ej: 5000"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: num(e.target.value) })}
            />
          </div>
        </div>

        {hayPrecios && (
          <div className={"ganancia-box" + (ganancia < 0 ? " neg" : "")}>
            <span>Ganancia por unidad</span>
            <b>{fmtCLP(ganancia)}</b>
            <small>
              {ganancia < 0
                ? "Estás vendiendo bajo el costo"
                : `Margen ${margenPct(form.precio, form.costo).toFixed(0)}%`}
            </small>
          </div>
        )}

        <div className="field-wrap">
          <label className="field">Stock inicial</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: num(e.target.value) })}
          />
        </div>

        <div className="field-wrap">
          <label className="field">Aviso de stock bajo cuando queden</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={form.stockMin}
            onChange={(e) => setForm({ ...form, stockMin: num(e.target.value) })}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={!valid}
          onClick={() => onSave(form)}
        >
          Guardar producto
        </button>
      </div>
    </div>
  );
}
