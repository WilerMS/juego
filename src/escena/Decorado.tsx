import { useMemo } from "react";
import { CONFIG } from "../config";

const { anchoCarril, largoTrozo } = CONFIG.carretera;
const d = CONFIG.decorado;
const bordeCarretera = anchoCarril * 1.5 + 0.3;
const centroAcera = bordeCarretera + d.anchoAcera / 2;

function alAzar<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function entre(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function Edificio({ x, z, alto, ancho, color }: { x: number; z: number; alto: number; ancho: number; color: string }) {
  const filas = Math.floor(alto / 2);
  return (
    <group position={[x, 0, z]}>
      <mesh position-y={alto / 2} castShadow receiveShadow>
        <boxGeometry args={[ancho, alto, ancho]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {Array.from({ length: filas }, (_, i) => (
        <mesh key={i} position={[0, 1.5 + i * 2, 0]}>
          <boxGeometry args={[ancho + 0.05, 0.6, ancho * 0.7]} />
          <meshStandardMaterial color="#d7f0ff" emissive="#9fd3ff" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Persona({ x, z, color, mirando }: { x: number; z: number; color: string; mirando: number }) {
  return (
    <group position={[x, 0.15, z]} rotation-y={mirando}>
      <mesh position-y={0.75} castShadow>
        <capsuleGeometry args={[0.25, 0.7, 6, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-y={1.6} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
      <mesh position={[0.4, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.45, 0.3]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
    </group>
  );
}

export function Decorado() {
  const cosas = useMemo(() => {
    const hueco = largoTrozo / d.edificiosPorTrozo;
    const edificios = [-1, 1].flatMap((lado) =>
      Array.from({ length: d.edificiosPorTrozo }, (_, i) => {
        const ancho = entre(4, 6);
        return {
          x: lado * (bordeCarretera + d.anchoAcera + ancho / 2 + 0.5),
          z: -largoTrozo / 2 + (i + 0.5) * hueco,
          alto: entre(d.alturaMinimaEdificio, d.alturaMaximaEdificio),
          ancho,
          color: alAzar(d.coloresEdificios),
        };
      }),
    );
    const personas = Array.from({ length: d.personasPorTrozo }, () => {
      const lado = Math.random() < 0.5 ? -1 : 1;
      return {
        x: lado * (centroAcera + entre(-0.6, 0.6)),
        z: entre(-largoTrozo / 2, largoTrozo / 2),
        color: alAzar(d.coloresRopa),
        mirando: entre(0, Math.PI * 2),
      };
    });
    return { edificios, personas };
  }, []);

  return (
    <>
      {[-1, 1].map((lado) => (
        <mesh key={lado} rotation-x={-Math.PI / 2} position={[lado * centroAcera, 0.15, 0]} receiveShadow>
          <planeGeometry args={[d.anchoAcera, largoTrozo]} />
          <meshStandardMaterial color={d.colorAcera} />
        </mesh>
      ))}
      {cosas.edificios.map((e, i) => (
        <Edificio key={i} {...e} />
      ))}
      {cosas.personas.map((p, i) => (
        <Persona key={i} {...p} />
      ))}
    </>
  );
}
