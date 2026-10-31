import { Velocimetro } from "./Velocimetro";

type Props = { metros: number | null; record: number; onOtraVez: () => void };

export function Marcador({ metros, record, onOtraVez }: Props) {
  return (
    <>
      <div className="ayuda ordenador">← → para cambiar de carril · Espacio para saltar</div>
      <div className="ayuda movil">Desliza ⬅️ ➡️ para cambiar de carril · ⬆️ para saltar</div>
      <Velocimetro />
      <div className="creditos">Modelos: Kenney y Quaternius (CC0) · Asfalto: Poly Haven (CC0) · Motos: Poly by Google y Paul Spooner (CC-BY)</div>
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
