import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { partida } from "./partida";

const o = CONFIG.obstaculos;
const { anchoCarril } = CONFIG.carretera;
const CANTIDAD = 12;

type Obstaculo = { tipo: "camion" | "bache"; carril: number; z: number };

function entre(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function colocar(obstaculo: Obstaculo, z: number) {
  obstaculo.z = z;
  obstaculo.carril = Math.floor(Math.random() * 3) - 1;
  obstaculo.tipo = Math.random() < o.probabilidadCamion ? "camion" : "bache";
}

function Camion({ color }: { color: string }) {
  const largo = o.largoCamion;
  return (
    <group>
      <mesh position={[0, 1.6, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.4, largo - 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.2, -largo / 2 + 0.7]} castShadow>
        <boxGeometry args={[1.9, 1.6, 1.4]} />
        <meshStandardMaterial color="#d9d9d9" />
      </mesh>
      <mesh position={[0, 1.5, -largo / 2 - 0.01]}>
        <boxGeometry args={[1.6, 0.7, 0.05]} />
        <meshStandardMaterial color="#9fd3ff" />
      </mesh>
      {[-1, 1].flatMap((lado) =>
        [-largo / 2 + 0.8, largo / 2 - 1].map((z) => (
          <mesh key={`${lado}${z}`} position={[lado * 0.95, 0.45, z]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.45, 0.45, 0.3, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        )),
      )}
    </group>
  );
}

function Bache() {
  return (
    <group position-y={0.03}>
      <mesh rotation-x={-Math.PI / 2} scale={[1.2, 0.8, 1]}>
        <circleGeometry args={[o.tamanoBache, 12]} />
        <meshStandardMaterial color={o.colorBache} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.005} scale={[1.2, 0.8, 1]}>
        <ringGeometry args={[o.tamanoBache, o.tamanoBache + 0.15, 12]} />
        <meshStandardMaterial color="#6b6b70" />
      </mesh>
    </group>
  );
}

export function Obstaculos({ onChocar }: { onChocar: () => void }) {
  const grupo = useRef<Group>(null);

  const lista = useMemo(() => {
    let z = -o.primeroA;
    return Array.from({ length: CANTIDAD }, () => {
      const obstaculo: Obstaculo = { tipo: "bache", carril: 0, z: 0 };
      colocar(obstaculo, z);
      z -= entre(o.separacionMinima, o.separacionMaxima);
      return obstaculo;
    });
  }, []);

  const colores = useMemo(
    () => lista.map(() => o.coloresCamion[Math.floor(Math.random() * o.coloresCamion.length)]),
    [lista],
  );

  useFrame(() => {
    if (!partida.jugando || !grupo.current) return;

    let masLejos = 0;
    for (const obstaculo of lista) masLejos = Math.min(masLejos, obstaculo.z);

    lista.forEach((obstaculo, i) => {
      if (obstaculo.z > posicionJugador.z + 10) {
        colocar(obstaculo, masLejos - entre(o.separacionMinima, o.separacionMaxima));
        masLejos = obstaculo.z;
      }

      const hijo = grupo.current!.children[i];
      hijo.position.set(obstaculo.carril * anchoCarril, 0, obstaculo.z);
      hijo.children[0].visible = obstaculo.tipo === "camion";
      hijo.children[1].visible = obstaculo.tipo === "bache";

      const mismoCarril = Math.abs(posicionJugador.x - obstaculo.carril * anchoCarril) < anchoCarril * 0.6;
      const distancia = Math.abs(posicionJugador.z - obstaculo.z);
      const choca =
        obstaculo.tipo === "camion"
          ? distancia < o.largoCamion / 2 + 0.3
          : distancia < o.tamanoBache * 0.6 && posicionJugador.y < 0.1;
      if (mismoCarril && choca) {
        partida.jugando = false;
        onChocar();
      }
    });
  });

  return (
    <group ref={grupo}>
      {lista.map((_, i) => (
        <group key={i}>
          <Camion color={colores[i]} />
          <Bache />
        </group>
      ))}
    </group>
  );
}
