import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { fmtCLP, daysAgoISO } from "../../utils/format.js";
import { IconAlert } from "../Icons/Icons.jsx";
import "./Panel.css";

export default function Panel({ productos, ventas }) {
  const [rango, setRango] = useState(7);
  const topBarRef = useRef(null);
  const diasBarRef = useRef(null);
  const topBarChart = useRef(null);
  const diasBarChart = useRef(null);

  const dias = useMemo(() => {
    const arr = [];
    for (let i = rango - 1; i >= 0; i--) arr.push(daysAgoISO(i));
    return arr;
  }, [rango]);

  const ventasEnRango = useMemo(
    () => ventas.filter((v) => dias.includes(v.fecha)),
    [ventas, dias]
  );

  const porDia = dias.map((d) =>
    ventasEnRango.filter((v) => v.fecha === d).reduce((a, v) => a + v.total, 0)
  );
  const totalPeriodo = porDia.reduce((a, b) => a + b, 0);
  const ticketProm = ventasEnRango.length ? totalPeriodo / ventasEnRango.length : 0;

  const cantidadPorProducto = {};
  ventasEnRango.forEach((v) =>
    v.items.forEach((it) => {
      cantidadPorProducto[it.productoId] = (cantidadPorProducto[it.productoId] || 0) + it.cantidad;
    })
  );
  const topProductos = Object.entries(cantidadPorProducto)
    .map(([id, cant]) => ({ producto: productos.find((p) => p.id === Number(id)), cant }))
    .filter((x) => x.producto)
    .sort((a, b) => b.cant - a.cant)
    .slice(0, 5);

  const productoEstrella = topProductos[0]?.producto?.nombre || "—";
  const stockBajo = productos.filter((p) => p.stock <= p.stockMin);

  useEffect(() => {
    if (topBarChart.current) topBarChart.current.destroy();
    if (diasBarChart.current) diasBarChart.current.destroy();

    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink").trim();
    const primary = styles.getPropertyValue("--primary").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    const line = styles.getPropertyValue("--line").trim();

    // Ventas por día: barras verticales, una por día del período.
    if (diasBarRef.current) {
      diasBarChart.current = new Chart(diasBarRef.current, {
        type: "bar",
        data: {
          labels: dias.map((d) =>
            new Date(d + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "short" })
          ),
          datasets: [
            { data: porDia, backgroundColor: accent, borderRadius: 6, maxBarThickness: 28 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: ink, font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
            y: { grid: { color: line }, ticks: { color: ink, font: { size: 10 } } },
          },
        },
      });
    }

    // Productos más vendidos: barras horizontales (una por producto).
    if (topBarRef.current) {
      topBarChart.current = new Chart(topBarRef.current, {
        type: "bar",
        data: {
          labels: topProductos.map((t) => t.producto.nombre),
          datasets: [
            { data: topProductos.map((t) => t.cant), backgroundColor: primary, borderRadius: 6, maxBarThickness: 22 },
          ],
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
      });
    }

    return () => {
      if (topBarChart.current) topBarChart.current.destroy();
      if (diasBarChart.current) diasBarChart.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rango, JSON.stringify(porDia), JSON.stringify(topProductos.map((t) => t.cant))]);

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

      <div className="stat-grid">
        <div className="stat-card">
          <p className="label">Ventas del período</p>
          <p className="num">{fmtCLP(totalPeriodo)}</p>
        </div>
        <div className="stat-card">
          <p className="label">Ticket promedio</p>
          <p className="num">{fmtCLP(ticketProm)}</p>
        </div>
        <div className="stat-card">
          <p className="label">Producto estrella</p>
          <p className="num small">{productoEstrella}</p>
        </div>
        <div className="stat-card">
          <p className="label">Ventas registradas</p>
          <p className="num">{ventasEnRango.length}</p>
        </div>
      </div>

      <div className="chart-wrap">
        <h4>Ventas por día</h4>
        <div className="chart-canvas-box">
          <canvas ref={diasBarRef}></canvas>
        </div>
      </div>

      <div className="chart-wrap">
        <h4>Productos más vendidos</h4>
        <div className="chart-canvas-box">
          {topProductos.length === 0 ? (
            <p className="empty">Sin ventas en este período.</p>
          ) : (
            <canvas ref={topBarRef}></canvas>
          )}
        </div>
      </div>

      <div className="card">
        <h4 style={{ margin: "0 0 8px", fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
          <IconAlert /> Alertas de stock bajo
        </h4>
        {stockBajo.length === 0 && <p className="empty">Todo tu inventario está en buen nivel.</p>}
        {stockBajo.map((p) => (
          <div className="alert-row" key={p.id}>
            <span className="dot"></span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>{p.nombre}</p>
              <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-soft)" }}>
                Quedan {p.stock} unidades (mínimo {p.stockMin})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
