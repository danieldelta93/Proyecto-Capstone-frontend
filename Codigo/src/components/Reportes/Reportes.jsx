import { descargarCSV } from "../../utils/csv.js";
import "./Reportes.css";

export default function Reportes({ productos, ventas, onReset, isDemo }) {
  const exportarInventarioCSV = () => {
    const filas = [["Producto", "Categoría", "Precio", "Stock", "Stock mínimo"]];
    productos.forEach((p) => filas.push([p.nombre, p.categoria, p.precio, p.stock, p.stockMin]));
    descargarCSV("inventario.csv", filas);
  };

  const exportarVentasCSV = () => {
    const filas = [["Fecha", "Productos", "Total", "Método de pago"]];
    ventas.forEach((v) =>
      filas.push([
        v.fecha,
        v.items
          .map((it) => {
            const p = productos.find((p) => p.id === it.productoId);
            return `${it.cantidad}x ${p ? p.nombre : "?"}`;
          })
          .join(" | "),
        v.total,
        v.metodo,
      ])
    );
    descargarCSV("ventas.csv", filas);
  };

  return (
    <div>
      <h2 className="screen-title">Reportes</h2>
      <p className="screen-sub">Exporta tu información para verla fuera de la app.</p>

      <div className="card report-card">
        <h3>Reporte de inventario</h3>
        <p>Lista completa de tus productos, precios y stock actual.</p>
        <div className="report-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportarInventarioCSV}>
            Exportar Excel (CSV)
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="card report-card">
        <h3>Reporte de ventas</h3>
        <p>Historial de ventas registradas, con productos, montos y método de pago.</p>
        <div className="report-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportarVentasCSV}>
            Exportar Excel (CSV)
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ background: "var(--surface-alt)", border: "none" }}>
        <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--ink-soft)" }}>
          {isDemo
            ? "Estás en la cuenta demo: tus cambios se guardan solo en este dispositivo. Si quieres volver a los datos de ejemplo:"
            : "Tus datos se guardan solo en este dispositivo, asociados a tu cuenta."}
        </p>
        <button className="btn btn-danger btn-sm" onClick={onReset}>
          {isDemo ? "Restablecer datos de ejemplo" : "Borrar todos mis datos"}
        </button>
      </div>
    </div>
  );
}
