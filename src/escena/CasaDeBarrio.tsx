import { useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Source, Vector3, type Mesh, type MeshStandardMaterial, type Texture } from "three";
import { CONFIG } from "../config";

const c = CONFIG.casas;
export const rutaCasa = (nombre: string) => `/modelos/casas/${nombre}.glb`;
c.modelos.forEach((n) => useGLTF.preload(rutaCasa(n)));

function alAzar<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

export const COMBINACIONES = Array.from({ length: c.combinacionesDeColor }, () => ({
  pared: alAzar(CONFIG.decorado.coloresCasas),
  tejado: alAzar(c.coloresTejado),
}));

function aRGB(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const paletas = new Map<string, Texture>();

function pintarPaleta(original: Texture, pared: string, tejado: string) {
  const clave = `${pared}${tejado}`;
  const guardada = paletas.get(clave);
  if (guardada) return guardada;

  const lado = 256;
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = lado;
  const pincel = lienzo.getContext("2d")!;
  pincel.drawImage(original.image as CanvasImageSource, 0, 0, lado, lado);
  const imagen = pincel.getImageData(0, 0, lado, lado);
  const p = imagen.data;
  const colorPared = aRGB(pared);
  const colorTejado = aRGB(tejado);

  for (let i = 0; i < p.length; i += 4) {
    const [r, g, b] = [p[i], p[i + 1], p[i + 2]];
    const luz = 0.3 * r + 0.59 * g + 0.11 * b;
    let nuevo: number[] | null = null;
    let fuerza = 1;
    if (Math.min(r, g, b) > 170 && Math.max(r, g, b) - Math.min(r, g, b) < 35) {
      nuevo = colorPared;
      fuerza = luz / 255;
    } else if (g > r + 50 && g > b + 30) {
      nuevo = colorTejado;
      fuerza = luz / 165;
    }
    if (nuevo) {
      p[i] = Math.min(255, nuevo[0] * fuerza);
      p[i + 1] = Math.min(255, nuevo[1] * fuerza);
      p[i + 2] = Math.min(255, nuevo[2] * fuerza);
    }
  }
  pincel.putImageData(imagen, 0, 0);

  const textura = original.clone();
  textura.source = new Source(lienzo);
  textura.needsUpdate = true;
  paletas.set(clave, textura);
  return textura;
}

type Medidas = { ancho: number; alto: number };
type Props = {
  nombre: string;
  pared: string;
  tejado: string;
  anchoMaximo: number;
  extra?: (medidas: Medidas) => ReactNode;
};

export function CasaDeBarrio({ nombre, pared, tejado, anchoMaximo, extra }: Props) {
  const { scene } = useGLTF(rutaCasa(nombre));

  const casa = useMemo(() => {
    const copia = scene.clone(true);
    copia.traverse((hijo) => {
      const malla = hijo as Mesh;
      if (!malla.isMesh) return;
      const material = (malla.material as MeshStandardMaterial).clone();
      if (material.map) material.map = pintarPaleta(material.map, pared, tejado);
      malla.material = material;
      malla.castShadow = true;
      malla.receiveShadow = true;
    });
    const tamano = new Box3().setFromObject(copia).getSize(new Vector3());
    const escala = Math.min(c.escala, anchoMaximo / tamano.x);
    copia.scale.setScalar(escala);
    copia.updateMatrixWorld(true);
    const caja = new Box3().setFromObject(copia);
    const centro = caja.getCenter(new Vector3());
    copia.position.set(-centro.x, -caja.min.y, -caja.max.z);
    return { objeto: copia, ancho: tamano.x * escala, alto: tamano.y * escala };
  }, [scene, pared, tejado, anchoMaximo]);

  return (
    <group>
      <primitive object={casa.objeto} />
      {extra?.({ ancho: casa.ancho, alto: casa.alto })}
    </group>
  );
}
