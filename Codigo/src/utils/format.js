export const fmtCLP = (n) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("es-CL");

export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function stockEstado(p) {
  if (p.stock <= p.stockMin) return "crit";
  if (p.stock <= p.stockMin * 1.6) return "low";
  return "ok";
}
