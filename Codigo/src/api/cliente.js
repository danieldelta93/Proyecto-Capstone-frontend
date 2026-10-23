// Cliente HTTP de Vendix: manda las peticiones a la API (backend) con el token de sesión
// y traduce los errores a mensajes claros para mostrar en pantalla.
//
// Dirección de la API:
//  - En desarrollo no hace falta configurar nada: Vite reenvía /api a http://localhost:3000
//    (ver vite.config.js).
//  - En producción define VITE_API_URL (ver .env.example), por ejemplo https://mi-api.onrender.com/api
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const CLAVE_TOKEN = "vendix_token";

export class ErrorApi extends Error {
  constructor(status, codigo, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}

export const obtenerToken = () => {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
};
export const guardarToken = (token) => {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
  } catch {
    /* sin almacenamiento: la sesión dura solo hasta cerrar la pestaña */
  }
};
export const borrarToken = () => {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    /* nada que borrar */
  }
};

// La app se suscribe aquí para volver al login cuando el servidor dice que la sesión expiró
let alExpirar = null;
export const cuandoExpireLaSesion = (fn) => {
  alExpirar = fn;
};

export async function peticion(metodo, ruta, cuerpo) {
  const token = obtenerToken();
  let respuesta;
  try {
    respuesta = await fetch(BASE + ruta, {
      method: metodo,
      headers: {
        ...(cuerpo !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi(0, "SIN_CONEXION", "No se pudo conectar con el servidor. Revisa tu conexión o que el backend esté encendido.");
  }

  if (respuesta.status === 204) return null;
  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    /* respuesta sin JSON */
  }

  if (!respuesta.ok) {
    const e = datos?.error;
    // 401 con sesión iniciada = el token venció o es inválido
    if (respuesta.status === 401 && token && alExpirar) alExpirar();
    throw new ErrorApi(respuesta.status, e?.codigo ?? "ERROR", e?.mensaje ?? "Ocurrió un error inesperado", e?.detalles);
  }
  return datos;
}
