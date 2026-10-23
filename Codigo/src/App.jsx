import { useAuth } from "./hooks/useAuth.js";
import Login from "./components/Auth/Login.jsx";
import MainApp from "./MainApp.jsx";

export default function App() {
  const { user, cargando, login, register, logout, error } = useAuth();

  if (cargando) {
    return <div className="pantalla-carga">Cargando Vendix…</div>;
  }

  if (!user) {
    return <Login onLogin={login} onRegister={register} error={error} />;
  }

  // key={user.id}: al cambiar de cuenta se vuelve a montar la app y se piden los datos de esa cuenta.
  return <MainApp key={user.id} user={user} onLogout={logout} />;
}
