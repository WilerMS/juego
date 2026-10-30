import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { CONFIG } from "../config";
import { entrada } from "../controles";
import { posicionJugador } from "./posicion";

const direccion = new Vector3();
const destinoCamara = new Vector3();

export function Jugador() {
  const ref = useRef<Group>(null);
  const velocidadY = useRef(0);

  useFrame((state, delta) => {
    const cuerpo = ref.current;
    if (!cuerpo) return;
    const dt = Math.min(delta, 0.05);

    direccion.set(entrada.x, 0, entrada.z);
    if (direccion.lengthSq() > 1) direccion.normalize();
    cuerpo.position.addScaledVector(direccion, CONFIG.jugador.velocidad * dt);
    if (direccion.lengthSq() > 0.01) cuerpo.rotation.y = Math.atan2(direccion.x, direccion.z);

    const borde = CONFIG.mundo.tamano / 2 - 0.5;
    cuerpo.position.x = Math.max(-borde, Math.min(borde, cuerpo.position.x));
    cuerpo.position.z = Math.max(-borde, Math.min(borde, cuerpo.position.z));

    const enElSuelo = cuerpo.position.y <= 0;
    if (entrada.saltar && enElSuelo) velocidadY.current = CONFIG.jugador.salto;
    velocidadY.current -= CONFIG.mundo.gravedad * dt;
    cuerpo.position.y += velocidadY.current * dt;
    if (cuerpo.position.y < 0) {
      cuerpo.position.y = 0;
      velocidadY.current = 0;
    }

    posicionJugador.copy(cuerpo.position);

    destinoCamara.set(
      cuerpo.position.x,
      cuerpo.position.y + CONFIG.camara.altura,
      cuerpo.position.z + CONFIG.camara.distancia,
    );
    state.camera.position.lerp(destinoCamara, 1 - Math.exp(-5 * dt));
    state.camera.lookAt(cuerpo.position.x, cuerpo.position.y + 1, cuerpo.position.z);
  });

  return (
    <group ref={ref}>
      <mesh position-y={0.9} castShadow>
        <capsuleGeometry args={[0.45, 0.8, 8, 16]} />
        <meshStandardMaterial color={CONFIG.jugador.color} />
      </mesh>
      <mesh position={[0.18, 1.3, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-0.18, 1.3, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}
