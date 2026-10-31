import { useEffect } from "react";
import { escucharTeclado } from "./controles";
import { Mundo } from "./escena/Mundo";
import { Marcador } from "./ui/Marcador";
import { ControlesTactiles } from "./ui/ControlesTactiles";

export function App() {
  useEffect(() => escucharTeclado(), []);

  return (
    <>
      <Mundo />
      <Marcador />
      <ControlesTactiles />
    </>
  );
}
