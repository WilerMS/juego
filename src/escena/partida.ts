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
  destino: "",
};

export function empezarPartida() {
  partida.enMenu = false;
  partida.tiempoIntro = 0;
}

export function fasesIntro() {
  const i = CONFIG.intro;
  const t = partida.tiempoIntro;
  const finEspera = i.esperando;
  const finAndar = finEspera + i.andando;
  const finSubir = finAndar + i.subiendo;
  return {
    esperando: t < finEspera,
    andando: t >= finEspera && t < finAndar,
    avanceAndar: Math.min(1, Math.max(0, (t - finEspera) / i.andando)),
    subido: t >= finSubir,
    finSubir,
  };
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
  posicionJugador.set(CONFIG.intro.carrilInicial * CONFIG.carretera.anchoCarril, 0, 0);
  entrada.carril = CONFIG.intro.carrilInicial;
  entrada.saltar = false;
}
