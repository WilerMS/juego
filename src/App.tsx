import { useEffect, useState } from "react";
import { CONFIG } from "./config";
import { escucharTeclado } from "./controles";
import { Mundo } from "./escena/Mundo";
import { Marcador } from "./ui/Marcador";
import { ControlesTactiles } from "./ui/ControlesTactiles";

export function App() {
  const [partida, setPartida] = useState(0);
  const [recogidas, setRecogidas] = useState(0);

  useEffect(() => escucharTeclado(), []);

  const otraVez = () => {
    setRecogidas(0);
    setPartida((p) => p + 1);
  };

  return (
    <>
      <Mundo key={partida} onRecoger={() => setRecogidas((r) => r + 1)} />
      <Marcador
        recogidas={recogidas}
        total={CONFIG.estrellas.cantidad}
        onOtraVez={otraVez}
      />
      <ControlesTactiles />
    </>
  );
}
