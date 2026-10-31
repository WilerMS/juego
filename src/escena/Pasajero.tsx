import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3, type Group } from "three";
import { CONFIG } from "../config";
import { fasesIntro, partida } from "./partida";
import { Personaje } from "./modelos";

const c = CONFIG.pasajeros;
const ruta = (nombre: string) => `/modelos/pasajeros/${nombre}.glb`;
c.modelos.forEach((n) => useGLTF.preload(ruta(n)));

function alAzar<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

const enLaAcera = new Vector3(-2.1, 0.15, 1.6);
const juntoALaMoto = new Vector3(-0.75, 0, -0.9);
const asiento = new Vector3(0, c.alturaAsiento, -c.haciaAtras);
const posicion = new Vector3();

function animacionPasajero() {
  if (!partida.jugando) return "Death";
  const fase = fasesIntro();
  if (!partida.enIntro || fase.subido) return "Sitting";
  if (fase.andando) return "Walk";
  return "Idle";
}

export function Pasajero() {
  const elegido = useMemo(() => {
    const destino = alAzar(c.destinos);
    partida.destino = destino;
    return { modelo: alAzar(c.modelos), llamada: alAzar(c.llamadas), destino };
  }, []);
  const grupo = useRef<Group>(null);
  const bocadillo = useRef<HTMLDivElement>(null);
  const segundosDeViaje = useRef(0);

  useFrame((_, delta) => {
    const cuerpo = grupo.current;
    if (!cuerpo) return;
    const fase = fasesIntro();
    const subido = !partida.enIntro || fase.subido;

    if (subido) {
      cuerpo.position.copy(asiento);
      cuerpo.rotation.y = 0;
    } else if (fase.andando) {
      const t = fase.avanceAndar;
      posicion.lerpVectors(enLaAcera, juntoALaMoto, t);
      posicion.y = t < 0.5 ? enLaAcera.y : 0;
      cuerpo.position.copy(posicion);
      cuerpo.rotation.y = Math.atan2(juntoALaMoto.x - enLaAcera.x, juntoALaMoto.z - enLaAcera.z);
    } else {
      cuerpo.position.copy(enLaAcera);
      cuerpo.rotation.y = Math.atan2(-enLaAcera.x, -enLaAcera.z);
    }

    if (!partida.enIntro && partida.jugando) segundosDeViaje.current += Math.min(delta, 0.05);
    if (bocadillo.current) {
      const comentando = !partida.enIntro && performance.now() < partida.comentarioHasta;
      const texto = comentando
        ? partida.comentario
        : subido
          ? `¡Llévame ${elegido.destino}, rápido!`
          : elegido.llamada;
      if (bocadillo.current.textContent !== texto) bocadillo.current.textContent = texto;
      const hablando =
        !partida.enMenu &&
        partida.jugando &&
        (partida.enIntro ? !fase.andando : comentando || segundosDeViaje.current < CONFIG.intro.segundosConBocadillo);
      bocadillo.current.style.display = hablando ? "block" : "none";
    }
  });

  return (
    <group ref={grupo} position={enLaAcera}>
      <Personaje ruta={ruta(elegido.modelo)} animacion={animacionPasajero} escala={c.escala} />
      <Html position={[0, 2.3, 0]} center zIndexRange={[10, 0]}>
        <div ref={bocadillo} className="bocadillo" style={{ display: "none" }} />
      </Html>
    </group>
  );
}
