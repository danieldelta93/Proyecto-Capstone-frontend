import { useState } from "react";
import * as XLSX from "xlsx-js-style";
import { costoDeItem, finanzasDeVentas, gananciaUnitaria, valorInventario } from "../../utils/finanzas.js";
import { fmtCLP } from "../../utils/format.js";
import "./Reportes.css";

const fechaGeneracion = () => new Date().toLocaleString("es-CL");
const fechaLegible = (valor) => {
  if (!valor) return "";
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleDateString("es-CL");
};
const estadoVenta = (v) => v.estado === "anulada" ? "Anulada" : "Completada";
const encabezado = {
  fill: { fgColor: { rgb: "173F35" } },
  font: { bold: true, color: { rgb: "FFFFFF" } },
  alignment: { vertical: "center", horizontal: "center", wrapText: true },
};
const titulo = { font: { bold: true, color: { rgb: "173F35" }, sz: 16 } };
const moneda = { numFmt: '"$" #,##0;[Red]-"$" #,##0' };
const borde = { bottom: { style: "thin", color: { rgb: "DCE5E1" } } };

function prepararHoja(ws, anchos, ultimaColumna, ultimaFila) {
  ws["!cols"] = anchos.map((wch) => ({ wch }));
  ws["!autofilter"] = { ref: `A1:${ultimaColumna}${Math.max(1, ultimaFila)}` };
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };
  const rango = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
  for (let c = rango.s.c; c <= rango.e.c; c++) {
    const celda = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (celda) celda.s = encabezado;
  }
  for (let r = 1; r <= rango.e.r; r++) {
    for (let c = 0; c <= rango.e.c; c++) {
      const celda = ws[XLSX.utils.encode_cell({ r, c })];
      if (celda) celda.s = { ...(celda.s || {}), border: borde, alignment: { vertical: "center" } };
    }
  }
}
function aplicarMoneda(ws, columnas, desdeFila = 1) {
  const rango = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
  for (const col of columnas) for (let r = desdeFila; r <= rango.e.r; r++) {
    const celda = ws[XLSX.utils.encode_cell({ r, c: col })];
    if (celda && typeof celda.v === "number") celda.s = { ...(celda.s || {}), ...moneda };
  }
}
function descargarLibro(nombre, hojas) {
  const libro = XLSX.utils.book_new();
  hojas.forEach(({ nombre: nombreHoja, datos, anchos, ultimaColumna, monedas = [] }) => {
    const ws = XLSX.utils.aoa_to_sheet(datos);
    prepararHoja(ws, anchos, ultimaColumna, datos.length);
    aplicarMoneda(ws, monedas);
    XLSX.utils.book_append_sheet(libro, ws, nombreHoja);
  });
  XLSX.writeFile(libro, nombre, { bookType: "xlsx", compression: true });
}

