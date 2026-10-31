import { useEffect } from "react";
import { CONFIG } from "../config";
import { irDerecha, irIzquierda, saltar } from "../controles";

export function ControlesTactiles() {
  useEffect(() => {
    let inicio: { x: number; y: number } | null = null;

    const tocar = (e: PointerEvent) => {
      inicio = { x: e.clientX, y: e.clientY };
    };

    const deslizar = (e: PointerEvent) => {
      if (!inicio) return;
      const dx = e.clientX - inicio.x;
      const dy = e.clientY - inicio.y;
      const minimo = CONFIG.swipe.distanciaMinima;
      if (Math.abs(dx) < minimo && Math.abs(dy) < minimo) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) irDerecha();
        else irIzquierda();
      } else if (dy < 0) {
        saltar();
      }
      inicio = null;
    };

    const soltar = () => {
      inicio = null;
    };

    window.addEventListener("pointerdown", tocar);
    window.addEventListener("pointermove", deslizar);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);
    return () => {
      window.removeEventListener("pointerdown", tocar);
      window.removeEventListener("pointermove", deslizar);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
    };
  }, []);

  return null;
}
