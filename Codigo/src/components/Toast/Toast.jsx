import "./Toast.css";

export default function Toast({ toast }) {
  if (!toast) return null;
  // el aviso se desvanece justo antes de que termine su duración
  const desvanecer = Math.max(toast.duracionMs - 300, 300) / 1000;
  return (
    <div
      className="toast"
      key={toast.id}
      style={{ animation: `toast-in 0.25s ease-out, toast-out 0.3s ease-in ${desvanecer}s forwards` }}
    >
      {toast.text}
    </div>
  );
}
