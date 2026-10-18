import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header/Header.jsx";
import TabBar from "./components/TabBar/TabBar.jsx";
import Toast from "./components/Toast/Toast.jsx";
import Inventario from "./components/Inventario/Inventario.jsx";
import Ventas from "./components/Ventas/Ventas.jsx";
import Panel from "./components/Panel/Panel.jsx";
import Asistente from "./components/Asistente/Asistente.jsx";
import Reportes from "./components/Reportes/Reportes.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useToast } from "./hooks/useToast.js";
import { dataKeyFor } from "./hooks/useAuth.js";
import { daysAgoISO, fmtCLP } from "./utils/format.js";
import "./MainApp.css";

export default function MainApp({ user, onLogout }) {
  const [productos, setProductos] = useLocalStorage(dataKeyFor(user.correo, "productos"), []);
  const [ventas, setVentas] = useLocalStorage(dataKeyFor(user.correo, "ventas"), []);
  const [tab, setTab] = useState("inventario");
  const { toast, showToast } = useToast();

  useEffect(() => {
    showToast(`¡Hola de nuevo, ${user.nombreDueño}! 👋`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hoyISO = daysAgoISO(0);
  const ventasHoy = useMemo(
    () => ventas.filter((v) => v.fecha === hoyISO).reduce((a, v) => a + v.total, 0),
    [ventas, hoyISO]
  );
  const stockBajo = useMemo(() => productos.filter((p) => p.stock <= p.stockMin), [productos]);

  const registrarVentaConAviso = (items, metodo) => {
    const total = items.reduce((a, it) => a + it.cantidad * it.precioUnit, 0);
    const nueva = { id: Date.now(), fecha: daysAgoISO(0), items, total, metodo };
    setVentas((list) => [nueva, ...list]);
    setProductos((list) =>
      list.map((p) => {
        const item = items.find((it) => it.productoId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p;
      })
    );
    const todoConCosto = items.every((it) => typeof it.costoUnit === "number");
    const ganancia = items.reduce((a, it) => a + it.cantidad * (it.precioUnit - (it.costoUnit ?? it.precioUnit)), 0);
    showToast(
      `¡Venta registrada! 🎉 Sumaste ${fmtCLP(total)}` + (todoConCosto ? ` (ganancia ${fmtCLP(ganancia)})` : "")
    );
  };

  const agregarProductoConAviso = (data) => {
    if (data.id) {
      setProductos((list) => list.map((p) => (p.id === data.id ? data : p)));
      showToast(`"${data.nombre}" actualizado ✏️`);
    } else {
      const nextId = Math.max(0, ...productos.map((p) => p.id)) + 1;
      setProductos((list) => [...list, { ...data, id: nextId }]);
      showToast(`"${data.nombre}" agregado a tu inventario ✅`);
    }
  };

  const borrarDatos = () => {
    if (confirm("¿Borrar todos tus productos y ventas? Esta acción no se puede deshacer.")) {
      setProductos([]);
      setVentas([]);
      showToast("Listo, tus datos fueron borrados 🧹");
    }
  };

  const screens = {
    inventario: <Inventario productos={productos} setProductos={setProductos} onSave={agregarProductoConAviso} />,
    ventas: <Ventas productos={productos} ventas={ventas} onRegistrarVenta={registrarVentaConAviso} />,
    panel: <Panel productos={productos} ventas={ventas} />,
    asistente: <Asistente productos={productos} ventas={ventas} />,
    reportes: <Reportes productos={productos} ventas={ventas} onReset={borrarDatos} />,
  };

  return (
    <div className="shell">
      <Header
        user={user}
        onLogout={onLogout}
        ventasHoy={ventasHoy}
        stockBajoCount={stockBajo.length}
      />
      <main>{screens[tab]}</main>
      <TabBar tab={tab} setTab={setTab} />
      <Toast toast={toast} />
    </div>
  );
}
