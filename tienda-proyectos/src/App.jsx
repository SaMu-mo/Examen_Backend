import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getToken } from "./api";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import VerProyectos from "./pages/VerProyectos.jsx";
import GestionarProyectos from "./pages/GestionarProyectos.jsx";
import CrearTarea from "./pages/CrearTarea.jsx";

function RutaPrivada({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();
  const mostrarNavbar = getToken() && location.pathname !== "/login";

  return (
    <div className="app">
      {mostrarNavbar && <Navbar />}
      <main className="contenido">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/proyectos"
            element={
              <RutaPrivada>
                <VerProyectos />
              </RutaPrivada>
            }
          />
          <Route
            path="/gestionar"
            element={
              <RutaPrivada>
                <GestionarProyectos />
              </RutaPrivada>
            }
          />
          <Route
            path="/tareas"
            element={
              <RutaPrivada>
                <CrearTarea />
              </RutaPrivada>
            }
          />
          <Route path="*" element={<Navigate to={getToken() ? "/proyectos" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
