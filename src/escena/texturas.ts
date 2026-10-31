import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { RepeatWrapping, SRGBColorSpace } from "three";
import { CONFIG } from "../config";

const RUTAS = { map: "/texturas/asfalto.jpg", normalMap: "/texturas/asfalto-relieve.jpg" };
useTexture.preload(Object.values(RUTAS));

export function useAsfalto(ancho: number, largo: number) {
  const base = useTexture(RUTAS);
  return useMemo(() => {
    const tamano = CONFIG.carretera.tamanoTexturaAsfalto;
    const map = base.map.clone();
    const normalMap = base.normalMap.clone();
    for (const textura of [map, normalMap]) {
      textura.wrapS = textura.wrapT = RepeatWrapping;
      textura.repeat.set(ancho / tamano, largo / tamano);
      textura.needsUpdate = true;
    }
    map.colorSpace = SRGBColorSpace;
    return { map, normalMap };
  }, [base, ancho, largo]);
}
