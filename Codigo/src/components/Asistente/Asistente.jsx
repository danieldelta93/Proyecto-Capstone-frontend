import { useEffect, useRef, useState } from "react";
import { api } from "../../api/api.js";
import { IconSend } from "../Icons/Icons.jsx";
import "./Asistente.css";

const SUGERIDAS = [
  "¿Qué producto debo comprar más?",
  "¿Cuál es mi mejor día de ventas?",
  "¿Qué productos tienen stock bajo?",
  "¿Cuánto vendí esta semana?",
  "¿Cuánto gané esta semana?",
];

// Las respuestas las genera el servidor a partir de los datos reales de la cuenta
// (con un modelo de IA si el backend lo tiene configurado, o con reglas si no).
export default function Asistente() {
  const [mensajes, setMensajes] = useState([
    {
      from: "bot",
      text: "Hola, soy tu asistente. Puedo mirar tus datos de ventas e inventario y darte recomendaciones. ¿Qué quieres saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const [pensando, setPensando] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mensajes, pensando]);

  const enviar = async (texto) => {
    const t = (texto ?? input).trim();
    if (!t || pensando) return;
    setMensajes((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setPensando(true);
    try {
      const { respuesta } = await api.preguntar(t);
      setMensajes((m) => [...m, { from: "bot", text: respuesta }]);
    } catch (e) {
      setMensajes((m) => [...m, { from: "bot", text: `😕 ${e.message}` }]);
    } finally {
      setPensando(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 className="screen-title">Asistente</h2>
      <p className="screen-sub">Pregúntale sobre tus ventas e inventario, en lenguaje simple.</p>

      <div style={{ marginBottom: 12 }}>
        {SUGERIDAS.map((s) => (
          <span key={s} className="suggest-chip" onClick={() => enviar(s)}>
            {s}
          </span>
        ))}
      </div>

      <div className="chat-scroll" ref={scrollRef} style={{ maxHeight: "48vh", overflowY: "auto", marginBottom: 10 }}>
        {mensajes.map((m, i) => (
          <div key={i} className={"bubble " + (m.from === "user" ? "user" : "bot")}>
            {m.text}
          </div>
        ))}
        {pensando && <div className="bubble bot">Pensando…</div>}
      </div>

      <div className="chat-input-row">
        <input
          placeholder="Escribe tu pregunta…"
          value={input}
          disabled={pensando}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviar();
          }}
        />
        <button className="send-btn" onClick={() => enviar()} disabled={pensando}>
          <IconSend />
        </button>
      </div>
    </div>
  );
}