export default function Reportes({ productos = [], ventas = [] }) {
  const [reportePDF, setReportePDF] = useState(null);
  const inventario = valorInventario(productos);

  const exportarInventarioExcel = () => {
    const filas = [["Producto", "Categoría", "Costo unitario", "Precio de venta", "Ganancia por unidad", "Stock actual", "Stock mínimo", "Valor del stock"]];
    productos.forEach((p) => filas.push([
      p.nombre ?? "", p.categoria ?? "", Number.isFinite(Number(p.costo)) && p.costo !== null ? Number(p.costo) : "",
      Number(p.precio) || 0, gananciaUnitaria(p) ?? "", Number(p.stock) || 0, Number(p.stockMin) || 0,
      p.costo == null ? "" : Number(p.costo) * (Number(p.stock) || 0),
    ]));
    descargarLibro("Vendix_Inventario.xlsx", [
      { nombre: "Inventario", datos: filas, anchos: [30, 22, 17, 17, 20, 14, 14, 19], ultimaColumna: "H", monedas: [2, 3, 4, 7] },
      { nombre: "Resumen", datos: [["Indicador", "Valor"], ["Productos registrados", productos.length], ["Unidades en stock", productos.reduce((s, p) => s + (Number(p.stock) || 0), 0)], ["Valor del inventario a costo", inventario.costo], ["Ganancia potencial estimada", inventario.gananciaPotencial], ["Productos con costo registrado", inventario.conCosto]], anchos: [34, 24], ultimaColumna: "B", monedas: [1] },
    ]);
  };

  const exportarVentasExcel = () => {
    const filas = [["Fecha", "ID venta", "Producto", "Cantidad", "Precio unitario", "Subtotal", "Costo unitario", "Inversión", "Ganancia", "Método de pago", "Estado"]];
    ventas.forEach((v) => (v.items || []).forEach((it) => {
      const costo = costoDeItem(it, productos);
      const cantidad = Number(it.cantidad) || 0;
      const precio = Number(it.precioUnit) || 0;
      const anulada = v.estado === "anulada";
      filas.push([fechaLegible(v.fecha), v.id ?? "", it.nombre ?? "Producto", cantidad, precio, anulada ? 0 : cantidad * precio,
        costo, costo == null || anulada ? "" : cantidad * costo,
        costo == null || anulada ? "" : cantidad * (precio - costo), v.metodo ?? "", estadoVenta(v)]);
    }));
    const resumen = finanzasDeVentas(ventas.filter((v) => v.estado !== "anulada"), productos);
    descargarLibro("Vendix_Ventas.xlsx", [
      { nombre: "Detalle de ventas", datos: filas, anchos: [16, 16, 28, 12, 18, 17, 18, 17, 17, 20, 16], ultimaColumna: "K", monedas: [4, 5, 6, 7, 8] },
      { nombre: "Resumen", datos: [["Indicador", "Valor"], ["Ventas registradas", ventas.filter((v) => v.estado !== "anulada").length], ["Ingresos calculados", resumen.ingresos], ["Inversión calculada", resumen.invertido], ["Ganancia calculada", resumen.ganancia], ["Ventas con costos incompletos", resumen.ventasSinCosto]], anchos: [36, 24], ultimaColumna: "B", monedas: [1] },
    ]);
  };

  const imprimir = (tipo) => {
    setReportePDF(tipo);
    setTimeout(() => window.print(), 100);
  };

  const esInventario = reportePDF === "inventario";
  const filasInventario = productos;
  const filasVentas = ventas;

  return (
    <div className="reportes-page">
      <h2 className="screen-title">Reportes</h2>
      <p className="screen-sub">Descarga y consulta tu información fuera de Vendix.</p>

      <section className="card report-card">
        <h3>Reporte de inventario</h3>
        <p>Productos, categorías, costos, precios y existencias actuales.</p>
        <div className="report-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportarInventarioExcel}>Descargar Excel (.xlsx)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => imprimir("inventario")}>Descargar PDF</button>
        </div>
      </section>

      <section className="card report-card">
        <h3>Reporte de ventas</h3>
        <p>Detalle de productos vendidos, montos, costos y métodos de pago.</p>
        <div className="report-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportarVentasExcel}>Descargar Excel (.xlsx)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => imprimir("ventas")}>Descargar PDF</button>
        </div>
      </section>

      <div className="card report-note"><p>Tus reportes se generan con la información disponible en tu cuenta de Vendix.</p></div>

      <section id="reporte-impresion" aria-hidden="true">
        <header className="pdf-header">
          <div><strong>VENDIX</strong><span>Gestión de ventas e inventario</span></div>
          <h1>Reporte de {esInventario ? "inventario" : "ventas"}</h1>
          <p>Generado el {fechaGeneracion()}</p>
        </header>
        {esInventario ? (
          <>
            <div className="pdf-summary"><div><b>{productos.length}</b><span>Productos</span></div><div><b>{productos.reduce((s,p)=>s+(Number(p.stock)||0),0)}</b><span>Unidades en stock</span></div><div><b>{fmtCLP(inventario.costo)}</b><span>Valor del inventario a costo</span></div></div>
            <table className="pdf-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Costo</th><th>Precio</th><th>Stock</th><th>Stock mínimo</th></tr></thead><tbody>{filasInventario.map((p,i)=><tr key={p.id ?? i}><td>{p.nombre}</td><td>{p.categoria || "—"}</td><td>{p.costo == null ? "—" : fmtCLP(p.costo)}</td><td>{fmtCLP(Number(p.precio)||0)}</td><td>{p.stock}</td><td>{p.stockMin}</td></tr>)}</tbody></table>
          </>
        ) : (
          <>
            <div className="pdf-summary"><div><b>{filasVentas.filter(v=>v.estado!=="anulada").length}</b><span>Ventas completadas</span></div><div><b>{fmtCLP(finanzasDeVentas(filasVentas.filter(v=>v.estado!=="anulada"),productos).ingresos)}</b><span>Ingresos con costo conocido</span></div><div><b>{fmtCLP(finanzasDeVentas(filasVentas.filter(v=>v.estado!=="anulada"),productos).ganancia)}</b><span>Ganancia calculada</span></div></div>
            <table className="pdf-table"><thead><tr><th>Fecha</th><th>Productos</th><th>Total</th><th>Método</th><th>Estado</th></tr></thead><tbody>{filasVentas.map((v,i)=><tr key={v.id ?? i}><td>{fechaLegible(v.fecha)}</td><td>{(v.items||[]).map(it=>`${it.cantidad}x ${it.nombre ?? "Producto"}`).join(", ")}</td><td>{fmtCLP(Number(v.total)||0)}</td><td>{v.metodo || "—"}</td><td>{estadoVenta(v)}</td></tr>)}</tbody></table>
          </>
        )}
        <footer className="pdf-footer">Vendix · Informe generado desde tu cuenta</footer>
      </section>
    </div>
  );
}
