import { useEffect, useMemo, useState } from "react";
import { fmtCLP, stockEstado } from "../../utils/format.js";
import { gananciaUnitaria } from "../../utils/finanzas.js";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconList,
  IconGrid,
} from "../Icons/Icons.jsx";
import ProductModal from "./ProductModal.jsx";
import "./Inventario.css";

const POR_PAGINA = 8;

const BADGE = {
  ok: { className: "badge badge-ok", label: "OK" },
  low: { className: "badge badge-low", label: "Por agotarse" },
  crit: { className: "badge badge-crit", label: "Stock bajo" },
};

const ORDENES = {
  nombre: { label: "Nombre (A-Z)", fn: (a, b) => a.nombre.localeCompare(b.nombre, "es") },
  stock: { label: "Stock (menor primero)", fn: (a, b) => a.stock - b.stock },
  precio: { label: "Precio (mayor primero)", fn: (a, b) => b.precio - a.precio },
  ganancia: {
    label: "Ganancia por unidad (mayor primero)",
    fn: (a, b) => (gananciaUnitaria(b) ?? -1e12) - (gananciaUnitaria(a) ?? -1e12),
  },
  recientes: { label: "Más recientes", fn: (a, b) => b.id - a.id },
};

function StockBadge({ producto }) {
  const b = BADGE[stockEstado(producto)];
  return <span className={b.className}>{b.label}</span>;
}

// Línea con lo que ganas por unidad (precio de venta - precio de compra)
function GananciaLinea({ producto }) {
  const g = gananciaUnitaria(producto);
  if (g === null) return <p className="prod-ganancia falta">Falta el precio de compra</p>;
  return (
    <p className={"prod-ganancia" + (g < 0 ? " neg" : "")}>
      {g < 0 ? "Pierdes " : "Ganas "}
      {fmtCLP(Math.abs(g))} c/u
    </p>
  );
}

export default function Inventario({ productos, onSave, onDelete }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [soloBajo, setSoloBajo] = useState(false);
  const [orden, setOrden] = useState("nombre");
  const [vista, setVista] = useState("lista"); // "lista" | "tarjetas"
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [editing, setEditing] = useState(null); // null | {} nuevo | producto existente

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => (p.categoria || "").trim()).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [productos]);
  // si se borró el último producto de la categoría elegida, volvemos a "Todas"
  const catActiva = categorias.includes(categoria) ? categoria : "Todas";

  const bajoCount = useMemo(() => productos.filter((p) => p.stock <= p.stockMin).length, [productos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos
      .filter(
        (p) =>
          !q ||
          p.nombre.toLowerCase().includes(q) ||
          (p.categoria || "").toLowerCase().includes(q)
      )
      .filter((p) => catActiva === "Todas" || (p.categoria || "").trim() === catActiva)
      .filter((p) => !soloBajo || p.stock <= p.stockMin)
      .sort(ORDENES[orden].fn);
  }, [productos, query, catActiva, soloBajo, orden]);

  // al cambiar cualquier filtro, volver a mostrar la primera página
  useEffect(() => {
    setVisibles(POR_PAGINA);
  }, [query, catActiva, soloBajo, orden]);

  const mostrados = filtered.slice(0, visibles);
  const restantes = filtered.length - mostrados.length;

  // el formulario se cierra solo si el servidor guardó bien el producto
  const handleSave = async (data) => {
    const ok = await onSave(data);
    if (ok) setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar este producto del inventario? Sus ventas anteriores se conservan.")) {
      onDelete(id);
    }
  };

  const acciones = (p) => (
    <div className="row-actions">
      <button className="icon-btn" onClick={() => setEditing(p)} aria-label={`Editar ${p.nombre}`}>
        <IconEdit />
      </button>
      <button className="icon-btn" onClick={() => handleDelete(p.id)} aria-label={`Eliminar ${p.nombre}`}>
        <IconTrash />
      </button>
    </div>
  );

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

      {productos.length > 0 && (
        <>
          <div className="chips-row">
            <button
              className={"filter-chip warn" + (soloBajo ? " active" : "")}
              onClick={() => setSoloBajo((v) => !v)}
            >
              ⚠️ Stock bajo ({bajoCount})
            </button>
            <button
              className={"filter-chip" + (catActiva === "Todas" ? " active" : "")}
              onClick={() => setCategoria("Todas")}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                className={"filter-chip" + (catActiva === c ? " active" : "")}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="inv-controls">
            <select value={orden} onChange={(e) => setOrden(e.target.value)} aria-label="Ordenar por">
              {Object.entries(ORDENES).map(([k, o]) => (
                <option key={k} value={k}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="view-toggle" role="group" aria-label="Tipo de vista">
              <button
                className={vista === "lista" ? "active" : ""}
                onClick={() => setVista("lista")}
                aria-label="Vista de lista"
              >
                <IconList />
              </button>
              <button
                className={vista === "tarjetas" ? "active" : ""}
                onClick={() => setVista("tarjetas")}
                aria-label="Vista de tarjetas"
              >
                <IconGrid />
              </button>
            </div>
          </div>

          <p className="result-count">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
            {filtered.length !== productos.length && ` de ${productos.length}`}
          </p>
        </>
      )}

      {filtered.length === 0 && productos.length === 0 && (
        <div className="card">
          <p className="empty">🧺 Todavía no tienes productos. ¡Agrega el primero!</p>
        </div>
      )}
      {filtered.length === 0 && productos.length > 0 && (
        <div className="card">
          <p className="empty">🔍 No encontramos productos con esos filtros.</p>
        </div>
      )}

      {filtered.length > 0 && vista === "lista" && (
        <div className="card" style={{ padding: "4px 12px" }}>
          {mostrados.map((p) => (
            <div className="prod-row" key={p.id}>
              <div className="prod-swatch">{p.nombre.slice(0, 1).toUpperCase()}</div>
              <div className="prod-main">
                <p className="prod-name">{p.nombre}</p>
                <p className="prod-meta">
                  {p.categoria} · {p.stock} un. en stock
                </p>
                <GananciaLinea producto={p} />
              </div>
              <div className="prod-right">
                <p className="prod-price">{fmtCLP(p.precio)}</p>
                <StockBadge producto={p} />
              </div>
              {acciones(p)}
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && vista === "tarjetas" && (
        <div className="prod-grid">
          {mostrados.map((p) => (
            <div className="prod-card" key={p.id}>
              <div className="prod-card-top">
                <div className="prod-swatch">{p.nombre.slice(0, 1).toUpperCase()}</div>
                <StockBadge producto={p} />
              </div>
              <p className="prod-name">{p.nombre}</p>
              <p className="prod-meta">
                {p.categoria} · {p.stock} un.
              </p>
              <GananciaLinea producto={p} />
              <div className="prod-card-bottom">
                <span className="prod-price">{fmtCLP(p.precio)}</span>
                {acciones(p)}
              </div>
            </div>
          ))}
        </div>
      )}

      {restantes > 0 && (
        <button
          className="btn btn-ghost btn-block"
          style={{ marginTop: 12 }}
          onClick={() => setVisibles((v) => v + POR_PAGINA)}
        >
          Ver más ({restantes} restantes)
        </button>
      )}

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
