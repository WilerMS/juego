import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ExtrudeGeometry, Shape, type Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";

type Estrella = { id: number; x: number; z: number };

function crearEstrellas(): Estrella[] {
  const mitad = CONFIG.mundo.tamano / 2 - 2;
  return Array.from({ length: CONFIG.estrellas.cantidad }, (_, id) => ({
    id,
    x: (Math.random() * 2 - 1) * mitad,
    z: (Math.random() * 2 - 1) * mitad,
  }));
}

function formaDeEstrella() {
  const forma = new Shape();
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? 0.5 : 0.22;
    const angulo = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  forma.closePath();
  return new ExtrudeGeometry(forma, { depth: 0.15, bevelEnabled: false }).center();
}

export function Estrellas({ onRecoger }: { onRecoger: () => void }) {
  const [estrellas, setEstrellas] = useState(crearEstrellas);
  const geometria = useMemo(formaDeEstrella, []);
  const grupo = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    grupo.current?.children.forEach((hijo, i) => {
      hijo.rotation.y = t * 2;
      hijo.position.y = 1 + Math.sin(t * 3 + i) * 0.2;
    });

    const tocada = estrellas.find(
      (e) =>
        Math.hypot(e.x - posicionJugador.x, e.z - posicionJugador.z) <
          CONFIG.estrellas.distanciaParaRecoger && posicionJugador.y < 2,
    );
    if (tocada) {
      setEstrellas((lista) => lista.filter((e) => e.id !== tocada.id));
      onRecoger();
    }
  });

  return (
    <group ref={grupo}>
      {estrellas.map((e) => (
        <mesh key={e.id} geometry={geometria} position={[e.x, 1, e.z]} castShadow>
          <meshStandardMaterial
            color={CONFIG.estrellas.color}
            emissive={CONFIG.estrellas.color}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
