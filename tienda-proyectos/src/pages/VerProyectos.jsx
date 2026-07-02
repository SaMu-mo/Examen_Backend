import { useEffect, useState } from "react";
import API, { authHeaders } from "../api";
import TablaProyectos from "../components/TablaProyectos.jsx";

export default function VerProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const respuesta = await fetch(`${API}/api/proyectos/`, {
          headers: authHeaders()
        });
        if (!respuesta.ok) {
          setError("No se pudieron cargar los proyectos.");
          return;
        }
        setProyectos(await respuesta.json());
      } catch {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };
    cargarProyectos();
  }, []);

  return (
    <section className="panel">
      <span className="eyebrow">Catálogo</span>
      <h2>Proyectos registrados</h2>
      {cargando && <p className="vacio">Cargando proyectos...</p>}
      {error && <div className="alerta alerta-error">{error}</div>}
      {!cargando && !error && <TablaProyectos proyectos={proyectos} />}
    </section>
  );
}
