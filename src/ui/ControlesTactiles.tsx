import { useRef, useState, type PointerEvent } from "react";
import { entrada } from "../controles";

const RADIO = 50;

export function ControlesTactiles() {
  const centro = useRef({ x: 0, y: 0 });
  const [palanca, setPalanca] = useState({ x: 0, y: 0 });

  const empezar = (e: PointerEvent<HTMLDivElement>) => {
    const caja = e.currentTarget.getBoundingClientRect();
    centro.current = { x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 };
    e.currentTarget.setPointerCapture(e.pointerId);
    mover(e);
  };

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    let dx = e.clientX - centro.current.x;
    let dy = e.clientY - centro.current.y;
    const largo = Math.hypot(dx, dy);
    if (largo > RADIO) {
      dx = (dx / largo) * RADIO;
      dy = (dy / largo) * RADIO;
    }
    setPalanca({ x: dx, y: dy });
    entrada.x = dx / RADIO;
    entrada.z = dy / RADIO;
  };

  const soltar = () => {
    setPalanca({ x: 0, y: 0 });
    entrada.x = 0;
    entrada.z = 0;
  };

  return (
    <div className="tactil">
      <div
        className="joystick"
        onPointerDown={empezar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
      >
        <div className="palanca" style={{ transform: `translate(${palanca.x}px, ${palanca.y}px)` }} />
      </div>
      <button
        className="saltar"
        onPointerDown={() => (entrada.saltar = true)}
        onPointerUp={() => (entrada.saltar = false)}
        onPointerCancel={() => (entrada.saltar = false)}
      >
        Saltar
      </button>
    </div>
  );
}
