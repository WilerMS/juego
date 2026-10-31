import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { Palmera } from "./Decorado";

const p = CONFIG.playa;

export function Playa() {
  const grupo = useRef<Group>(null);

  const palmeras = useMemo(
    () =>
      Array.from({ length: p.palmeras }, (_, i) => {
        const lado = i % 2 === 0 ? -1 : 1;
        return {
          x: lado * (8 + Math.random() * 90),
          z: -p.distancia - 4 - Math.random() * (p.anchoArena - 10),
        };
      }),
    [],
  );

  useFrame(() => {
    if (grupo.current) grupo.current.position.z = posicionJugador.z;
  });

  return (
    <group ref={grupo}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.22, -p.distancia - p.anchoArena / 2]} receiveShadow>
        <planeGeometry args={[800, p.anchoArena]} />
        <meshStandardMaterial color={p.colorArena} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.2, -p.distancia - p.anchoArena - 400]}>
        <planeGeometry args={[1600, 800]} />
        <meshStandardMaterial color={p.colorMar} roughness={0.2} metalness={0.1} />
      </mesh>
      {palmeras.map((palmera, i) => (
        <Palmera key={i} {...palmera} />
      ))}
    </group>
  );
}
