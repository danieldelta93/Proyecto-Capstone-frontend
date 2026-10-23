import { descargarCSV } from "../../utils/csv.js";
import { finanzasDeVentas, gananciaUnitaria } from "../../utils/finanzas.js";
import "./Reportes.css";

export default function Reportes({ productos, ventas }) {
  const exportarInventarioCSV = () => {
    const filas = [
      ["Producto", "Categoría", "Precio de compra", "Precio de venta", "Ganancia por unidad", "Stock", "Stock mínimo"],
    ];
    productos.forEach((p) =>
      filas.push([
        p.nombre,
        p.categoria,
        p.costo ?? "",
        p.precio,
        gananciaUnitaria(p) ?? "",
        p.stock,
        p.stockMin,
      ])
    );
    descargarCSV("inventario.csv", filas);
  };

  const exportarVentasCSV = () => {
    const filas = [["Fecha", "Productos", "Total", "Invertido", "Ganancia", "Método de pago", "Estado"]];
    ventas.forEach((v) => {
      const f = finanzasDeVentas([v], productos);
      const completa = f.ventasSinCosto === 0 && v.estado !== "anulada"; // si falta algún precio de compra, se deja en blanco
      filas.push([
        v.fecha,
        v.items
          .map((it) => {
            return `${it.cantidad}x ${it.nombre ?? "?"}`;
          })
          .join(" | "),
        v.total,
        completa ? f.invertido : "",
        completa ? f.ganancia : "",
        v.metodo,
        v.estado === "anulada" ? "Anulada" : "Completada",
      ]);
    });
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
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-soft)" }}>
          Tus datos están guardados de forma segura en el servidor, asociados a tu cuenta: puedes entrar desde cualquier
          dispositivo con tu correo y contraseña.
        </p>
      </div>
    </div>
  );
}
