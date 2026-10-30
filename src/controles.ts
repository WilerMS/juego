export const entrada = { x: 0, z: 0, saltar: false };

const teclas = new Set<string>();

function actualizarDesdeTeclado() {
  const izquierda = teclas.has("arrowleft") || teclas.has("a");
  const derecha = teclas.has("arrowright") || teclas.has("d");
  const arriba = teclas.has("arrowup") || teclas.has("w");
  const abajo = teclas.has("arrowdown") || teclas.has("s");
  entrada.x = (derecha ? 1 : 0) - (izquierda ? 1 : 0);
  entrada.z = (abajo ? 1 : 0) - (arriba ? 1 : 0);
  entrada.saltar = teclas.has(" ");
}

export function escucharTeclado() {
  const pulsar = (e: KeyboardEvent) => {
    teclas.add(e.key.toLowerCase());
    actualizarDesdeTeclado();
  };
  const soltar = (e: KeyboardEvent) => {
    teclas.delete(e.key.toLowerCase());
    actualizarDesdeTeclado();
  };
  window.addEventListener("keydown", pulsar);
  window.addEventListener("keyup", soltar);
  return () => {
    window.removeEventListener("keydown", pulsar);
    window.removeEventListener("keyup", soltar);
  };
}
