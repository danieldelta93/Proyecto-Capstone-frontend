import { useState } from "react";
import { fmtCLP, stockEstado } from "../../utils/format.js";
import { IconPlus, IconSearch, IconEdit, IconTrash } from "../Icons/Icons.jsx";
import ProductModal from "./ProductModal.jsx";
import "./Inventario.css";

const BADGE = {
  ok: { className: "badge badge-ok", label: "OK" },
  low: { className: "badge badge-low", label: "Por agotarse" },
  crit: { className: "badge badge-crit", label: "Stock bajo" },
};

function StockBadge({ producto }) {
  const b = BADGE[stockEstado(producto)];
  return <span className={b.className}>{b.label}</span>;
}

export default function Inventario({ productos, setProductos, onSave }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | {} nuevo | producto existente

  const filtered = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      p.categoria.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = (data) => {
    onSave(data);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar este producto del inventario?")) {
      setProductos((list) => list.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <h2 className="screen-title">Inventario</h2>
      <p className="screen-sub">Agrega, edita o elimina los productos que vendes.</p>

      <div className="searchbar">
        <IconSearch size={17} />
        <input
          placeholder="Buscar producto o categoría"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={() => setEditing({})}
        style={{ marginBottom: 14 }}
      >
        <IconPlus size={17} /> Agregar producto
      </button>

      <div className="card" style={{ padding: "4px 12px" }}>
        {filtered.length === 0 && productos.length === 0 && (
          <p className="empty">🧺 Todavía no tienes productos. ¡Agrega el primero!</p>
        )}
        {filtered.length === 0 && productos.length > 0 && (
          <p className="empty">🔍 No encontramos productos con ese nombre.</p>
        )}
        {filtered.map((p) => (
          <div className="prod-row" key={p.id}>
            <div className="prod-swatch">{p.nombre.slice(0, 1).toUpperCase()}</div>
            <div className="prod-main">
              <p className="prod-name">{p.nombre}</p>
              <p className="prod-meta">
                {p.categoria} · {p.stock} un. en stock
              </p>
            </div>
            <div className="prod-right">
              <p className="prod-price">{fmtCLP(p.precio)}</p>
              <StockBadge producto={p} />
            </div>
            <div className="row-actions">
              <button className="icon-btn" onClick={() => setEditing(p)}>
                <IconEdit />
              </button>
              <button className="icon-btn" onClick={() => handleDelete(p.id)}>
                <IconTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductModal
          producto={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
