import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { partida } from "./partida";
import { cuantoHaCrecido } from "./horizonte";
import { Bache } from "./Bache";
import { Modelo, Personaje, RUTA_MOTOCONCHO, rutaCoche, rutaPersona } from "./modelos";

const o = CONFIG.obstaculos;
const { anchoCarril } = CONFIG.carretera;
const CANTIDAD = 12;
const BORDE_CALLE = anchoCarril * 1.5 + 0.8;

const TIPOS = ["camion", "coche", "moto", "bache", "peaton"] as const;
type Tipo = (typeof TIPOS)[number];

const TAMANOS: Record<Tipo, { largo: number; ancho: number; alto: number }> = {
  camion: { largo: 4.4, ancho: 1, alto: 3 },
  coche: { largo: 3.5, ancho: 0.95, alto: 1.5 },
  moto: { largo: 2, ancho: 0.4, alto: 1.8 },
  bache: { largo: o.tamanoBache * 1.4, ancho: o.tamanoBache * 0.9, alto: 0.1 },
  peaton: { largo: 0.5, ancho: 0.3, alto: 1.8 },
};

type Obstaculo = {
  tipo: Tipo;
  x: number;
  z: number;
  direccion: number;
  andando: boolean;
  coche: string;
  camion: string;
  persona: string;
  motorista: string;
};

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

function Moto({ motorista }: { motorista: string }) {
  return (
    <group>
      <Modelo ruta={RUTA_MOTOCONCHO} largo={CONFIG.modelos.largoMoto} />
      <group position={[0, 0.45, 0.15]} rotation-y={Math.PI}>
        <Personaje ruta={rutaPersona(motorista)} animacion="drive" />
      </group>
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
        andando: false,
        coche: alAzar(CONFIG.modelos.coches),
        camion: alAzar(CONFIG.modelos.camiones),
        persona: alAzar(CONFIG.modelos.personas),
        motorista: alAzar(CONFIG.modelos.personas),
      };
      colocar(obstaculo, z);
      z -= entre(o.separacionMinima, o.separacionMaxima);
      return obstaculo;
    });
  }, []);

  useFrame((_, delta) => {
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
        obstaculo.andando = delante < o.peatonEmpiezaACruzarA && Math.abs(obstaculo.x) <= BORDE_CALLE;
        if (obstaculo.andando) obstaculo.x += obstaculo.direccion * o.velocidadPeaton * dt;
        peaton.rotation.y = (obstaculo.direccion * Math.PI) / 2;
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
          <Modelo ruta={rutaCoche(obstaculo.camion)} escala={CONFIG.modelos.escalaCamiones} />
          <Modelo ruta={rutaCoche(obstaculo.coche)} escala={CONFIG.modelos.escalaCoches} />
          <Moto motorista={obstaculo.motorista} />
          <Bache />
          <group>
            <Personaje ruta={rutaPersona(obstaculo.persona)} animacion={() => (obstaculo.andando ? "walk" : "idle")} />
          </group>
        </group>
      ))}
    </group>
  );
}
