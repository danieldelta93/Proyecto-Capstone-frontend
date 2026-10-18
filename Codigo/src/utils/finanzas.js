// Cálculos de inversión y ganancia.
//
// Cada producto tiene:
//   costo  = precio de compra (lo que te cuesta cada unidad)
//   precio = precio de venta  (lo que cobras)
// Ganancia por unidad = precio - costo.
//
// Al registrar una venta se guarda el costo de ese momento en cada ítem
// (costoUnit), para que la ganancia no cambie si después cambias el costo
// del producto. Las ventas antiguas, hechas antes de existir el precio de
// compra, usan el costo actual del producto. Si no hay ningún costo
// conocido, ese ítem se deja fuera de los cálculos (no se inventa un valor).

const esNumero = (x) => typeof x === "number" && !Number.isNaN(x);

export function gananciaUnitaria(producto) {
  return esNumero(producto.costo) ? producto.precio - producto.costo : null;
}

export function margenPct(precio, costo) {
  return precio > 0 ? ((precio - costo) / precio) * 100 : 0;
}

export function costoDeItem(item, productos) {
  if (esNumero(item.costoUnit)) return item.costoUnit;
  const p = productos.find((p) => p.id === item.productoId);
  return p && esNumero(p.costo) ? p.costo : null;
}

// Resumen de un conjunto de ventas:
//   ingresos  = lo que cobraste (solo de ítems con costo conocido)
//   invertido = lo que te costó la mercadería vendida
//   ganancia  = ingresos - invertido
//   ventasSinCosto = cuántas ventas tienen algún ítem sin costo conocido
export function finanzasDeVentas(ventas, productos) {
  let ingresos = 0;
  let invertido = 0;
  let ventasSinCosto = 0;
  ventas.forEach((v) => {
    let falta = false;
    v.items.forEach((it) => {
      const costo = costoDeItem(it, productos);
      if (costo === null) {
        falta = true;
        return;
      }
      ingresos += it.cantidad * it.precioUnit;
      invertido += it.cantidad * costo;
    });
    if (falta) ventasSinCosto += 1;
  });
  const ganancia = ingresos - invertido;
  return {
    ingresos,
    invertido,
    ganancia,
    margen: ingresos > 0 ? (ganancia / ingresos) * 100 : 0,
    ventasSinCosto,
  };
}

// Dinero que tienes hoy en mercadería (stock a precio de compra) y lo que
// ganarías si lo vendes todo.
export function valorInventario(productos) {
  let costo = 0;
  let gananciaPotencial = 0;
  let conCosto = 0;
  productos.forEach((p) => {
    if (!esNumero(p.costo)) return;
    conCosto += 1;
    costo += p.costo * p.stock;
    gananciaPotencial += (p.precio - p.costo) * p.stock;
  });
  return { costo, gananciaPotencial, conCosto };
}
