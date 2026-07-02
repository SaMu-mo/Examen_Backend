import { useEffect, useState } from "react";
import API, { authHeaders, getRol } from "../api";
import TablaProyectos from "../components/TablaProyectos.jsx";

export default function GestionarProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [alerta, setAlerta] = useState(null);
  const esAdmin = getRol() === "ADMIN";

  const cargarProyectos = async () => {
    try {
      const respuesta = await fetch(`${API}/api/proyectos/`, {
        headers: authHeaders()
      });
      if (respuesta.ok) {
        setProyectos(await respuesta.json());
      }
    } catch {
      setAlerta({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const registrarProyecto = async (e) => {
    e.preventDefault();
    setAlerta(null);
    try {
      const respuesta = await fetch(`${API}/api/proyectos/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ nombre, descripcion, fechaInicio })
      });
      if (respuesta.status === 403) {
        setAlerta({
          tipo: "error",
          texto: "Acceso denegado (403): tu rol no tiene permiso para registrar proyectos."
        });
        return;
      }
      if (!respuesta.ok) {
        setAlerta({ tipo: "error", texto: "Ocurrió un error al registrar el proyecto." });
        return;
      }
      setAlerta({ tipo: "ok", texto: "Proyecto registrado correctamente." });
      setNombre("");
      setDescripcion("");
      setFechaInicio("");
      cargarProyectos();
    } catch {
      setAlerta({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    }
  };

  return (
    <section className="panel">
      <span className="eyebrow">Administración</span>
      <h2>Gestionar Proyectos</h2>
      {!esAdmin && (
        <div className="alerta alerta-error">
          Esta vista es exclusiva del rol ADMIN. Cualquier registro será rechazado por el servidor.
        </div>
      )}
      <form className="formulario" onSubmit={registrarProyecto}>
        <div className="campo">
          <label htmlFor="nombre">Nombre del proyecto</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="fechaInicio">Fecha de inicio</label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <button className="btn-principal" type="submit">
          Registrar proyecto
        </button>
      </form>
      {alerta && (
        <div className={`alerta ${alerta.tipo === "ok" ? "alerta-ok" : "alerta-error"}`}>
          {alerta.texto}
        </div>
      )}
      <TablaProyectos proyectos={proyectos} />
    </section>
  );
}