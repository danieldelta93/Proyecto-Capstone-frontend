import { fmtCLP, daysAgoISO, DIAS } from "../../utils/format.js";

export function responderAsistente(pregunta, productos, ventas) {
  const q = pregunta.toLowerCase();
  const ventasUlt7 = ventas.filter((v) => v.fecha >= daysAgoISO(6));

  const cantidadPorProducto = {};
  ventas.forEach((v) =>
    v.items.forEach((it) => {
      cantidadPorProducto[it.productoId] = (cantidadPorProducto[it.productoId] || 0) + it.cantidad;
    })
  );

  if (q.includes("comprar") || q.includes("reponer") || q.includes("restock")) {
    const candidatos = productos
      .map((p) => ({ p, vel: cantidadPorProducto[p.id] || 0 }))
      .filter((x) => x.p.stock <= x.p.stockMin * 1.6)
      .sort((a, b) => b.vel / (b.p.stock + 1) - a.vel / (a.p.stock + 1));
    if (candidatos.length === 0)
      return "Tu stock está bien por ahora, no veo productos urgentes por reponer.";
    const top = candidatos[0].p;
    return `Te recomiendo reponer "${top.nombre}": quedan ${top.stock} unidades (tu mínimo es ${top.stockMin}) y se ha estado vendiendo.`;
  }

  if (q.includes("mejor día") || q.includes("mejor dia")) {
    const porDiaSemana = [0, 0, 0, 0, 0, 0, 0];
    ventas.forEach((v) => {
      porDiaSemana[new Date(v.fecha + "T12:00:00").getDay()] += v.total;
    });
    const maxIdx = porDiaSemana.indexOf(Math.max(...porDiaSemana));
    return `Tu mejor día históricamente es ${DIAS[maxIdx]}, con ${fmtCLP(porDiaSemana[maxIdx])} vendidos en total.`;
  }

  if (q.includes("stock bajo") || q.includes("agotando") || q.includes("agotar")) {
    const bajos = productos.filter((p) => p.stock <= p.stockMin);
    if (bajos.length === 0) return "Ningún producto está bajo el mínimo de stock ahora mismo.";
    return (
      "Estos productos están con stock bajo: " +
      bajos.map((p) => `${p.nombre} (${p.stock} un.)`).join(", ") +
      "."
    );
  }

  if (q.includes("cuánto vendí") || q.includes("cuanto vendi") || q.includes("semana") || q.includes("esta semana")) {
    const total = ventasUlt7.reduce((a, v) => a + v.total, 0);
    return `En los últimos 7 días vendiste ${fmtCLP(total)} en ${ventasUlt7.length} venta${ventasUlt7.length === 1 ? "" : "s"}.`;
  }

  if (q.includes("más vendido") || q.includes("mas vendido") || q.includes("mejor producto")) {
    const ids = Object.entries(cantidadPorProducto).sort((a, b) => b[1] - a[1]);
    if (ids.length === 0) return "Todavía no hay suficientes ventas registradas para saberlo.";
    const p = productos.find((p) => p.id === Number(ids[0][0]));
    return `Tu producto más vendido es "${p ? p.nombre : "desconocido"}", con ${ids[0][1]} unidades vendidas en total.`;
  }

  if (q.includes("total") && (q.includes("inventario") || q.includes("vale"))) {
    const valor = productos.reduce((a, p) => a + p.precio * p.stock, 0);
    return `El valor total de tu inventario actual es aproximadamente ${fmtCLP(valor)}.`;
  }

  return "Puedo ayudarte con tu inventario y ventas. Prueba preguntando qué producto debes comprar, cuál es tu mejor día de ventas, o qué productos tienen stock bajo.";
}
