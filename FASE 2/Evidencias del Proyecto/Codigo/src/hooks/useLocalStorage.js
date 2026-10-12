import { useEffect, useState } from "react";

// Guarda un valor en localStorage y lo restaura al cargar la app.
// Si localStorage no está disponible (modo privado, cuotas, etc.)
// la app sigue funcionando en memoria durante la sesión.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (e) {
      console.warn(`No se pudo leer "${key}" de localStorage`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`No se pudo guardar "${key}" en localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}
