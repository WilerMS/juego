import { Velocimetro } from "./Velocimetro";
import { AvisoIntro } from "./AvisoIntro";

type Props = { metros: number | null; record: number; enMenu: boolean; onOtraVez: () => void };

export function Marcador({ metros, record, enMenu, onOtraVez }: Props) {
  return (
    <>
      {!enMenu && (
        <>
          <div className="ayuda ordenador">← → para cambiar de carril · Espacio para saltar</div>
          <div className="ayuda movil">Desliza ⬅️ ➡️ para cambiar de carril · ⬆️ para saltar</div>
          <Velocimetro />
          <AvisoIntro />
        </>
      )}
      {metros !== null && (
        <div className="fin">
          <h1>💥 ¡Chocaste!</h1>
          <p>Has recorrido {metros} metros</p>
          <p className="record">{metros >= record ? "🏆 ¡Nuevo récord!" : `🏆 Récord: ${record} metros`}</p>
          <button onClick={onOtraVez}>Otra vez</button>
        </div>
      )}
    </>
  );
}
