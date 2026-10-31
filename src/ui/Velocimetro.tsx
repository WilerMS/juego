import { useEffect, useRef } from "react";
import { posicionJugador } from "../escena/posicion";
import { partida } from "../escena/partida";

export function Velocimetro() {
  const metros = useRef<HTMLSpanElement>(null);
  const kmh = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let pedido = 0;
    const actualizar = () => {
      if (metros.current) metros.current.textContent = `${Math.floor(-posicionJugador.z)} m`;
      if (kmh.current) kmh.current.textContent = `${Math.round(partida.velocidad * 3.6)} km/h`;
      pedido = requestAnimationFrame(actualizar);
    };
    actualizar();
    return () => cancelAnimationFrame(pedido);
  }, []);

  return (
    <div className="velocimetro">
      <span ref={metros} />
      <span ref={kmh} />
    </div>
  );
}
