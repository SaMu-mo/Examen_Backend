import { NavLink, useNavigate } from "react-router-dom";
import API, { getRol, getToken } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const rol = getRol();

  const cerrarSesion = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
    } catch {
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-marca">
        <span className="navbar-logo">◆</span>
        <span className="navbar-titulo">Panel de Proyectos</span>
      </div>
      <nav className="navbar-links">
        {rol === "USER" && <NavLink to="/proyectos">Ver Proyectos</NavLink>}
        {rol === "ADMIN" && (
          <>
            <NavLink to="/gestionar">Gestionar Proyectos</NavLink>
            <NavLink to="/tareas">Crear Tareas</NavLink>
          </>
        )}
      </nav>
      <div className="navbar-sesion">
        <span className={`badge-rol ${rol === "ADMIN" ? "badge-admin" : "badge-user"}`}>{rol}</span>
        <button className="btn-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
