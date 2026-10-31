import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { CONFIG } from "../config";
import { entrada } from "../controles";
import { posicionJugador } from "./posicion";
import { partida } from "./partida";
import { Personaje, rutaPersona } from "./modelos";

function animacionJugador() {
  if (!partida.jugando) return "die";
  return posicionJugador.y > 0.05 ? "jump" : "sprint";
}

const destinoCamara = new Vector3();

export function Jugador() {
  const ref = useRef<Group>(null);
  const velocidadY = useRef(0);

  useFrame((state, delta) => {
    const cuerpo = ref.current;
    if (!cuerpo || !partida.jugando) return;
    const dt = Math.min(delta, 0.05);

    cuerpo.position.z -= CONFIG.jugador.velocidadCarrera * dt;

    const destinoX = entrada.carril * CONFIG.carretera.anchoCarril;
    const antesX = cuerpo.position.x;
    cuerpo.position.x += (destinoX - antesX) * (1 - Math.exp(-CONFIG.jugador.rapidezCambioCarril * dt));
    cuerpo.rotation.z = -(cuerpo.position.x - antesX) / dt * 0.02;

    const enElSuelo = cuerpo.position.y <= 0;
    if (entrada.saltar && enElSuelo) velocidadY.current = CONFIG.jugador.salto;
    entrada.saltar = false;
    velocidadY.current -= CONFIG.mundo.gravedad * dt;
    cuerpo.position.y += velocidadY.current * dt;
    if (cuerpo.position.y < 0) {
      cuerpo.position.y = 0;
      velocidadY.current = 0;
    }

    posicionJugador.copy(cuerpo.position);

    destinoCamara.set(
      cuerpo.position.x * 0.5,
      cuerpo.position.y * 0.5 + CONFIG.camara.altura,
      cuerpo.position.z + CONFIG.camara.distancia,
    );
    state.camera.position.lerp(destinoCamara, 1 - Math.exp(-8 * dt));
    state.camera.position.z = destinoCamara.z;
    state.camera.lookAt(cuerpo.position.x * 0.5, 1, cuerpo.position.z - 6);
  });

  return (
    <group ref={ref} rotation-y={Math.PI}>
      <Personaje ruta={rutaPersona(CONFIG.modelos.personaje)} animacion={animacionJugador} />
    </group>
  );
}
