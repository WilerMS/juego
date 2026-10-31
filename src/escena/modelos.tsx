import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, LoopOnce, Vector3, type AnimationAction, type Group, type Object3D } from "three";
import { clone as clonarConEsqueleto } from "three/examples/jsm/utils/SkeletonUtils.js";
import { CONFIG } from "../config";

const m = CONFIG.modelos;

export const rutaCoche = (nombre: string) => `/modelos/coches/${nombre}.glb`;
export const rutaPersona = (nombre: string) => `/modelos/personas/${nombre}.glb`;
export const RUTA_MOTO = "/modelos/moto.glb";

[...m.coches, ...m.camiones].forEach((n) => useGLTF.preload(rutaCoche(n)));
[m.personaje, ...m.personas].forEach((n) => useGLTF.preload(rutaPersona(n)));
useGLTF.preload(RUTA_MOTO);

const ANIMACIONES_UNA_VEZ = new Set(["jump", "die"]);

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

type PropsVehiculo = { ruta: string; escala?: number; largo?: number; giro?: number };

export function Vehiculo({ ruta, escala = 1, largo, giro = Math.PI }: PropsVehiculo) {
  const { scene } = useGLTF(ruta);
  const copia = useMemo(() => {
    const objeto = conSombras(scene.clone(true));
    let tamano = escala;
    if (largo) {
      objeto.scale.setScalar(1);
      objeto.position.set(0, 0, 0);
      tamano = largo / medir(objeto).getSize(new Vector3()).z;
    }
    return asentarEnElSuelo(objeto, tamano);
  }, [scene, escala, largo]);

  return (
    <group rotation-y={giro}>
      <primitive object={copia} />
    </group>
  );
}

type PropsPersonaje = { ruta: string; animacion: string | (() => string); escala?: number };

export function Personaje({ ruta, animacion, escala = m.escalaPersonas }: PropsPersonaje) {
  const { scene, animations } = useGLTF(ruta);
  const copia = useMemo(() => conSombras(clonarConEsqueleto(scene)), [scene]);
  const grupo = useRef<Group>(null);
  const { actions } = useAnimations(animations, grupo);
  const actual = useRef<AnimationAction | null>(null);

  useFrame(() => {
    const nombre = typeof animacion === "function" ? animacion() : animacion;
    const accion = actions[nombre];
    if (!accion || accion === actual.current) return;
    if (ANIMACIONES_UNA_VEZ.has(nombre)) {
      accion.setLoop(LoopOnce, 1);
      accion.clampWhenFinished = true;
    }
    accion.reset().fadeIn(0.15).play();
    actual.current?.fadeOut(0.15);
    actual.current = accion;
  });

  return (
    <group ref={grupo} scale={escala}>
      <primitive object={copia} />
    </group>
  );
}
