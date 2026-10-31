import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { Decorado } from "./Decorado";

const { anchoCarril, largoTrozo, trozosVisibles } = CONFIG.carretera;
const anchoCarretera = anchoCarril * 3;
const rayasPorTrozo = 5;

function Trozo() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01} receiveShadow>
        <planeGeometry args={[anchoCarretera, largoTrozo]} />
        <meshStandardMaterial color={CONFIG.carretera.colorAsfalto} />
      </mesh>
      {[-0.5, 0.5].map((lado) =>
        Array.from({ length: rayasPorTrozo }, (_, i) => (
          <mesh
            key={`${lado}-${i}`}
            rotation-x={-Math.PI / 2}
            position={[lado * anchoCarril, 0.02, -largoTrozo / 2 + (i + 0.5) * (largoTrozo / rayasPorTrozo)]}
          >
            <planeGeometry args={[0.15, 1.8]} />
            <meshStandardMaterial color={CONFIG.carretera.colorLineas} />
          </mesh>
        )),
      )}
      {[-1, 1].map((lado) => (
        <mesh key={lado} position={[lado * (anchoCarretera / 2 + 0.15), 0.1, 0]} receiveShadow>
          <boxGeometry args={[0.3, 0.2, largoTrozo]} />
          <meshStandardMaterial color="#d8d8d8" />
        </mesh>
      ))}
      <Decorado />
    </group>
  );
}

export function Carretera() {
  const trozos = useRef<Group>(null);
  const hierba = useRef<Group>(null);

  useFrame(() => {
    const primero = Math.floor(-posicionJugador.z / largoTrozo) - 1;
    trozos.current?.children.forEach((trozo, i) => {
      const numero = primero + ((((i - primero) % trozosVisibles) + trozosVisibles) % trozosVisibles);
      trozo.position.z = -numero * largoTrozo - largoTrozo / 2;
    });
    if (hierba.current) hierba.current.position.z = posicionJugador.z;
  });

  return (
    <>
      <group ref={hierba}>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[200, largoTrozo * trozosVisibles * 2]} />
          <meshStandardMaterial color={CONFIG.carretera.colorHierba} />
        </mesh>
      </group>
      <group ref={trozos}>
        {Array.from({ length: trozosVisibles }, (_, i) => (
          <Trozo key={i} />
        ))}
      </group>
    </>
  );
}
