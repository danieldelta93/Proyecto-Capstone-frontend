import { useEffect, useMemo, useState } from "react";
import { fmtCLP, daysAgoISO } from "../../utils/format.js";
import { finanzasDeVentas } from "../../utils/finanzas.js";
import { IconPlus, IconChevron } from "../Icons/Icons.jsx";
import NuevaVentaModal from "./NuevaVentaModal.jsx";
import "./Ventas.css";

const DIAS_POR_PAGINA = 7;
const DIAS_ABIERTOS_POR_DEFECTO = 3;

const PERIODOS = [
  { id: "hoy", label: "Hoy" },
  { id: "7", label: "7 días" },
  { id: "30", label: "30 días" },
  { id: "todo", label: "Todo" },
];

function etiquetaDia(fecha) {
  const base = new Date(fecha + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const texto = base.charAt(0).toUpperCase() + base.slice(1);
  if (fecha === daysAgoISO(0)) return `Hoy · ${texto}`;
  if (fecha === daysAgoISO(1)) return `Ayer · ${texto}`;
  return texto;
}

export default function Ventas({ productos, ventas, onRegistrarVenta, onAnularVenta }) {
  const [showNew, setShowNew] = useState(false);
  const [periodo, setPeriodo] = useState("7");
  const [metodo, setMetodo] = useState("Todos");
  const [diasVisibles, setDiasVisibles] = useState(DIAS_POR_PAGINA);
  const [abiertos, setAbiertos] = useState({}); // fecha -> true/false (si el usuario la tocó)

  // el formulario se cierra solo si el servidor aceptó la venta (por ejemplo, si no hay stock, sigue abierto)
  const registrarVenta = async (items, metodoPago) => {
    const ok = await onRegistrarVenta(items, metodoPago);
    if (ok) setShowNew(false);
  };

  const anular = (v) => {
    if (confirm("¿Anular esta venta? Los productos vuelven al stock y la venta deja de sumar en tus totales.")) {
      onAnularVenta(v.id);
    }
  };

  // ventas del período y método elegidos
  const filtradas = useMemo(() => {
    const desde =
      periodo === "hoy" ? daysAgoISO(0) : periodo === "7" ? daysAgoISO(6) : periodo === "30" ? daysAgoISO(29) : "";
    return ventas.filter(
      (v) => (!desde || v.fecha >= desde) && (metodo === "Todos" || v.metodo === metodo)
    );
  }, [ventas, periodo, metodo]);

  // agrupadas por día (más reciente primero)
  const dias = useMemo(() => {
    const porFecha = {};
    filtradas.forEach((v) => {
      (porFecha[v.fecha] = porFecha[v.fecha] || []).push(v);
    });
    return Object.keys(porFecha)
      .sort((a, b) => b.localeCompare(a))
      .map((fecha) => {
        const lista = porFecha[fecha].sort((a, b) => b.id - a.id);
        const contables = lista.filter((v) => v.estado !== "anulada"); // las anuladas se muestran, pero no suman
        return {
          fecha,
          ventas: lista,
          contables,
          total: contables.reduce((a, v) => a + v.total, 0),
          fin: finanzasDeVentas(contables, productos),
        };
      });
  }, [filtradas, productos]);

  useEffect(() => {
    setDiasVisibles(DIAS_POR_PAGINA);
  }, [periodo, metodo]);

  const contablesPeriodo = useMemo(() => filtradas.filter((v) => v.estado !== "anulada"), [filtradas]);
  const totalPeriodo = contablesPeriodo.reduce((a, v) => a + v.total, 0);
  const fin = useMemo(() => finanzasDeVentas(contablesPeriodo, productos), [contablesPeriodo, productos]);
  const hayGanancia = fin.ingresos > 0;
  const diasMostrados = dias.slice(0, diasVisibles);
  const diasRestantes = dias.length - diasMostrados.length;

  const estaAbierto = (fecha, idx) => (fecha in abiertos ? abiertos[fecha] : idx < DIAS_ABIERTOS_POR_DEFECTO);
  const alternar = (fecha, idx) => setAbiertos((a) => ({ ...a, [fecha]: !estaAbierto(fecha, idx) }));

  const nombreProducto = (id) => {
    const p = productos.find((p) => p.id === id);
    return p ? p.nombre : "Producto eliminado";
  };

  return (
    <div>
      <h2 className="screen-title">Ventas</h2>
      <p className="screen-sub">Registra una venta y el stock se descuenta solo.</p>

      <button
        className="btn btn-accent btn-block"
        onClick={() => setShowNew(true)}
        style={{ marginBottom: 14 }}
      >
        <IconPlus size={17} /> Registrar nueva venta
      </button>

      <div className="tabs-toggle">
        {PERIODOS.map((p) => (
          <button key={p.id} className={periodo === p.id ? "active" : ""} onClick={() => setPeriodo(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="ventas-resumen">
        <div>
          <p className="label">Vendido</p>
          <p className="valor">{fmtCLP(totalPeriodo)}</p>
        </div>
        <div>
          <p className="label">Ganancia{fin.ventasSinCosto > 0 ? "*" : ""}</p>
          <p className={"valor" + (hayGanancia && fin.ganancia < 0 ? " neg" : " ganancia")}>
            {hayGanancia ? fmtCLP(fin.ganancia) : "—"}
          </p>
        </div>
        <div>
          <p className="label">Ventas</p>
          <p className="valor">{contablesPeriodo.length}</p>
        </div>
      </div>
      {fin.ventasSinCosto > 0 && (
        <p className="ventas-nota">
          *No incluye {fin.ventasSinCosto} venta{fin.ventasSinCosto === 1 ? "" : "s"} con productos sin precio de compra.
        </p>
      )}

      <div className="ventas-filtro">
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)} aria-label="Filtrar por método de pago">
          <option value="Todos">Todos los métodos de pago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
      </div>

      {ventas.length === 0 && (
        <div className="card">
          <p className="empty">🧾 Todavía no registras ventas.</p>
        </div>
      )}
      {ventas.length > 0 && dias.length === 0 && (
        <div className="card">
          <p className="empty">🔍 No hay ventas con esos filtros.</p>
        </div>
      )}

      {diasMostrados.map((dia, idx) => {
        const abierto = estaAbierto(dia.fecha, idx);
        return (
          <div className="dia-grupo" key={dia.fecha}>
            <button
              className="dia-cabecera"
              onClick={() => alternar(dia.fecha, idx)}
              aria-expanded={abierto}
            >
              <span className={"dia-chevron" + (abierto ? " abierto" : "")}>
                <IconChevron />
              </span>
              <span className="dia-titulo">{etiquetaDia(dia.fecha)}</span>
              <span className="dia-resumen">
                <b>{fmtCLP(dia.total)}</b>
                <small>
                  {dia.contables.length} venta{dia.contables.length === 1 ? "" : "s"}
                  {dia.fin.ingresos > 0 && ` · gana ${fmtCLP(dia.fin.ganancia)}`}
                </small>
              </span>
            </button>

            {abierto && (
              <div className="dia-ventas">
                {dia.ventas.map((v) => (
                  <div className={"venta-row" + (v.estado === "anulada" ? " anulada" : "")} key={v.id}>
                    <div className="venta-items">
                      {v.items.map((it, i) => (
                        <p key={i}>
                          {it.cantidad}× {it.nombre ?? nombreProducto(it.productoId)}
                        </p>
                      ))}
                      {v.estado !== "anulada" && (
                        <button className="venta-anular" onClick={() => anular(v)}>
                          Anular venta
                        </button>
                      )}
                    </div>
                    <div className="prod-right">
                      <p className="prod-price">{fmtCLP(v.total)}</p>
                      <span className="payment-tag">{v.estado === "anulada" ? "Anulada" : v.metodo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {diasRestantes > 0 && (
        <button
          className="btn btn-ghost btn-block"
          style={{ marginTop: 4 }}
          onClick={() => setDiasVisibles((n) => n + DIAS_POR_PAGINA)}
        >
          Ver días anteriores ({diasRestantes} más)
        </button>
      )}

      {showNew && (
        <NuevaVentaModal
          productos={productos}
          onClose={() => setShowNew(false)}
          onConfirm={registrarVenta}
        />
      )}
    </div>
  );
}
