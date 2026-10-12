import { useCallback, useRef, useState } from "react";

// Muestra un mensaje breve (festejo o confirmación) que se
// oculta solo después de un par de segundos.
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((text, duracionMs = 2200) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ id: Date.now(), text });
    timerRef.current = setTimeout(() => setToast(null), duracionMs);
  }, []);

  return { toast, showToast };
}
