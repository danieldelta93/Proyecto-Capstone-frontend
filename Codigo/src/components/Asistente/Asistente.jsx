import { useEffect, useRef, useState } from "react";
import { IconSend } from "../Icons/Icons.jsx";
import { responderAsistente } from "./respuestas.js";
import "./Asistente.css";

const SUGERIDAS = [
  "¿Qué producto debo comprar más?",
  "¿Cuál es mi mejor día de ventas?",
  "¿Qué productos tienen stock bajo?",
  "¿Cuánto vendí esta semana?",
  "¿Cuánto gané esta semana?",
];

export default function Asistente({ productos, ventas }) {
  const [mensajes, setMensajes] = useState([
    {
      from: "bot",
      text: "Hola, soy tu asistente. Puedo mirar tus datos de ventas e inventario y darte recomendaciones. ¿Qué quieres saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mensajes]);

  const enviar = (texto) => {
    const t = (texto ?? input).trim();
    if (!t) return;
    const respuesta = responderAsistente(t, productos, ventas);
    setMensajes((m) => [...m, { from: "user", text: t }, { from: "bot", text: respuesta }]);
    setInput("");
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
      </div>

      <div className="chat-input-row">
        <input
          placeholder="Escribe tu pregunta…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviar();
          }}
        />
        <button className="send-btn" onClick={() => enviar()}>
          <IconSend />
        </button>
      </div>
    </div>
  );
}
