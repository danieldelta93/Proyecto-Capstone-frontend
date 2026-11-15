import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api.js";
import { IconAlert } from "../Icons/Icons.jsx";
import "./Consejos.css";

const tipoLegible = (tipo) => {
  const tipos = {
    alerta: "Alerta importante",
    oportunidad: "Oportunidad",
    resumen: "Resumen del negocio",
    recomendacion: "Recomendación",
  };
  return tipos[tipo] || "Consejo para tu negocio";
};

export default function Consejos({ productos, ventas }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = async (forzar = false) => {
    setCargando(true);
    setError("");
    try {
      const resultado = forzar
        ? await api.actualizarInsights()
        : await api.obtenerInsights();
      setDatos(resultado);
    } catch (e) {
      setError(e.message || "No pudimos cargar tus consejos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar(false);
    // Se vuelve a consultar cuando cambian los productos o las ventas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, ventas]);

  const tarjetas = useMemo(() => {
    if (Array.isArray(datos)) return datos;
    return datos?.tarjetas || datos?.insights || datos?.hallazgos || [];
  }, [datos]);

  const conteos = useMemo(() => ({
    oportunidades: tarjetas.filter((t) => t.tipo === "oportunidad").length,
    recomendaciones: tarjetas.filter((t) => t.tipo === "recomendacion").length,
    alertas: tarjetas.filter((t) => t.tipo === "alerta").length,
  }), [tarjetas]);

  return (
    <div className="consejos-page">
      <header className="consejos-hero">
        <div className="consejos-hero-icon">✦</div>
        <p className="consejos-eyebrow">INTELIGENCIA PARA TU NEGOCIO</p>
        <h2>Conoce mejor tu negocio</h2>
        <p>Ideas claras para entender tus ventas, cuidar tu inventario y descubrir oportunidades.</p>
        <button className="consejos-refresh" onClick={() => cargar(true)} disabled={cargando}>
          <span aria-hidden="true">↻</span> {cargando ? "Analizando..." : "Actualizar consejos"}
        </button>
      </header>

      <section className="consejos-resumen" aria-label="Resumen de consejos">
        <article className="consejo-resumen-card">
          <span className="consejo-resumen-icon oportunidad">✦</span>
          <span className="consejo-resumen-numero">{conteos.oportunidades}</span>
          <span className="consejo-resumen-label">Oportunidades</span>
        </article>
        <article className="consejo-resumen-card">
          <span className="consejo-resumen-icon recomendacion">↗</span>
          <span className="consejo-resumen-numero">{conteos.recomendaciones}</span>
          <span className="consejo-resumen-label">Recomendaciones</span>
        </article>
        <article className="consejo-resumen-card">
          <span className="consejo-resumen-icon alerta">!</span>
          <span className="consejo-resumen-numero">{conteos.alertas}</span>
          <span className="consejo-resumen-label">Alertas</span>
        </article>
      </section>

      <section className="consejos-listado">
        <div className="consejos-listado-heading">
          <div>
            <p className="consejos-eyebrow">PARA TOMAR MEJORES DECISIONES</p>
            <h3>Tus consejos</h3>
          </div>
          {datos?.generadoEn && <span className="consejos-fecha">Actualizado: {datos.generadoEn}</span>}
        </div>

        {cargando && !datos && <p className="consejos-estado">⏳ Estamos revisando la información de tu negocio...</p>}
        {error && <div className="consejos-error"><IconAlert /> <span>{error}</span></div>}

        {!cargando && !error && tarjetas.length === 0 && (
          <div className="consejos-vacio">
            <span>✦</span>
            <h3>Aún no hay consejos disponibles</h3>
            <p>Registra productos y ventas para que podamos encontrar oportunidades para tu negocio.</p>
          </div>
        )}

        <div className="consejos-cards">
          {tarjetas.map((tarjeta, index) => (
            <article className={`consejo-card tipo-${tarjeta.tipo || "general"}`} key={tarjeta.id || `${tarjeta.tipo}-${index}`}>
              <div className="consejo-card-top">
                <span className={`consejo-etiqueta tipo-${tarjeta.tipo || "general"}`}>{tipoLegible(tarjeta.tipo)}</span>
                {tarjeta.prioridad && <span className="consejo-prioridad">{tarjeta.prioridad}</span>}
              </div>
              <h3>{tarjeta.titulo || "Consejo para tu negocio"}</h3>
              <p className="consejo-descripcion">{tarjeta.descripcion || "Revisa la información de tu negocio para conocer más detalles."}</p>
              {tarjeta.accion && (
                <div className="consejo-accion">
                  <strong>¿Qué puedes hacer?</strong>
                  <p>{tarjeta.accion}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
