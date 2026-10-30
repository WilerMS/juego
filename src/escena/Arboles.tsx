import { useMemo } from "react";
import { CONFIG } from "../config";

export function Arboles() {
  const arboles = useMemo(() => {
    const mitad = CONFIG.mundo.tamano / 2 - 1;
    return Array.from({ length: CONFIG.mundo.arboles }, () => ({
      x: (Math.random() * 2 - 1) * mitad,
      z: (Math.random() * 2 - 1) * mitad,
      escala: 0.8 + Math.random() * 0.7,
    })).filter((a) => Math.hypot(a.x, a.z) > 4);
  }, []);

  return (
    <>
      {arboles.map((a, i) => (
        <group key={i} position={[a.x, 0, a.z]} scale={a.escala}>
          <mesh position-y={0.6} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 1.2]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
          <mesh position-y={1.9} castShadow>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color="#2f8f3a" />
          </mesh>
        </group>
      ))}
    </>
  );
}
