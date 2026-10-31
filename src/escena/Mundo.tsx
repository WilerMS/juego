import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import { CONFIG } from "../config";
import { Jugador } from "./Jugador";
import { Carretera } from "./Carretera";
import { Obstaculos } from "./Obstaculos";
import { posicionJugador } from "./posicion";

function Sol() {
  const luz = useRef<DirectionalLight>(null);
  const escena = useThree((s) => s.scene);

  useEffect(() => {
    const objetivo = luz.current?.target;
    if (!objetivo) return;
    escena.add(objetivo);
    return () => {
      escena.remove(objetivo);
    };
  }, [escena]);

  useFrame(() => {
    if (!luz.current) return;
    luz.current.position.set(15, 25, posicionJugador.z + 10);
    luz.current.target.position.set(0, 0, posicionJugador.z - 10);
  });

  return (
    <directionalLight
      ref={luz}
      intensity={1.8}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
    />
  );
}

export function Mundo({ onChocar }: { onChocar: () => void }) {
  const lejos = CONFIG.carretera.largoTrozo * (CONFIG.carretera.trozosVisibles - 2);
  return (
    <Canvas shadows camera={{ fov: 60, position: [0, CONFIG.camara.altura, CONFIG.camara.distancia] }}>
      <color attach="background" args={[CONFIG.mundo.colorCielo]} />
      <fog attach="fog" args={[CONFIG.mundo.colorCielo, lejos * 0.5, lejos]} />
      <ambientLight intensity={0.6} />
      <Sol />
      <Carretera />
      <Obstaculos onChocar={onChocar} />
      <Jugador />
    </Canvas>
  );
}
