import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin, onRegister, error }) {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [form, setForm] = useState({
    correo: "",
    password: "",
    nombreNegocio: "",
    nombreDueño: "",
  });

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const [enviando, setEnviando] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    if (modo === "login") await onLogin({ correo: form.correo, password: form.password });
    else await onRegister(form);
    setEnviando(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-blob auth-blob-a" />
      <div className="auth-blob auth-blob-b" />

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-mark">V</span>
        </div>
        <h1 className="auth-title">Vendix</h1>
        <p className="auth-tagline">Vende fácil, controla mejor 🛍️</p>

        <div className="tabs-toggle" style={{ marginTop: 22 }}>
          <button className={modo === "login" ? "active" : ""} onClick={() => setModo("login")}>
            Iniciar sesión
          </button>
          <button className={modo === "registro" ? "active" : ""} onClick={() => setModo("registro")}>
            Crear cuenta
          </button>
        </div>

        <form onSubmit={submit}>
          {modo === "registro" && (
            <>
              <div className="field-wrap">
                <label className="field">Nombre de tu negocio</label>
                <input
                  placeholder="Ej: Puesto Doña Carmen"
                  value={form.nombreNegocio}
                  onChange={set("nombreNegocio")}
                  required
                />
              </div>
              <div className="field-wrap">
                <label className="field">Tu nombre</label>
                <input
                  placeholder="Ej: Carmen"
                  value={form.nombreDueño}
                  onChange={set("nombreDueño")}
                  required
                />
              </div>
            </>
          )}

          <div className="field-wrap">
            <label className="field">Correo electrónico</label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={form.correo}
              onChange={set("correo")}
              autoCapitalize="none"
              required
            />
          </div>
          <div className="field-wrap">
            <label className="field">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>

          {error && <p className="auth-error">⚠️ {error}</p>}

          <button className="btn btn-primary btn-block" type="submit" disabled={enviando} style={{ marginTop: 4 }}>
            {enviando ? "Un momento…" : modo === "login" ? "Entrar" : "Crear mi cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
