import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { CONFIG } from "../config";
import { Jugador } from "./Jugador";
import { Estrellas } from "./Estrellas";
import { Arboles } from "./Arboles";

export function Mundo({ onRecoger }: { onRecoger: () => void }) {
  return (
    <Canvas shadows camera={{ fov: 55, position: [0, CONFIG.camara.altura, CONFIG.camara.distancia] }}>
      <Sky sunPosition={[50, 30, 20]} />
      <fog attach="fog" args={["#cfe9ff", 30, 70]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[CONFIG.mundo.tamano, CONFIG.mundo.tamano]} />
        <meshStandardMaterial color={CONFIG.mundo.colorSuelo} />
      </mesh>
      <Arboles />
      <Estrellas onRecoger={onRecoger} />
      <Jugador />
    </Canvas>
  );
}
