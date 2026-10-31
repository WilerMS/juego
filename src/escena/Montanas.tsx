import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";

const m = CONFIG.montanas;

export function Montanas() {
  const grupo = useRef<Group>(null);

  const montanas = useMemo(
    () =>
      Array.from({ length: m.cantidad }, (_, i) => {
        const alto = m.alturaMinima + Math.random() * (m.alturaMaxima - m.alturaMinima);
        return {
          x: (i / (m.cantidad - 1) - 0.5) * m.distancia * 2.4 + (Math.random() - 0.5) * 30,
          z: -m.distancia - Math.random() * 60,
          alto,
          ancho: alto * (1.8 + Math.random() * 0.8),
          color: m.colores[i % m.colores.length],
        };
      }),
    [],
  );

  useFrame(() => {
    if (grupo.current) grupo.current.position.z = posicionJugador.z;
  });

  return (
    <group ref={grupo}>
      {montanas.map((montana, i) => (
        <mesh key={i} position={[montana.x, 0, montana.z]} scale={[montana.ancho, montana.alto, montana.ancho]}>
          <sphereGeometry args={[1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={montana.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}
