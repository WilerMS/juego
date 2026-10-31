import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group, type PerspectiveCamera } from "three";
import { CONFIG } from "../config";
import { entrada } from "../controles";
import { posicionJugador } from "./posicion";
import { partida, progresoVelocidad } from "./partida";
import { Modelo, Personaje, RUTA_MOTO_JUGADORA, RUTA_PROTAGONISTA } from "./modelos";

const p = CONFIG.protagonista;
const j = CONFIG.jugador;

function animacionJugador() {
  return partida.jugando ? p.animacionConducir : p.animacionChoque;
}

const destinoCamara = new Vector3();

export function Jugador() {
  const ref = useRef<Group>(null);
  const velocidadY = useRef(0);

  useFrame((state, delta) => {
    const cuerpo = ref.current;
    if (!cuerpo) return;
    const dt = Math.min(delta, 0.05);

    if (!partida.jugando) {
      cuerpo.rotation.z += (1.4 - cuerpo.rotation.z) * (1 - Math.exp(-6 * dt));
      return;
    }

    partida.velocidad = Math.min(j.velocidadMaxima, partida.velocidad + j.aceleracion * dt);
    const progreso = progresoVelocidad();
    cuerpo.position.z -= partida.velocidad * dt;

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
    cuerpo.rotation.x = Math.max(-0.3, Math.min(0.4, velocidadY.current * CONFIG.jugador.inclinacionAlSaltar));

    posicionJugador.copy(cuerpo.position);

    destinoCamara.set(
      cuerpo.position.x * 0.5,
      cuerpo.position.y * 0.5 + CONFIG.camara.altura,
      cuerpo.position.z + CONFIG.camara.distancia,
    );
    state.camera.position.lerp(destinoCamara, 1 - Math.exp(-8 * dt));
    state.camera.position.z = destinoCamara.z;
    const temblor = j.temblorAMaximaVelocidad * progreso;
    state.camera.position.x += (Math.random() - 0.5) * temblor;
    state.camera.position.y += (Math.random() - 0.5) * temblor;
    const camara = state.camera as PerspectiveCamera;
    const angulo = CONFIG.camara.anguloNormal + (CONFIG.camara.anguloAMaximaVelocidad - CONFIG.camara.anguloNormal) * progreso;
    if (Math.abs(camara.fov - angulo) > 0.05) {
      camara.fov = angulo;
      camara.updateProjectionMatrix();
    }
    state.camera.lookAt(cuerpo.position.x * 0.5, 1, cuerpo.position.z - 6);
  });

  return (
    <group ref={ref} rotation-y={Math.PI}>
      <Modelo ruta={RUTA_MOTO_JUGADORA} largo={CONFIG.modelos.largoMoto} />
      <group position={[0, p.alturaAsiento, -p.haciaAtras]}>
        <Personaje ruta={RUTA_PROTAGONISTA} animacion={animacionJugador} escala={p.escala} />
      </group>
    </group>
  );
}
