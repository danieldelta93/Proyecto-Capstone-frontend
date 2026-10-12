import { IconBox, IconCoin, IconChart, IconChat, IconDoc } from "../Icons/Icons.jsx";
import "./TabBar.css";

const TABS = [
  { id: "inventario", label: "Inventario", Icon: IconBox },
  { id: "ventas", label: "Ventas", Icon: IconCoin },
  { id: "panel", label: "Panel", Icon: IconChart },
  { id: "asistente", label: "Asistente", Icon: IconChat },
  { id: "reportes", label: "Reportes", Icon: IconDoc },
];

export default function TabBar({ tab, setTab }) {
  return (
    <nav className="tabbar">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={tab === id ? "active" : ""}
          onClick={() => setTab(id)}
        >
          <Icon />
          <span className="tlabel">{label}</span>
        </button>
      ))}
    </nav>
  );
}
