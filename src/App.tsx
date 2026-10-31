import { useEffect, useState } from "react";
import { escucharTeclado } from "./controles";
import { Mundo } from "./escena/Mundo";
import { posicionJugador } from "./escena/posicion";
import { reiniciarPartida } from "./escena/partida";
import { Marcador } from "./ui/Marcador";
import { ControlesTactiles } from "./ui/ControlesTactiles";

export function App() {
  const [partida, setPartida] = useState(0);
  const [metros, setMetros] = useState<number | null>(null);

  useEffect(() => escucharTeclado(), []);

  const chocar = () => setMetros(Math.floor(-posicionJugador.z));

  const otraVez = () => {
    reiniciarPartida();
    setMetros(null);
    setPartida((p) => p + 1);
  };

  return (
    <>
      <Mundo key={partida} onChocar={chocar} />
      <Marcador metros={metros} onOtraVez={otraVez} />
      <ControlesTactiles />
    </>
  );
}
