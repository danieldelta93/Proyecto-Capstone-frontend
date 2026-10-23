import { peticion, guardarToken } from "./cliente.js";
import { productoDesdeApi, productoHaciaApi, ventaDesdeApi, usuarioDesdeApi } from "./mapeos.js";

const consulta = (params = {}) => {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));
  const texto = q.toString();
  return texto ? `?${texto}` : "";
};

export const api = {
  // ---- cuenta
  async registro({ correo, password, nombreNegocio, nombreDueño }) {
    const r = await peticion("POST", "/auth/registro", { correo, password, nombreNegocio, nombreDueno: nombreDueño });
    guardarToken(r.token);
    return usuarioDesdeApi(r.usuario);
  },
  async login({ correo, password }) {
    const r = await peticion("POST", "/auth/login", { correo, password });
    guardarToken(r.token);
    return usuarioDesdeApi(r.usuario);
  },
  async yo() {
    return usuarioDesdeApi((await peticion("GET", "/auth/yo")).usuario);
  },

  // ---- productos
  async productos() {
    return (await peticion("GET", "/productos")).map(productoDesdeApi);
  },
  async crearProducto(p) {
    return productoDesdeApi(await peticion("POST", "/productos", productoHaciaApi(p)));
  },
  async actualizarProducto(id, p) {
    return productoDesdeApi(await peticion("PUT", `/productos/${id}`, productoHaciaApi(p)));
  },
  eliminarProducto: (id) => peticion("DELETE", `/productos/${id}`),

  // ---- ventas (el servidor pone precio y costo; aquí solo se manda qué y cuánto)
  async ventas() {
    return (await peticion("GET", `/ventas${consulta({ limite: 500 })}`)).map(ventaDesdeApi);
  },
  async crearVenta({ items, metodo }) {
    const cuerpo = { metodoPago: metodo, items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })) };
    return ventaDesdeApi(await peticion("POST", "/ventas", cuerpo));
  },
  async anularVenta(id) {
    return ventaDesdeApi(await peticion("POST", `/ventas/${id}/anular`));
  },

  // ---- panel (cálculos hechos en el servidor con SQL)
  resumen: (dias) => peticion("GET", `/estadisticas/resumen${consulta({ dias })}`),
  ventasPorDia: (dias) => peticion("GET", `/estadisticas/ventas-por-dia${consulta({ dias })}`),
  masVendidos: (dias, limite = 5) => peticion("GET", `/estadisticas/productos-mas-vendidos${consulta({ dias, limite })}`),
  stockBajo: () => peticion("GET", "/estadisticas/stock-bajo"),
  valorInventario: () => peticion("GET", "/estadisticas/valor-inventario"),

  // ---- asistente
  preguntar: (pregunta) => peticion("POST", "/asistente/preguntar", { pregunta }),
};
