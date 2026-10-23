import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header/Header.jsx";
import TabBar from "./components/TabBar/TabBar.jsx";
import Toast from "./components/Toast/Toast.jsx";
import Inventario from "./components/Inventario/Inventario.jsx";
import Ventas from "./components/Ventas/Ventas.jsx";
import Panel from "./components/Panel/Panel.jsx";
import Asistente from "./components/Asistente/Asistente.jsx";
import Reportes from "./components/Reportes/Reportes.jsx";
import { api } from "./api/api.js";
import { useToast } from "./hooks/useToast.js";
import { daysAgoISO, fmtCLP } from "./utils/format.js";
import "./MainApp.css";

export default function MainApp({ user, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [estado, setEstado] = useState("cargando"); // "cargando" | "listo" | "error"
  const [errorCarga, setErrorCarga] = useState("");
  const [tab, setTab] = useState("inventario");
  const { toast, showToast } = useToast();

  const cargarProductos = useCallback(async () => setProductos(await api.productos()), []);
  const cargarVentas = useCallback(async () => setVentas(await api.ventas()), []);

  const cargarTodo = useCallback(async () => {
    setEstado("cargando");
    try {
      await Promise.all([cargarProductos(), cargarVentas()]);
      setEstado("listo");
    } catch (e) {
      setErrorCarga(e.message);
      setEstado("error");
    }
  }, [cargarProductos, cargarVentas]);

  useEffect(() => {
    cargarTodo();
    showToast(`¡Hola de nuevo, ${user.nombreDueño}! 👋`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ejecuta una acción contra la API; si falla, muestra el mensaje del servidor
  // (por ejemplo "Stock insuficiente de Gorro: quedan 2 y se necesitan 5").
  const intentar = async (accion, alFallar) => {
    try {
      return await accion();
    } catch (e) {
      showToast(`⚠️ ${e.message}`, 4200);
      alFallar?.(e);
      return undefined;
    }
  };

  const hoyISO = daysAgoISO(0);
  const activas = useMemo(() => ventas.filter((v) => v.estado !== "anulada"), [ventas]);
  const ventasHoy = useMemo(
    () => activas.filter((v) => v.fecha === hoyISO).reduce((a, v) => a + v.total, 0),
    [activas, hoyISO]
  );
  const stockBajo = useMemo(() => productos.filter((p) => p.stock <= p.stockMin), [productos]);

  const guardarProducto = (data) =>
    intentar(async () => {
      if (data.id) {
        await api.actualizarProducto(data.id, data);
        showToast(`"${data.nombre}" actualizado ✏️`);
      } else {
        await api.crearProducto(data);
        showToast(`"${data.nombre}" agregado a tu inventario ✅`);
      }
      await cargarProductos();
      return true;
    });

  const eliminarProducto = (id) =>
    intentar(async () => {
      await api.eliminarProducto(id);
      await cargarProductos();
      showToast("Producto eliminado 🗑️");
    });

  // Si no alcanzó el stock (por ejemplo, otra persona vendió antes), se actualiza la pantalla con el stock real.
  const refrescarSiSinStock = (e) => {
    if (e.codigo === "STOCK_INSUFICIENTE") Promise.all([cargarProductos(), cargarVentas()]).catch(() => {});
  };

  const registrarVenta = (items, metodo) =>
    intentar(async () => {
      const venta = await api.crearVenta({ items, metodo });
      await Promise.all([cargarProductos(), cargarVentas()]); // el stock cambió
      showToast(
        `¡Venta registrada! 🎉 Sumaste ${fmtCLP(venta.total)}` +
          (venta.ganancia !== null ? ` (ganancia ${fmtCLP(venta.ganancia)})` : "")
      );
      return true;
    }, refrescarSiSinStock);

  const anularVenta = (id) =>
    intentar(async () => {
      await api.anularVenta(id);
      await Promise.all([cargarProductos(), cargarVentas()]); // el stock volvió al inventario
      showToast("Venta anulada, el stock volvió al inventario ↩️");
    });

  let contenido;
  if (estado === "cargando") {
    contenido = <p className="empty">⏳ Cargando tu negocio…</p>;
  } else if (estado === "error") {
    contenido = (
      <div className="card" style={{ textAlign: "center" }}>
        <p className="empty">😕 {errorCarga}</p>
        <button className="btn btn-primary" onClick={cargarTodo}>
          Reintentar
        </button>
      </div>
    );
  } else {
    const screens = {
      inventario: (
        <Inventario productos={productos} onSave={guardarProducto} onDelete={eliminarProducto} />
      ),
      ventas: (
        <Ventas productos={productos} ventas={ventas} onRegistrarVenta={registrarVenta} onAnularVenta={anularVenta} />
      ),
      panel: <Panel productos={productos} ventas={ventas} />,
      asistente: <Asistente />,
      reportes: <Reportes productos={productos} ventas={ventas} />,
    };
    contenido = screens[tab];
  }

  return (
    <div className="shell">
      <Header user={user} onLogout={onLogout} ventasHoy={ventasHoy} stockBajoCount={stockBajo.length} />
      <main>{contenido}</main>
      <TabBar tab={tab} setTab={setTab} />
      <Toast toast={toast} />
    </div>
  );
}
