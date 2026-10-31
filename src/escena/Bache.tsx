import { useMemo } from "react";
import { Shape, Vector2 } from "three";
import { CONFIG } from "../config";
import { useAsfalto } from "./texturas";

const o = CONFIG.obstaculos;
const PUNTOS = 22;
const ACOSTADO = -Math.PI / 2;

function entre(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function contorno(radios: number[], escala: number, desplazamiento = new Vector2()) {
  const forma = new Shape();
  radios.forEach((r, i) => {
    const angulo = (i / PUNTOS) * Math.PI * 2;
    const x = Math.cos(angulo) * r * escala * 1.3 + desplazamiento.x;
    const y = Math.sin(angulo) * r * escala * 0.85 + desplazamiento.y;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  });
  forma.closePath();
  return forma;
}

function crearBache() {
  const fase = Math.random() * 10;
  const radios = Array.from({ length: PUNTOS }, (_, i) => {
    const angulo = (i / PUNTOS) * Math.PI * 2;
    const ondas = Math.sin(angulo * 2 + fase) * 0.15 + Math.sin(angulo * 5 + fase * 2) * 0.08;
    return o.tamanoBache * (1 + ondas + entre(-0.12, 0.12));
  });

  const grietas = Array.from({ length: o.grietasPorBache }, () => {
    const i = Math.floor(Math.random() * PUNTOS);
    const angulo = (i / PUNTOS) * Math.PI * 2;
    const inicio = new Vector2(Math.cos(angulo) * radios[i] * 1.3, Math.sin(angulo) * radios[i] * 0.85);
    const tramos: { x: number; y: number; largo: number; giro: number }[] = [];
    let punto = inicio.clone();
    let direccion = angulo;
    for (let t = 0; t < 3; t++) {
      direccion += entre(-0.6, 0.6);
      const largo = entre(0.2, 0.55);
      const fin = new Vector2(punto.x + Math.cos(direccion) * largo, punto.y + Math.sin(direccion) * largo);
      tramos.push({ x: (punto.x + fin.x) / 2, y: (punto.y + fin.y) / 2, largo, giro: direccion });
      punto = fin;
    }
    return tramos;
  });

  const escombros = Array.from({ length: o.escombrosPorBache }, () => {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = o.tamanoBache * entre(0.9, 1.6);
    return {
      x: Math.cos(angulo) * distancia * 1.3,
      z: -Math.sin(angulo) * distancia * 0.85,
      tamano: entre(0.06, 0.16),
      giro: Math.random() * Math.PI,
      deTierra: Math.random() < 0.5,
    };
  });

  const haciaDelante = new Vector2(entre(-0.05, 0.05), -o.tamanoBache * 0.22);

  return {
    borde: contorno(radios, 1.3),
    hueco: contorno(radios, 1),
    fondo: contorno(radios, 0.8, haciaDelante),
    charco: Math.random() < o.probabilidadCharco ? contorno(radios, 0.5, haciaDelante) : null,
    grietas: grietas.flat(),
    escombros,
  };
}

export function Bache() {
  const bache = useMemo(crearBache, []);
  const asfalto = useAsfalto(1, 1);

  return (
    <group position-y={0.012}>
      <mesh rotation-x={ACOSTADO} position-y={0.013} receiveShadow>
        <shapeGeometry args={[bache.borde]} />
        <meshStandardMaterial color={o.colorTierraBache} normalMap={asfalto.normalMap} roughness={1} />
      </mesh>
      <mesh rotation-x={ACOSTADO} position-y={0.016}>
        <shapeGeometry args={[bache.hueco]} />
        <meshStandardMaterial color={o.colorParedBache} normalMap={asfalto.normalMap} roughness={1} />
      </mesh>
      <mesh rotation-x={ACOSTADO} position-y={0.019}>
        <shapeGeometry args={[bache.fondo]} />
        <meshStandardMaterial color={o.colorFondoBache} normalMap={asfalto.normalMap} roughness={1} />
      </mesh>
      {bache.charco && (
        <mesh rotation-x={ACOSTADO} position-y={0.022}>
          <shapeGeometry args={[bache.charco]} />
          <meshStandardMaterial color={o.colorCharco} roughness={0.08} metalness={0.25} />
        </mesh>
      )}
      {bache.grietas.map((g, i) => (
        <mesh key={i} position={[g.x, 0.014, -g.y]} rotation={[ACOSTADO, 0, g.giro]}>
          <planeGeometry args={[g.largo + 0.03, 0.035]} />
          <meshStandardMaterial color="#2a1c10" />
        </mesh>
      ))}
      {bache.escombros.map((e, i) => (
        <mesh key={i} position={[e.x, e.tamano * 0.4, e.z]} rotation-y={e.giro} scale={[1, 0.5, 1]} castShadow>
          <dodecahedronGeometry args={[e.tamano, 0]} />
          <meshStandardMaterial
            color={e.deTierra ? o.colorTierraBache : "#b8b2aa"}
            map={e.deTierra ? null : asfalto.map}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}
