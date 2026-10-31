import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { CONFIG } from "../config";
import { posicionJugador } from "./posicion";
import { partida } from "./partida";
import { Personaje } from "./modelos";

const intro = CONFIG.intro;
const p = CONFIG.perseguidores;
const TIPOS = ["persona", "perro", "gato"] as const;
type Tipo = (typeof TIPOS)[number];

const ruta = (tipo: Tipo) => `/modelos/perseguidores/${p[tipo].modelo}.glb`;
TIPOS.forEach((tipo) => useGLTF.preload(ruta(tipo)));

function tipoAlAzar(): Tipo {
  const total = TIPOS.reduce((suma, t) => suma + p.frecuencia[t], 0);
  let dado = Math.random() * total;
  for (const tipo of TIPOS) {
    dado -= p.frecuencia[tipo];
    if (dado < 0) return tipo;
  }
  return "persona";
}

export function Perseguidor() {
  const elegido = useMemo(() => {
    const tipo = tipoAlAzar();
    const frases = p[tipo].frases;
    return { tipo, datos: p[tipo], frase: frases[Math.floor(Math.random() * frases.length)] };
  }, []);
  const grupo = useRef<Group>(null);
  const bocadillo = useRef<HTMLDivElement>(null);
  const segundosCorriendo = useRef(0);
  const seFue = useRef(false);

  useFrame((_, delta) => {
    const cuerpo = grupo.current;
    if (!cuerpo || seFue.current) return;
    cuerpo.visible = !partida.enMenu;
    if (partida.enMenu) {
      if (bocadillo.current) bocadillo.current.style.display = "none";
      return;
    }
    const dt = Math.min(delta, 0.05);

    if (partida.enIntro) {
      cuerpo.position.z -= intro.velocidadPerseguidorEnIntro * dt;
    } else if (partida.jugando) {
      segundosCorriendo.current += dt;
      cuerpo.position.z -= intro.velocidadPerseguidorDespues * dt;
      cuerpo.position.x += (posicionJugador.x - cuerpo.position.x) * (1 - Math.exp(-1.5 * dt));
    }

    if (bocadillo.current) {
      const hablando = partida.enIntro || segundosCorriendo.current < intro.segundosConBocadillo;
      bocadillo.current.style.display = hablando ? "block" : "none";
    }
    if (cuerpo.position.z - posicionJugador.z > intro.perseguidorDesapareceA) {
      cuerpo.visible = false;
      seFue.current = true;
    }
  });

  return (
    <group ref={grupo} position={[0, 0, intro.distanciaPerseguidor]} visible={false}>
      <group rotation-y={Math.PI}>
        <Personaje ruta={ruta(elegido.tipo)} animacion={elegido.datos.animacion} alto={elegido.datos.alto} />
      </group>
      <Html position={[0, elegido.datos.alto + 0.6, 0]} center zIndexRange={[10, 0]}>
        <div ref={bocadillo} className="bocadillo" style={{ display: "none" }}>
          {elegido.frase}
        </div>
      </Html>
    </group>
  );
}
