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
          ancho: alto * (1.2 + Math.random() * 0.6),
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
        <group key={i} position={[montana.x, 0, montana.z]}>
          <mesh position-y={montana.alto / 2}>
            <coneGeometry args={[montana.ancho, montana.alto, 7]} />
            <meshStandardMaterial color={m.color} fog={false} flatShading />
          </mesh>
          <mesh position-y={montana.alto * 0.85}>
            <coneGeometry args={[montana.ancho * 0.3 + 0.5, montana.alto * 0.3 + 0.1, 7]} />
            <meshStandardMaterial color={m.colorNieve} fog={false} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
