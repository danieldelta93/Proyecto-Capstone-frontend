import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { api } from "../../api/api.js";
import { fmtCLP, daysAgoISO } from "../../utils/format.js";
import { IconAlert } from "../Icons/Icons.jsx";
import "./Panel.css";

const etiquetaFecha = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });

const fechaLegible = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
};

export default function Panel({ productos, ventas }) {
  const [rango, setRango] = useState(7);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const topBarRef = useRef(null);
  const diasBarRef = useRef(null);
  const finBarRef = useRef(null);
  const graficos = useRef([]);

  const ventasActivas = useMemo(
    () => ventas.filter((venta) => venta.estado !== "anulada"),
    [ventas]
  );

  const resumenHoy = useMemo(() => {
    const hoy = daysAgoISO(0);
    const delDia = ventasActivas.filter((venta) => venta.fecha === hoy);
    const ingresos = delDia.reduce((total, venta) => total + Number(venta.total || 0), 0);
    const ventasConGanancia = delDia.filter((venta) => venta.ganancia !== null && venta.ganancia !== undefined);
    const ganancia = ventasConGanancia.reduce((total, venta) => total + Number(venta.ganancia || 0), 0);
    return {
      cantidad: delDia.length,
      ingresos,
      ganancia,
      tieneGanancia: ventasConGanancia.length > 0,
    };
  }, [ventasActivas]);

  const ventasRecientes = useMemo(
    () => [...ventasActivas].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || Number(b.id) - Number(a.id)).slice(0, 5),
    [ventasActivas]
  );

  const productosBajoStock = useMemo(
    () => productos.filter((producto) => Number(producto.stock) <= Number(producto.stockMin)),
    [productos]
  );

  useEffect(() => {
    let vigente = true;
    setError("");

    Promise.all([
      api.resumen(rango),
      api.ventasPorDia(rango),
      api.masVendidos(rango, 5),
      api.stockBajo(),
      api.valorInventario(),
    ])
      .then(([resumen, porDia, top, bajo, inventario]) => {
        if (vigente) setDatos({ resumen, porDia, top, bajo, inventario });
      })
      .catch((e) => vigente && setError(e.message));

    return () => {
      vigente = false;
    };
  }, [rango, productos, ventas]);

  useEffect(() => {
    graficos.current.forEach((grafico) => grafico.destroy());
    graficos.current = [];
    if (!datos) return;

    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink").trim();
    const primary = styles.getPropertyValue("--primary").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    const line = styles.getPropertyValue("--line").trim();
    const inkSoft = styles.getPropertyValue("--ink-soft").trim();
    const labels = datos.porDia.map((d) => etiquetaFecha(d.fecha));
    const ejeX = {
      grid: { display: false },
      ticks: { color: ink, font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 },
    };
    const ejeY = {
      grid: { color: line },
      ticks: { color: ink, font: { size: 10 } },
    };
    const pesos = (n) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("es-CL");

    if (diasBarRef.current) {
      graficos.current.push(new Chart(diasBarRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Ventas",
            data: datos.porDia.map((d) => d.total),
            backgroundColor: accent,
            borderRadius: 7,
            maxBarThickness: 30,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: ejeX, y: ejeY },
        },
      }));
    }

    if (finBarRef.current) {
      graficos.current.push(new Chart(finBarRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Invertido", data: datos.porDia.map((d) => d.invertido), backgroundColor: inkSoft, borderRadius: 4, maxBarThickness: 30 },
            { label: "Ganancia", data: datos.porDia.map((d) => d.ganancia), backgroundColor: primary, borderRadius: 4, maxBarThickness: 30 },
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
      }));
    }

    if (topBarRef.current && datos.top.length > 0) {
      graficos.current.push(new Chart(topBarRef.current, {
        type: "bar",
        data: {
          labels: datos.top.map((t) => t.nombre),
          datasets: [{
            label: "Unidades",
            data: datos.top.map((t) => t.cantidad),
            backgroundColor: primary,
            borderRadius: 7,
            maxBarThickness: 24,
          }],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: line }, ticks: { color: ink, font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { color: ink, font: { size: 11 } } },
          },
        },
      }));
    }

    return () => {
      graficos.current.forEach((grafico) => grafico.destroy());
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
    const hayFin = r.margenPct !== null;
    const variacion = r.variacionIngresosPct;

    cuerpo = (
      <>
        <section className="panel-seccion">
          <div className="panel-seccion-titulo">
            <div>
              <p className="panel-eyebrow">RESUMEN DEL PERÍODO</p>
              <h3>Así va tu negocio</h3>
            </div>
            <div className="panel-rangos" aria-label="Período de análisis">
              {[7, 14, 30].map((n) => (
                <button key={n} className={rango === n ? "active" : ""} onClick={() => setRango(n)}>
                  {n} días
                </button>
              ))}
            </div>
          </div>

          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-icon">↗</span>
              <p className="label">Ventas del período</p>
              <p className="num">{fmtCLP(r.ingresos)}</p>
              {variacion !== null && (
                <p className={`variacion ${variacion >= 0 ? "sube" : "baja"}`}>
                  {variacion >= 0 ? "▲" : "▼"} {Math.abs(variacion)}% vs período anterior
                </p>
              )}
            </article>
            <article className="stat-card">
              <span className="stat-icon">◷</span>
              <p className="label">Ticket promedio</p>
              <p className="num">{fmtCLP(r.ticketPromedio)}</p>
              <p className="stat-ayuda">Por venta registrada</p>
            </article>
            <article className="stat-card">
              <span className="stat-icon">★</span>
              <p className="label">Producto estrella</p>
              <p className="num small">{top[0]?.nombre ?? "—"}</p>
              <p className="stat-ayuda">Más vendido en el período</p>
            </article>
            <article className="stat-card">
              <span className="stat-icon">▤</span>
              <p className="label">Ventas registradas</p>
              <p className="num">{r.ventas}</p>
              <p className="stat-ayuda">Operaciones completadas</p>
            </article>
          </div>
        </section>

        <section className="panel-seccion panel-hoy">
          <div className="panel-seccion-titulo">
            <div>
              <p className="panel-eyebrow">MOVIMIENTO DEL DÍA</p>
              <h3>Hoy en tu negocio</h3>
            </div>
            <span className="panel-hoy-fecha">{new Date().toLocaleDateString("es-CL", { day: "numeric", month: "short" })}</span>
          </div>
          <div className="panel-hoy-grid">
            <div className="panel-hoy-item">
              <span>Ingresos de hoy</span>
              <strong>{fmtCLP(resumenHoy.ingresos)}</strong>
            </div>
            <div className="panel-hoy-item">
              <span>Ventas de hoy</span>
              <strong>{resumenHoy.cantidad}</strong>
            </div>
            <div className="panel-hoy-item">
              <span>Ganancia estimada</span>
              <strong>{resumenHoy.tieneGanancia ? fmtCLP(resumenHoy.ganancia) : "—"}</strong>
            </div>
          </div>
          {!resumenHoy.tieneGanancia && resumenHoy.cantidad > 0 && (
            <p className="panel-nota">No hay costos registrados para calcular la ganancia de todas las ventas de hoy.</p>
          )}
        </section>

        <section className="chart-wrap">
          <div className="panel-chart-heading">
            <div><p className="panel-eyebrow">TENDENCIA</p><h4>Ventas por día</h4></div>
            <span className="panel-chart-caption">Ingresos en el período</span>
          </div>
          <div className="chart-canvas-box"><canvas ref={diasBarRef}></canvas></div>
        </section>

        <section className="chart-wrap">
          <div className="panel-chart-heading">
            <div><p className="panel-eyebrow">RENTABILIDAD</p><h4>Inversión y ganancia</h4></div>
          </div>
          {hayFin ? (
            <>
              <div className="fin-kpis">
                <div className="fin-kpi"><p className="label"><i className="punto gris" /> Invertido</p><p className="valor">{fmtCLP(r.invertido)}</p></div>
                <div className="fin-kpi"><p className="label"><i className="punto verde" /> Ganancia</p><p className={`valor ${r.ganancia < 0 ? "neg" : "verde"}`}>{fmtCLP(r.ganancia)}</p></div>
                <div className="fin-kpi"><p className="label">Margen</p><p className="valor">{Math.round(r.margenPct)}%</p></div>
              </div>
              <div className="chart-canvas-box alto"><canvas ref={finBarRef}></canvas></div>
              <p className="fin-nota">
                La inversión corresponde al costo de los productos vendidos. {r.ventasSinCosto > 0 && `No se incluyen ${r.ventasSinCosto} venta${r.ventasSinCosto === 1 ? "" : "s"} sin precio de compra registrado.`}
              </p>
            </>
          ) : (
            <p className="empty">💰 Agrega el precio de compra a tus productos y registra ventas para conocer tu rentabilidad.</p>
          )}
          {inventario.productosConCosto > 0 && inventario.costo > 0 && (
            <p className="fin-nota">Tienes {fmtCLP(inventario.costo)} en mercadería. Si vendes todo el inventario, la ganancia potencial sería {fmtCLP(inventario.gananciaPotencial)}.</p>
          )}
        </section>

        <section className="chart-wrap">
          <div className="panel-chart-heading">
            <div><p className="panel-eyebrow">DESEMPEÑO</p><h4>Productos más vendidos</h4></div>
            <span className="panel-chart-caption">Unidades</span>
          </div>
          <div className="chart-canvas-box">
            {top.length === 0 ? <p className="empty">Sin ventas en este período.</p> : <canvas ref={topBarRef}></canvas>}
          </div>
        </section>

        <section className="chart-wrap panel-actividad">
          <div className="panel-chart-heading">
            <div><p className="panel-eyebrow">ÚLTIMOS MOVIMIENTOS</p><h4>Ventas recientes</h4></div>
          </div>
          {ventasRecientes.length === 0 ? (
            <p className="empty">Todavía no hay ventas registradas.</p>
          ) : (
            ventasRecientes.map((venta) => (
              <div className="panel-venta-row" key={venta.id}>
                <div className="panel-venta-icon">↗</div>
                <div className="panel-venta-info">
                  <strong>Venta #{venta.id}</strong>
                  <span>{fechaLegible(venta.fecha)} · {(venta.items || []).length} producto(s)</span>
                </div>
                <strong className="panel-venta-total">{fmtCLP(venta.total)}</strong>
              </div>
            ))
          )}
        </section>

        <section className="chart-wrap panel-stock">
          <div className="panel-chart-heading">
            <div><p className="panel-eyebrow">CONTROL DE INVENTARIO</p><h4><IconAlert /> Alertas de stock bajo</h4></div>
            <span className={`panel-stock-count ${bajo.length ? "hay-alertas" : ""}`}>{bajo.length}</span>
          </div>
          {bajo.length === 0 ? (
            <p className="empty">✓ Todo tu inventario está en buen nivel.</p>
          ) : (
            bajo.map((producto) => (
              <div className="alert-row" key={producto.productoId}>
                <span className="dot"></span>
                <div className="panel-stock-info">
                  <strong>{producto.nombre}</strong>
                  <span>Quedan {producto.stock} unidades · mínimo {producto.stockMinimo}</span>
                </div>
              </div>
            ))
          )}
        </section>
      </>
    );
  }

  return (
    <div className="panel-page">
      <header className="panel-hero">
        <div className="panel-hero-top">
          <span className="panel-hero-kicker">VENDIX · TU NEGOCIO</span>
          <span className="panel-live"><i /> Datos actualizados</span>
        </div>
        <h2>Resumen del negocio</h2>
        <p>Una mirada clara a tus ventas, ganancias e inventario.</p>
      </header>
      {cuerpo}
    </div>
  );
}
