import { useEffect, useRef } from "react";
import { fasesIntro, partida, saltarIntro } from "../escena/partida";

export function AvisoIntro() {
  const caja = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const texto = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let pedido = 0;
    const mirar = () => {
      if (caja.current) caja.current.style.display = partida.enIntro && partida.jugando ? "flex" : "none";
      const subido = fasesIntro().subido;
      if (titulo.current) titulo.current.textContent = subido ? "🛵 ¡Vámonos!" : "🙋 ¡Un cliente!";
      if (texto.current) texto.current.textContent = subido ? `Destino: ${partida.destino}` : "Espera a que se suba…";
      pedido = requestAnimationFrame(mirar);
    };
    mirar();
    return () => cancelAnimationFrame(pedido);
  }, []);

  return (
    <div ref={caja} className="intro">
      <h1 ref={titulo} />
      <p ref={texto} />
      <button onPointerDown={(e) => e.stopPropagation()} onClick={saltarIntro}>
        Saltar ⏭
      </button>
    </div>
  );
}
