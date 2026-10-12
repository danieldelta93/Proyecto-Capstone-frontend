import "./Toast.css";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast" key={toast.id}>
      {toast.text}
    </div>
  );
}
