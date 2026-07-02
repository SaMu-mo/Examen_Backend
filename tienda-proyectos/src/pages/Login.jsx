import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const respuesta = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!respuesta.ok) {
        setError("Credenciales incorrectas. Verifica tu usuario y contraseña.");
        return;
      }
      const data = await respuesta.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      navigate("/proyectos", { replace: true });
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={manejarSubmit}>
        <span className="eyebrow">Acceso seguro · JWT</span>
        <h1>Panel de Proyectos</h1>
        <p className="login-sub">Inicia sesión para consultar y gestionar el catálogo.</p>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="alerta alerta-error">{error}</div>}
        <button className="btn-principal" type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
