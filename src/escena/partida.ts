import { CONFIG } from "../config";
import { entrada } from "../controles";
import { posicionJugador } from "./posicion";

const j = CONFIG.jugador;

export const partida = { jugando: true, velocidad: j.velocidadInicial };

export function progresoVelocidad() {
  return (partida.velocidad - j.velocidadInicial) / (j.velocidadMaxima - j.velocidadInicial);
}

export function reiniciarPartida() {
  partida.jugando = true;
  partida.velocidad = j.velocidadInicial;
  posicionJugador.set(0, 0, 0);
  entrada.carril = 0;
  entrada.saltar = false;
}
