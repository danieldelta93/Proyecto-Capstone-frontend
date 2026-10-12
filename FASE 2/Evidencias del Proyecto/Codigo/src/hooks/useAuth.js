import { useEffect, useState } from "react";

// Autenticación local para el prototipo: las cuentas y contraseñas
// se guardan en el localStorage del navegador, en texto plano.
// Esto alcanza para que cada persona vea SUS propios datos en este
// dispositivo y para hacer la demo del proyecto, pero no reemplaza
// un backend real: para producción, las contraseñas deben viajar y
// guardarse con hash (bcrypt, por ejemplo) en un servidor, no en el
// navegador.

const USERS_KEY = "vendix_users";
const SESSION_KEY = "vendix_session";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    // Ignora registros viejos/corruptos (por ejemplo, cuentas guardadas
    // por una versión anterior de Vendix que usaba "usuario" en vez de
    // "correo"). Sin este filtro, un registro así rompe el login de
    // cualquier cuenta, incluida la demo, con un error de "toLowerCase
    // of undefined".
    return users.filter((u) => u && typeof u.correo === "string" && u.correo);
  } catch (e) {
    console.warn("No se pudo leer usuarios de Vendix", e);
    return [];
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("No se pudo guardar usuarios de Vendix", e);
  }
}

// Clave de almacenamiento de los datos (productos/ventas) de un usuario,
// a partir de su correo.
export function dataKeyFor(correo, sufijo) {
  return `vendix_data_${correo}_${sufijo}`;
}

// Crea la cuenta demo la primera vez que se abre la app, para que
// siempre haya una forma de probar Vendix sin tener que registrarse.
export const DEMO_EMAIL = "demo@vendix.cl";
const DEMO_PASSWORD = "demo123";

function seedDemoUserIfNeeded() {
  const users = readUsers();
  if (users.some((u) => u.correo === DEMO_EMAIL)) return;
  writeUsers([
    ...users,
    {
      correo: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      nombreNegocio: "Puesto Doña Carmen",
      nombreDueño: "Carmen",
    },
  ]);
}

export function useAuth() {
  const [session, setSession] = useState(() => {
    try {
      return localStorage.getItem(SESSION_KEY) || null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    seedDemoUserIfNeeded();
  }, []);

  const user = session
    ? readUsers().find((u) => u.correo === session) || null
    : null;

  const login = ({ correo, password }) => {
    const users = readUsers();
    const limpio = correo.trim().toLowerCase();
    const found = users.find((u) => u.correo.toLowerCase() === limpio);
    if (!found || found.password !== password) {
      setError("Correo o contraseña incorrectos.");
      return false;
    }
    setError("");
    localStorage.setItem(SESSION_KEY, found.correo);
    setSession(found.correo);
    return true;
  };

  const register = ({ correo, password, nombreNegocio, nombreDueño }) => {
    const users = readUsers();
    const limpio = correo.trim().toLowerCase();
    if (!limpio || !password || !nombreNegocio.trim() || !nombreDueño.trim()) {
      setError("Completa todos los campos.");
      return false;
    }
    if (!EMAIL_RE.test(limpio)) {
      setError("Ingresa un correo válido.");
      return false;
    }
    if (users.some((u) => u.correo.toLowerCase() === limpio)) {
      setError("Ya existe una cuenta con ese correo.");
      return false;
    }
    writeUsers([
      ...users,
      {
        correo: limpio,
        password,
        nombreNegocio: nombreNegocio.trim(),
        nombreDueño: nombreDueño.trim(),
      },
    ]);
    setError("");
    localStorage.setItem(SESSION_KEY, limpio);
    setSession(limpio);
    return true;
  };

  const loginDemo = () => login({ correo: DEMO_EMAIL, password: DEMO_PASSWORD });

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return { user, login, register, loginDemo, logout, error, setError };
}
