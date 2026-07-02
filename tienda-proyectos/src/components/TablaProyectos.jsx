export default function TablaProyectos({ proyectos }) {
  if (!proyectos.length) {
    return <p className="vacio">Aún no hay proyectos registrados.</p>;
  }

  const columnas = Object.keys(proyectos[0]);

  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p, i) => (
            <tr key={p.id ?? i}>
              {columnas.map((col) => (
                <td key={col}>{String(p[col] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
