import { CONFIG } from "../config";
import { entrada } from "../controles";
import { posicionJugador } from "./posicion";

const j = CONFIG.jugador;

export const partida = {
  enMenu: true,
  jugando: true,
  enIntro: true,
  tiempoIntro: 0,
  velocidad: j.velocidadInicial,
};

export function empezarPartida() {
  partida.enMenu = false;
  partida.tiempoIntro = 0;
}

export function saltarIntro() {
  partida.tiempoIntro = CONFIG.intro.duracion;
}

export function nivelActual() {
  return 1 + Math.floor(-posicionJugador.z / j.metrosPorNivel);
}

export function progresoVelocidad() {
  return (partida.velocidad - j.velocidadInicial) / (j.velocidadMaxima - j.velocidadInicial);
}

export function reiniciarPartida() {
  partida.enMenu = false;
  partida.jugando = true;
  partida.enIntro = true;
  partida.tiempoIntro = 0;
  partida.velocidad = j.velocidadInicial;
  posicionJugador.set(0, 0, 0);
  entrada.carril = 0;
  entrada.saltar = false;
}
