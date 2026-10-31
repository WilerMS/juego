import { entrada } from "../controles";
import { posicionJugador } from "./posicion";

export const partida = { jugando: true };

export function reiniciarPartida() {
  partida.jugando = true;
  posicionJugador.set(0, 0, 0);
  entrada.carril = 0;
  entrada.saltar = false;
}
