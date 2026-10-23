import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { obtenerToken, borrarToken, cuandoExpireLaSesion } from "../api/cliente.js";

// La sesión ahora vive en el servidor: al iniciar sesión la API entrega un token (se guarda
// en este navegador) y con él la app pide los datos de la cuenta. Las contraseñas ya no se
// guardan en el navegador.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(() => Boolean(obtenerToken())); // revisando una sesión guardada
  const [error, setError] = useState("");

  // Al abrir la app: si hay un token guardado, comprobar que sigue siendo válido
  useEffect(() => {
    if (!obtenerToken()) return;
    api
      .yo()
      .then(setUser)
      .catch((e) => {
        // solo se descarta el token si el servidor lo rechazó; si no hay conexión se conserva
        if (e.status === 401) borrarToken();
        else setError(e.message);
      })
      .finally(() => setCargando(false));
  }, []);

  // Si en cualquier momento el servidor dice que la sesión venció, volver al login
  useEffect(() => {
    cuandoExpireLaSesion(() => {
      borrarToken();
      setUser(null);
      setError("Tu sesión expiró, inicia sesión de nuevo.");
    });
    return () => cuandoExpireLaSesion(null);
  }, []);

  const entrar = (accion) => async (datos) => {
    try {
      setUser(await accion(datos));
      setError("");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  return {
    user,
    cargando,
    error,
    login: entrar(api.login),
    register: entrar(api.registro),
    logout: () => {
      borrarToken();
      setUser(null);
      setError("");
    },
  };
}
