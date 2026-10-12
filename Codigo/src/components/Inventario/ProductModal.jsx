import { useState } from "react";
import { IconClose } from "../Icons/Icons.jsx";

export default function ProductModal({ producto, onClose, onSave }) {
  const [form, setForm] = useState({
    id: producto.id || null,
    nombre: producto.nombre || "",
    categoria: producto.categoria || "",
    precio: producto.precio ?? "",
    stock: producto.stock ?? "",
    stockMin: producto.stockMin ?? 3,
  });
  const valid = form.nombre.trim() && form.precio !== "" && form.stock !== "";

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
            <label className="field">Precio (CLP)</label>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
            />
          </div>
          <div className="field-wrap" style={{ flex: 1 }}>
            <label className="field">Stock inicial</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="field-wrap">
          <label className="field">Aviso de stock bajo cuando queden</label>
          <input
            type="number"
            value={form.stockMin}
            onChange={(e) => setForm({ ...form, stockMin: Number(e.target.value) })}
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
