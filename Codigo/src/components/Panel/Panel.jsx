import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { api } from "../../api/api.js";
import { fmtCLP } from "../../utils/format.js";
import { IconAlert } from "../Icons/Icons.jsx";
import "./Panel.css";

const etiquetaFecha = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "short" });

// Los números del panel los calcula el servidor con consultas SQL (ventas por día, más vendidos,
// inversión y ganancia, alertas de stock). `productos` y `ventas` llegan solo para saber cuándo
// hubo cambios y volver a pedir los datos.
export default function Panel({ productos, ventas }) {
  const [rango, setRango] = useState(7);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const topBarRef = useRef(null);
  const diasBarRef = useRef(null);
  const finBarRef = useRef(null);
  const graficos = useRef([]);

  useEffect(() => {
    let vigente = true;
    setError("");
    Promise.all([api.resumen(rango), api.ventasPorDia(rango), api.masVendidos(rango, 5), api.stockBajo(), api.valorInventario()])
      .then(([resumen, porDia, top, bajo, inventario]) => {
        if (vigente) setDatos({ resumen, porDia, top, bajo, inventario });
      })
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [rango, productos, ventas]);

  useEffect(() => {
    graficos.current.forEach((g) => g.destroy());
    graficos.current = [];
    if (!datos) return;

    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink").trim();
    const primary = styles.getPropertyValue("--primary").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    const line = styles.getPropertyValue("--line").trim();
    const inkSoft = styles.getPropertyValue("--ink-soft").trim();
    const labels = datos.porDia.map((d) => etiquetaFecha(d.fecha));
    const ejeX = { grid: { display: false }, ticks: { color: ink, font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } };
    const ejeY = { grid: { color: line }, ticks: { color: ink, font: { size: 10 } } };
    const pesos = (n) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("es-CL");

    // Ventas por día: barras verticales
    if (diasBarRef.current) {
      graficos.current.push(
        new Chart(diasBarRef.current, {
          type: "bar",
          data: { labels, datasets: [{ data: datos.porDia.map((d) => d.total), backgroundColor: accent, borderRadius: 6, maxBarThickness: 28 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: ejeX, y: ejeY } },
        })
      );
    }

    // Inversión y ganancia: barras apiladas (invertido + ganancia = lo vendido)
    if (finBarRef.current) {
      graficos.current.push(
        new Chart(finBarRef.current, {
          type: "bar",
          data: {
            labels,
            datasets: [
              { label: "Invertido", data: datos.porDia.map((d) => d.invertido), backgroundColor: inkSoft, maxBarThickness: 28 },
              { label: "Ganancia", data: datos.porDia.map((d) => d.ganancia), backgroundColor: primary, maxBarThickness: 28 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: "bottom", labels: { color: ink, boxWidth: 12, font: { size: 11 } } },
              tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pesos(c.parsed.y)}` } },
            },
            scales: { x: { ...ejeX, stacked: true }, y: { ...ejeY, stacked: true } },
          },
        })
      );
    }

    // Productos más vendidos: barras horizontales
    if (topBarRef.current) {
      graficos.current.push(
        new Chart(topBarRef.current, {
          type: "bar",
          data: { labels: datos.top.map((t) => t.nombre), datasets: [{ data: datos.top.map((t) => t.cantidad), backgroundColor: primary, borderRadius: 6, maxBarThickness: 22 }] },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { grid: { color: line }, ticks: { color: ink, font: { size: 10 } } }, y: { grid: { display: false }, ticks: { color: ink, font: { size: 11 } } } },
          },
        })
      );
    }
    return () => {
      graficos.current.forEach((g) => g.destroy());
      graficos.current = [];
    };
  }, [datos]);

  let cuerpo;
  if (error && !datos) {
    cuerpo = <p className="empty">😕 {error}</p>;
  } else if (!datos) {
    cuerpo = <p className="empty">⏳ Calculando tu panel…</p>;
  } else {
    const { resumen: r, top, bajo, inventario } = datos;
    const hayFin = r.margenPct !== null; // hay ventas con precio de compra conocido
    const v = r.variacionIngresosPct;
    cuerpo = (
      <>
        <div className="stat-grid">
          <div className="stat-card">
            <p className="label">Ventas del período</p>
            <p className="num">{fmtCLP(r.ingresos)}</p>
            {v !== null && (
              <p className={"variacion " + (v >= 0 ? "sube" : "baja")}>
                {v >= 0 ? "▲" : "▼"} {Math.abs(v)}% vs período anterior
              </p>
            )}
          </div>
          <div className="stat-card">
            <p className="label">Ticket promedio</p>
            <p className="num">{fmtCLP(r.ticketPromedio)}</p>
          </div>
          <div className="stat-card">
            <p className="label">Producto estrella</p>
            <p className="num small">{top[0]?.nombre ?? "—"}</p>
          </div>
          <div className="stat-card">
            <p className="label">Ventas registradas</p>
            <p className="num">{r.ventas}</p>
          </div>
        </div>

        <div className="chart-wrap">
          <h4>Ventas por día</h4>
          <div className="chart-canvas-box">
            <canvas ref={diasBarRef}></canvas>
          </div>
        </div>

        <div className="chart-wrap">
          <h4>Inversión y ganancia</h4>
          {hayFin ? (
            <>
              <div className="fin-kpis">
                <div className="fin-kpi">
                  <p className="label">
                    <i className="punto gris" /> Invertido
                  </p>
                  <p className="valor">{fmtCLP(r.invertido)}</p>
                </div>
                <div className="fin-kpi">
                  <p className="label">
                    <i className="punto verde" /> Ganancia
                  </p>
                  <p className={"valor" + (r.ganancia < 0 ? " neg" : " verde")}>{fmtCLP(r.ganancia)}</p>
                </div>
                <div className="fin-kpi">
                  <p className="label">Margen</p>
                  <p className="valor">{Math.round(r.margenPct)}%</p>
                </div>
              </div>
              <div className="chart-canvas-box alto">
                <canvas ref={finBarRef}></canvas>
              </div>
              <p className="fin-nota">
                Invertido es lo que te costaron los productos que vendiste en estos días; lo invertido más la ganancia da
                el total vendido.
                {r.ventasSinCosto > 0 &&
                  ` No se cuentan ${r.ventasSinCosto} venta${r.ventasSinCosto === 1 ? "" : "s"} con productos sin precio de compra.`}
              </p>
            </>
          ) : (
            <p className="empty">
              💰 Agrega el precio de compra a tus productos y registra ventas para ver cuánto inviertes y cuánto ganas.
            </p>
          )}
          {inventario.productosConCosto > 0 && inventario.costo > 0 && (
            <p className="fin-nota">
              Hoy tienes {fmtCLP(inventario.costo)} en mercadería (a precio de compra). Si la vendes toda, ganarías{" "}
              {fmtCLP(inventario.gananciaPotencial)}.
            </p>
          )}
        </div>

        <div className="chart-wrap">
          <h4>Productos más vendidos</h4>
          <div className="chart-canvas-box">
            {top.length === 0 ? <p className="empty">Sin ventas en este período.</p> : <canvas ref={topBarRef}></canvas>}
          </div>
        </div>

        <div className="card">
          <h4 style={{ margin: "0 0 8px", fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
            <IconAlert /> Alertas de stock bajo
          </h4>
          {bajo.length === 0 && <p className="empty">Todo tu inventario está en buen nivel.</p>}
          {bajo.map((p) => (
            <div className="alert-row" key={p.productoId}>
              <span className="dot"></span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>{p.nombre}</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-soft)" }}>
                  Quedan {p.stock} unidades (mínimo {p.stockMinimo})
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <h2 className="screen-title">Panel de ventas</h2>
      <p className="screen-sub">Así se ha movido tu negocio.</p>

      <div className="tabs-toggle">
        {[7, 14, 30].map((n) => (
          <button key={n} className={rango === n ? "active" : ""} onClick={() => setRango(n)}>
            Últimos {n} días
          </button>
        ))}
      </div>

      {cuerpo}
    </div>
  );
}
