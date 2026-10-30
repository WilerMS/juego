type Props = { recogidas: number; total: number; onOtraVez: () => void };

export function Marcador({ recogidas, total, onOtraVez }: Props) {
  const ganado = recogidas >= total;
  return (
    <>
      <div className="marcador">
        ⭐ {recogidas} / {total}
      </div>
      <div className="ayuda">Flechas o WASD para moverte · Espacio para saltar</div>
      {ganado && (
        <div className="victoria">
          <h1>¡Lo has conseguido!</h1>
          <button onClick={onOtraVez}>Otra vez</button>
        </div>
      )}
    </>
  );
}
