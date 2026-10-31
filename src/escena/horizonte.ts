import { CONFIG } from "../config";

export function cuantoHaCrecido(distanciaDelante: number) {
  const s = (CONFIG.playa.distancia - 8 - distanciaDelante) / 15;
  return Math.max(0.001, Math.min(1, s));
}
