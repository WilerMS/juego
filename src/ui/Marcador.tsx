type Props = { metros: number | null; onOtraVez: () => void };

export function Marcador({ metros, onOtraVez }: Props) {
  return (
    <>
      <div className="ayuda ordenador">← → para cambiar de carril · Espacio para saltar</div>
      <div className="ayuda movil">Desliza ⬅️ ➡️ para cambiar de carril · ⬆️ para saltar</div>
      <div className="creditos">Modelos: Kenney (CC0) · Moto: Poly by Google (CC-BY)</div>
      {metros !== null && (
        <div className="fin">
          <h1>💥 ¡Chocaste!</h1>
          <p>Has recorrido {metros} metros</p>
          <button onClick={onOtraVez}>Otra vez</button>
        </div>
      )}
    </>
  );
}
