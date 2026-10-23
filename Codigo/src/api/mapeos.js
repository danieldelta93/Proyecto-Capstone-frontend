// La API y la interfaz usan nombres distintos para algunos campos. Estas funciones
// traducen en un solo lugar, así el resto de la app no cambia.
//
//   API: precioVenta, precioCompra, stockMinimo   ·   interfaz: precio, costo, stockMin

export const productoDesdeApi = (p) => ({
  id: p.id,
  nombre: p.nombre,
  descripcion: p.descripcion ?? "",
  categoria: p.categoria ?? "",
  precio: p.precioVenta,
  costo: p.precioCompra, // null en productos antiguos sin precio de compra
  stock: p.stock,
  stockMin: p.stockMinimo,
});

export const productoHaciaApi = (p) => ({
  nombre: p.nombre,
  descripcion: p.descripcion || undefined,
  categoria: p.categoria,
  precioCompra: p.costo,
  precioVenta: p.precio,
  stock: p.stock,
  stockMinimo: p.stockMin,
});

export const ventaDesdeApi = (v) => ({
  id: v.id,
  fecha: v.fecha,
  total: v.total,
  metodo: v.metodoPago,
  estado: v.estado,
  items: v.items.map((i) => ({
    productoId: i.productoId,
    nombre: i.nombre,
    cantidad: i.cantidad,
    precioUnit: i.precioUnitario,
    costoUnit: i.costoUnitario,
  })),
  invertido: v.invertido,
  ganancia: v.ganancia,
});

export const usuarioDesdeApi = (u) => ({
  id: u.id,
  correo: u.correo,
  nombreNegocio: u.nombreNegocio,
  nombreDueño: u.nombreDueno,
});
