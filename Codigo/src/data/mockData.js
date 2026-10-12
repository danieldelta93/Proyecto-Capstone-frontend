import { daysAgoISO } from "../utils/format.js";

export const initialProducts = [
  { id: 1, nombre: "Jockey de lana", categoria: "Gorros", precio: 6000, stock: 14, stockMin: 5 },
  { id: 2, nombre: "Polerón unisex", categoria: "Ropa", precio: 15000, stock: 8, stockMin: 4 },
  { id: 3, nombre: "Calcetines pack x3", categoria: "Accesorios", precio: 3500, stock: 22, stockMin: 10 },
  { id: 4, nombre: "Bufanda tejida", categoria: "Accesorios", precio: 8000, stock: 3, stockMin: 5 },
  { id: 5, nombre: "Guantes térmicos", categoria: "Accesorios", precio: 5000, stock: 11, stockMin: 6 },
  { id: 6, nombre: "Gorro beanie", categoria: "Gorros", precio: 4500, stock: 2, stockMin: 5 },
  { id: 7, nombre: "Chalina de alpaca", categoria: "Accesorios", precio: 18000, stock: 6, stockMin: 3 },
  { id: 8, nombre: "Cinturón de cuero", categoria: "Accesorios", precio: 9000, stock: 9, stockMin: 4 },
];

export const initialSales = [
  { id: 101, fecha: daysAgoISO(13), items: [{ productoId: 1, cantidad: 2, precioUnit: 6000 }], total: 12000, metodo: "Efectivo" },
  { id: 102, fecha: daysAgoISO(12), items: [{ productoId: 3, cantidad: 4, precioUnit: 3500 }], total: 14000, metodo: "Efectivo" },
  { id: 103, fecha: daysAgoISO(12), items: [{ productoId: 2, cantidad: 1, precioUnit: 15000 }], total: 15000, metodo: "Transferencia" },
  { id: 104, fecha: daysAgoISO(11), items: [{ productoId: 5, cantidad: 2, precioUnit: 5000 }], total: 10000, metodo: "Efectivo" },
  { id: 105, fecha: daysAgoISO(10), items: [{ productoId: 1, cantidad: 1, precioUnit: 6000 }, { productoId: 3, cantidad: 2, precioUnit: 3500 }], total: 13000, metodo: "Efectivo" },
  { id: 106, fecha: daysAgoISO(9), items: [{ productoId: 7, cantidad: 1, precioUnit: 18000 }], total: 18000, metodo: "Transferencia" },
  { id: 107, fecha: daysAgoISO(8), items: [{ productoId: 3, cantidad: 3, precioUnit: 3500 }], total: 10500, metodo: "Efectivo" },
  { id: 108, fecha: daysAgoISO(8), items: [{ productoId: 8, cantidad: 1, precioUnit: 9000 }], total: 9000, metodo: "Efectivo" },
  { id: 109, fecha: daysAgoISO(7), items: [{ productoId: 1, cantidad: 3, precioUnit: 6000 }], total: 18000, metodo: "Efectivo" },
  { id: 110, fecha: daysAgoISO(6), items: [{ productoId: 2, cantidad: 1, precioUnit: 15000 }], total: 15000, metodo: "Tarjeta" },
  { id: 111, fecha: daysAgoISO(6), items: [{ productoId: 3, cantidad: 5, precioUnit: 3500 }], total: 17500, metodo: "Efectivo" },
  { id: 112, fecha: daysAgoISO(5), items: [{ productoId: 5, cantidad: 1, precioUnit: 5000 }], total: 5000, metodo: "Efectivo" },
  { id: 113, fecha: daysAgoISO(4), items: [{ productoId: 1, cantidad: 2, precioUnit: 6000 }], total: 12000, metodo: "Transferencia" },
  { id: 114, fecha: daysAgoISO(3), items: [{ productoId: 3, cantidad: 2, precioUnit: 3500 }, { productoId: 8, cantidad: 1, precioUnit: 9000 }], total: 16000, metodo: "Efectivo" },
  { id: 115, fecha: daysAgoISO(2), items: [{ productoId: 7, cantidad: 1, precioUnit: 18000 }], total: 18000, metodo: "Efectivo" },
  { id: 116, fecha: daysAgoISO(1), items: [{ productoId: 1, cantidad: 4, precioUnit: 6000 }], total: 24000, metodo: "Efectivo" },
  { id: 117, fecha: daysAgoISO(0), items: [{ productoId: 3, cantidad: 3, precioUnit: 3500 }], total: 10500, metodo: "Transferencia" },
];
