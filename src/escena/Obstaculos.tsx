import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { partida } from "./partida";
import { cuantoHaCrecido } from "./horizonte";
import { Persona } from "./Decorado";

const o = CONFIG.obstaculos;
const { anchoCarril } = CONFIG.carretera;
const CANTIDAD = 12;
const BORDE_CALLE = anchoCarril * 1.5 + 0.8;

const TIPOS = ["camion", "coche", "moto", "bache", "peaton"] as const;
type Tipo = (typeof TIPOS)[number];

const TAMANOS: Record<Tipo, { largo: number; ancho: number; alto: number }> = {
  camion: { largo: o.largoCamion, ancho: 1, alto: 3 },
  coche: { largo: 4, ancho: 0.9, alto: 1.5 },
  moto: { largo: 1.8, ancho: 0.35, alto: 1.8 },
  bache: { largo: 1.1, ancho: 0.6, alto: 0.1 },
  peaton: { largo: 0.5, ancho: 0.3, alto: 1.8 },
};

type Obstaculo = { tipo: Tipo; x: number; z: number; direccion: number; color: string; colorRopa: string };

function entre(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function alAzar<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function tipoAlAzar(): Tipo {
  const total = TIPOS.reduce((suma, t) => suma + o.frecuencia[t], 0);
  let dado = Math.random() * total;
  for (const tipo of TIPOS) {
    dado -= o.frecuencia[tipo];
    if (dado < 0) return tipo;
  }
  return "coche";
}

function colocar(obstaculo: Obstaculo, z: number) {
  obstaculo.z = z;
  obstaculo.tipo = tipoAlAzar();
  if (obstaculo.tipo === "peaton") {
    const lado = Math.random() < 0.5 ? -1 : 1;
    obstaculo.x = lado * BORDE_CALLE;
    obstaculo.direccion = -lado;
  } else {
    obstaculo.x = (Math.floor(Math.random() * 3) - 1) * anchoCarril;
    obstaculo.direccion = 0;
  }
}

function Rueda({ x, z, radio }: { x: number; z: number; radio: number }) {
  return (
    <mesh position={[x, radio, z]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[radio, radio, 0.25, 14]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
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
      {[-1, 1].flatMap((lado) =>
        [-largo / 2 + 0.8, largo / 2 - 1].map((z) => <Rueda key={`${lado}${z}`} x={lado * 0.95} z={z} radio={0.45} />),
      )}
    </group>
  );
}

function Coche({ color }: { color: string }) {
  return (
    <group>
      <mesh position-y={0.65} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.3, 0.2]} castShadow>
        <boxGeometry args={[1.6, 0.65, 2.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[1.65, 0.45, 1.9]} />
        <meshStandardMaterial color="#9fd3ff" />
      </mesh>
      {[-1, 1].flatMap((lado) => [-1.3, 1.3].map((z) => <Rueda key={`${lado}${z}`} x={lado * 0.85} z={z} radio={0.35} />))}
    </group>
  );
}

function Moto({ color, colorRopa }: { color: string; colorRopa: string }) {
  return (
    <group>
      <Rueda x={0} z={-0.7} radio={0.35} />
      <Rueda x={0} z={0.7} radio={0.35} />
      <mesh position-y={0.7} castShadow>
        <boxGeometry args={[0.3, 0.4, 1.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.05, -0.6]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 1.35, 0.1]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 6, 12]} />
        <meshStandardMaterial color={colorRopa} />
      </mesh>
      <mesh position={[0, 1.95, 0.05]} castShadow>
        <sphereGeometry args={[0.24, 14, 14]} />
        <meshStandardMaterial color={color} />
      </mesh>
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
      const obstaculo: Obstaculo = {
        tipo: "coche",
        x: 0,
        z: 0,
        direccion: 0,
        color: alAzar(o.coloresVehiculos),
        colorRopa: alAzar(CONFIG.decorado.coloresRopa),
      };
      colocar(obstaculo, z);
      z -= entre(o.separacionMinima, o.separacionMaxima);
      return obstaculo;
    });
  }, []);

  useFrame((state, delta) => {
    if (!partida.jugando || !grupo.current) return;
    const dt = Math.min(delta, 0.05);

    let masLejos = 0;
    for (const obstaculo of lista) masLejos = Math.min(masLejos, obstaculo.z);

    lista.forEach((obstaculo, i) => {
      if (obstaculo.z > posicionJugador.z + 10) {
        colocar(obstaculo, masLejos - entre(o.separacionMinima, o.separacionMaxima));
        masLejos = obstaculo.z;
      }

      const delante = posicionJugador.z - obstaculo.z;
      const hijo = grupo.current!.children[i];
      const peaton = hijo.children[4];

      if (obstaculo.tipo === "peaton") {
        const cruzando = delante < o.peatonEmpiezaACruzarA && Math.abs(obstaculo.x) <= BORDE_CALLE;
        if (cruzando) obstaculo.x += obstaculo.direccion * o.velocidadPeaton * dt;
        peaton.rotation.y = (obstaculo.direccion * Math.PI) / 2;
        peaton.position.y = cruzando ? Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.12 : 0;
      }

      hijo.position.set(obstaculo.x, 0, obstaculo.z);
      hijo.scale.y = cuantoHaCrecido(delante);
      hijo.visible = hijo.scale.y > 0.01;
      TIPOS.forEach((tipo, n) => (hijo.children[n].visible = obstaculo.tipo === tipo));

      const t = TAMANOS[obstaculo.tipo];
      const chocaX = Math.abs(posicionJugador.x - obstaculo.x) < t.ancho + 0.45;
      const chocaZ = Math.abs(delante) < t.largo / 2 + 0.3;
      const chocaY = posicionJugador.y < t.alto;
      if (chocaX && chocaZ && chocaY) {
        partida.jugando = false;
        onChocar();
      }
    });
  });

  return (
    <group ref={grupo}>
      {lista.map((obstaculo, i) => (
        <group key={i}>
          <Camion color={obstaculo.color} />
          <Coche color={obstaculo.color} />
          <Moto color={obstaculo.color} colorRopa={obstaculo.colorRopa} />
          <Bache />
          <group>
            <Persona x={0} z={0} y={0} color={obstaculo.colorRopa} mirando={0} />
          </group>
        </group>
      ))}
    </group>
  );
}
