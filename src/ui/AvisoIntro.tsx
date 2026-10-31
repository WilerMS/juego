import { useEffect, useRef } from "react";
import { partida, saltarIntro } from "../escena/partida";

export function AvisoIntro() {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pedido = 0;
    const mirar = () => {
      if (caja.current) caja.current.style.display = partida.enIntro && partida.jugando ? "flex" : "none";
      pedido = requestAnimationFrame(mirar);
    };
    mirar();
    return () => cancelAnimationFrame(pedido);
  }, []);

  return (
    <div ref={caja} className="intro">
      <h1>😱 ¡Te persiguen!</h1>
      <p>¡Arranca la moto y huye!</p>
      <button onPointerDown={(e) => e.stopPropagation()} onClick={saltarIntro}>
        Saltar ⏭
      </button>
    </div>
  );
}
