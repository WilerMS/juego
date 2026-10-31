import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { escucharTeclado } from "./controles";
import { Mundo } from "./escena/Mundo";
import { posicionJugador } from "./escena/posicion";
import { reiniciarPartida } from "./escena/partida";
import { Marcador } from "./ui/Marcador";
import { ControlesTactiles } from "./ui/ControlesTactiles";

const CLAVE_RECORD = "record-metros";

function leerRecord() {
  try {
    return Number(localStorage.getItem(CLAVE_RECORD)) || 0;
  } catch {
    return 0;
  }
}

function guardarRecord(metros: number) {
  try {
    localStorage.setItem(CLAVE_RECORD, String(metros));
  } catch {
    return;
  }
}

export function App() {
  const [partida, setPartida] = useState(0);
  const [metros, setMetros] = useState<number | null>(null);
  const [record, setRecord] = useState(leerRecord);

  useRegisterSW({ immediate: true });
  useEffect(() => escucharTeclado(), []);

  const chocar = () => {
    const recorridos = Math.floor(-posicionJugador.z);
    setMetros(recorridos);
    if (recorridos > record) {
      setRecord(recorridos);
      guardarRecord(recorridos);
    }
  };

  const otraVez = () => {
    reiniciarPartida();
    setMetros(null);
    setPartida((p) => p + 1);
  };

  return (
    <>
      <Mundo key={partida} onChocar={chocar} />
      <Marcador metros={metros} record={record} onOtraVez={otraVez} />
      <ControlesTactiles />
    </>
  );
}
