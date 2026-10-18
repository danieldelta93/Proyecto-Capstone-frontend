import { useAuth } from "./hooks/useAuth.js";
import Login from "./components/Auth/Login.jsx";
import MainApp from "./MainApp.jsx";

export default function App() {
  const { user, login, register, logout, error } = useAuth();

  if (!user) {
    return (
      <Login
        onLogin={login}
        onRegister={register}
        error={error}
      />
    );
  }

  // key=user.correo fuerza que la app se vuelva a montar (y a leer
  // los datos correctos) cada vez que cambia la persona logueada.
  return <MainApp key={user.correo} user={user} onLogout={logout} />;
}
