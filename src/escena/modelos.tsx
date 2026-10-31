import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, LoopOnce, Vector3, type AnimationAction, type Group, type Object3D } from "three";
import { clone as clonarConEsqueleto } from "three/examples/jsm/utils/SkeletonUtils.js";
import { CONFIG } from "../config";

const m = CONFIG.modelos;

export const rutaCoche = (nombre: string) => `/modelos/coches/${nombre}.glb`;
export const rutaPersona = (nombre: string) => `/modelos/personas/${nombre}.glb`;
export const rutaPalmera = (nombre: string) => `/modelos/palmeras/${nombre}.glb`;
export const RUTA_MOTO_JUGADORA = "/modelos/moto.glb";
export const RUTA_MOTOCONCHO = "/modelos/motoconcho.glb";

[...m.coches, ...m.camiones].forEach((n) => useGLTF.preload(rutaCoche(n)));
m.personas.forEach((n) => useGLTF.preload(rutaPersona(n)));
export const RUTA_PROTAGONISTA = `/modelos/${CONFIG.protagonista.modelo}.glb`;
useGLTF.preload(RUTA_PROTAGONISTA);
m.palmeras.forEach((n) => useGLTF.preload(rutaPalmera(n)));
useGLTF.preload(RUTA_MOTO_JUGADORA);
useGLTF.preload(RUTA_MOTOCONCHO);

const seRepite = (nombre: string) => !/jump|die|death/i.test(nombre);

function conSombras(objeto: Object3D) {
  objeto.traverse((hijo) => {
    hijo.castShadow = true;
  });
  return objeto;
}

function medir(objeto: Object3D) {
  objeto.updateMatrixWorld(true);
  return new Box3().setFromObject(objeto);
}

function asentarEnElSuelo(objeto: Object3D, escala: number) {
  objeto.position.set(0, 0, 0);
  objeto.scale.setScalar(escala);
  const caja = medir(objeto);
  const centro = caja.getCenter(new Vector3());
  objeto.position.set(-centro.x, -caja.min.y, -centro.z);
  return objeto;
}

type PropsModelo = {
  ruta: string;
  escala?: number;
  largo?: number;
  alto?: number;
  giro?: number;
  velocidadRuedas?: () => number;
};

export function Modelo({ ruta, escala = 1, largo, alto, giro = Math.PI, velocidadRuedas }: PropsModelo) {
  const { scene } = useGLTF(ruta);
  const copia = useMemo(() => {
    const objeto = conSombras(scene.clone(true));
    let tamano = escala;
    if (largo || alto) {
      objeto.scale.setScalar(1);
      objeto.position.set(0, 0, 0);
      const medidas = medir(objeto).getSize(new Vector3());
      tamano = largo ? largo / medidas.z : alto! / medidas.y;
    }
    return asentarEnElSuelo(objeto, tamano);
  }, [scene, escala, largo, alto]);

  const ruedas = useMemo(() => {
    const lista: Object3D[] = [];
    copia.traverse((hijo) => {
      if (hijo.name.startsWith("wheel")) lista.push(hijo);
    });
    return lista;
  }, [copia]);

  useFrame((_, delta) => {
    if (!velocidadRuedas || ruedas.length === 0) return;
    const giroRueda = (velocidadRuedas() * Math.min(delta, 0.05)) / (0.3 * copia.scale.x);
    for (const rueda of ruedas) rueda.rotation.x += giroRueda;
  });

  return (
    <group rotation-y={giro}>
      <primitive object={copia} />
    </group>
  );
}

type PropsPersonaje = { ruta: string; animacion: string | (() => string); escala?: number; alto?: number };

export function Personaje({ ruta, animacion, escala = m.escalaPersonas, alto }: PropsPersonaje) {
  const { scene, animations } = useGLTF(ruta);
  const copia = useMemo(() => conSombras(clonarConEsqueleto(scene)), [scene]);
  const tamano = useMemo(() => (alto ? alto / medir(copia).getSize(new Vector3()).y : escala), [copia, alto, escala]);
  const grupo = useRef<Group>(null);
  const { actions } = useAnimations(animations, grupo);
  const actual = useRef<AnimationAction | null>(null);

  useFrame(() => {
    const nombre = typeof animacion === "function" ? animacion() : animacion;
    const accion = actions[nombre];
    if (!accion || accion === actual.current) return;
    if (!seRepite(nombre)) {
      accion.setLoop(LoopOnce, 1);
      accion.clampWhenFinished = true;
    }
    accion.reset().fadeIn(0.15).play();
    actual.current?.fadeOut(0.15);
    actual.current = accion;
  });

  return (
    <group ref={grupo} scale={tamano}>
      <primitive object={copia} />
    </group>
  );
}
