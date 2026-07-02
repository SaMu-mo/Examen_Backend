import { useEffect, useState } from "react";
import API, { authHeaders } from "../api";

const PRIORIDADES = ["ALTA", "MEDIA", "BAJA"];

export default function CrearTarea() {
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [costoEstimado, setCostoEstimado] = useState("");
  const [prioridad, setPrioridad] = useState("MEDIA");
  const [proyectoId, setProyectoId] = useState("");
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
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
    cargarProyectos();
  }, []);

  const registrarTarea = async (e) => {
    e.preventDefault();
    setAlerta(null);
    try {
      const respuesta = await fetch(`${API}/api/tareas/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          descripcion,
          fechaLimite,
          costoEstimado: Number(costoEstimado),
          prioridad,
          proyecto: { id: Number(proyectoId) }
        })
      });
      if (respuesta.status === 400) {
        const data = await respuesta.json();
        setAlerta({ tipo: "error", texto: data.error || "Prioridad no válida" });
        return;
      }
      if (respuesta.status === 403) {
        setAlerta({
          tipo: "error",
          texto: "Acceso denegado (403): solo un ADMIN puede crear tareas."
        });
        return;
      }
      if (!respuesta.ok) {
        setAlerta({ tipo: "error", texto: "Ocurrió un error al crear la tarea." });
        return;
      }
      setAlerta({ tipo: "ok", texto: "Tarea creada correctamente." });
      setDescripcion("");
      setFechaLimite("");
      setCostoEstimado("");
      setPrioridad("MEDIA");
      setProyectoId("");
    } catch {
      setAlerta({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    }
  };

  return (
    <section className="panel">
      <span className="eyebrow">Administración</span>
      <h2>Crear Tareas</h2>
      <form className="formulario" onSubmit={registrarTarea}>
        <div className="campo">
          <label htmlFor="descripcionTarea">Descripción</label>
          <input
            id="descripcionTarea"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="fechaLimite">Fecha límite</label>
          <input
            id="fechaLimite"
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="costoEstimado">Costo estimado</label>
          <input
            id="costoEstimado"
            type="number"
            step="0.01"
            min="0"
            value={costoEstimado}
            onChange={(e) => setCostoEstimado(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="proyecto">Proyecto</label>
          <select
            id="proyecto"
            value={proyectoId}
            onChange={(e) => setProyectoId(e.target.value)}
            required
          >
            <option value="">Selecciona un proyecto</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="prioridad">Prioridad</label>
          <input
            id="prioridad"
            type="text"
            list="opciones-prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            required
          />
          <datalist id="opciones-prioridad">
            {PRIORIDADES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <div className="pills">
            {PRIORIDADES.map((p) => (
              <button
                type="button"
                key={p}
                className={`pill pill-${p.toLowerCase()} ${prioridad === p ? "pill-activa" : ""}`}
                onClick={() => setPrioridad(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-principal" type="submit">
          Crear tarea
        </button>
      </form>
      {alerta && (
        <div className={`alerta ${alerta.tipo === "ok" ? "alerta-ok" : "alerta-error"}`}>
          {alerta.texto}
        </div>
      )}
    </section>
  );
}