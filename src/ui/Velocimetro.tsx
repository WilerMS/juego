import { useEffect, useRef } from "react";
import { posicionJugador } from "../escena/posicion";
import { nivelActual, partida } from "../escena/partida";

export function Velocimetro() {
  const metros = useRef<HTMLSpanElement>(null);
  const kmh = useRef<HTMLSpanElement>(null);
  const aviso = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pedido = 0;
    let nivelVisto = 1;
    const actualizar = () => {
      const nivel = nivelActual();
      if (nivel > nivelVisto && aviso.current && partida.jugando) {
        nivelVisto = nivel;
        aviso.current.textContent = `🔥 ¡Más rápido! Nivel ${nivel}`;
        aviso.current.classList.remove("visible");
        void aviso.current.offsetWidth;
        aviso.current.classList.add("visible");
      }
      if (metros.current) metros.current.textContent = `${Math.floor(-posicionJugador.z)} m`;
      if (kmh.current) kmh.current.textContent = `${Math.round(partida.velocidad * 3.6)} km/h`;
      pedido = requestAnimationFrame(actualizar);
    };
    actualizar();
    return () => cancelAnimationFrame(pedido);
  }, []);

  return (
    <>
      <div className="velocimetro">
        <span ref={metros} />
        <span ref={kmh} />
      </div>
      <div ref={aviso} className="aviso-nivel" />
    </>
  );
}
