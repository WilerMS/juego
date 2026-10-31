import { useEffect } from "react";
import { CONFIG } from "../config";

type Props = { record: number; onEmpezar: () => void };

export function MenuInicial({ record, onEmpezar }: Props) {
  useEffect(() => {
    const conTeclado = (e: KeyboardEvent) => {
      if (e.key === "Enter") onEmpezar();
    };
    window.addEventListener("keydown", conTeclado);
    return () => window.removeEventListener("keydown", conTeclado);
  }, [onEmpezar]);

  return (
    <div className="menu">
      <h1>{CONFIG.menu.titulo}</h1>
      <p className="subtitulo">{CONFIG.menu.subtitulo}</p>
      <button className="empezar" onPointerDown={(e) => e.stopPropagation()} onClick={onEmpezar}>
        ▶ Empezar
      </button>
      {record > 0 && <p className="record">🏆 Récord: {record} metros</p>}
      <p className="como-se-juega ordenador">← → cambiar de carril · Espacio saltar</p>
      <p className="como-se-juega movil">Desliza ⬅️ ➡️ para cambiar de carril · ⬆️ para saltar</p>
      <p className="creditos">Modelos: Kenney y Quaternius (CC0) · Asfalto: Poly Haven (CC0) · Motos: Poly by Google y Paul Spooner (CC-BY)</p>
    </div>
  );
}
