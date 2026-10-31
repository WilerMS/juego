export const entrada = { carril: 0, saltar: false };

export function irIzquierda() {
  entrada.carril = Math.max(-1, entrada.carril - 1);
}

export function irDerecha() {
  entrada.carril = Math.min(1, entrada.carril + 1);
}

export function saltar() {
  entrada.saltar = true;
}

export function escucharTeclado() {
  const pulsar = (e: KeyboardEvent) => {
    if (e.repeat) return;
    const tecla = e.key.toLowerCase();
    if (tecla === "arrowleft" || tecla === "a") irIzquierda();
    if (tecla === "arrowright" || tecla === "d") irDerecha();
    if (tecla === " " || tecla === "arrowup" || tecla === "w") saltar();
  };
  window.addEventListener("keydown", pulsar);
  return () => window.removeEventListener("keydown", pulsar);
}
