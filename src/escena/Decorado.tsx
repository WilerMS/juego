import { useMemo } from "react";
import { CONFIG } from "../config";
import { Modelo, Personaje, rutaPalmera, rutaPersona } from "./modelos";
import { CasaDeBarrio, COMBINACIONES } from "./CasaDeBarrio";

const { anchoCarril, largoTrozo } = CONFIG.carretera;
const d = CONFIG.decorado;
const bordeCarretera = anchoCarril * 1.5 + 0.3;
const centroAcera = bordeCarretera + d.anchoAcera / 2;
const BLANCO = "#fbf7ef";
const RUTA_POSTE = "/modelos/calle/electricity-pole.glb";
const RUTA_FAROLA = "/modelos/calle/light-curved.glb";
const RUTA_CONTENEDOR = "/modelos/calle/dumpster.glb";
const HIERRO = "#2b2b2b";

function alAzar<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function entre(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type DatosCasa = {
  x: number;
  z: number;
  giro: number;
  frente: number;
  fondo: number;
  pisos: number;
  color: string;
  colorPuerta: string;
  techoDeZinc: boolean;
  conBandera: boolean;
  deBarrio: { nombre: string; pared: string; tejado: string; x: number } | null;
};

function Ventana({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[1.3, 1.7, 0.06]} />
        <meshStandardMaterial color={BLANCO} />
      </mesh>
      <mesh position-z={0.05}>
        <boxGeometry args={[1, 1.4, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Balcon({ y, z, ancho }: { y: number; z: number; ancho: number }) {
  const barrotes = 6;
  return (
    <group position={[0, y, z]}>
      <mesh position-z={0.4}>
        <boxGeometry args={[ancho, 0.15, 0.8]} />
        <meshStandardMaterial color={BLANCO} />
      </mesh>
      <mesh position={[0, 0.85, 0.8]}>
        <boxGeometry args={[ancho, 0.08, 0.08]} />
        <meshStandardMaterial color={HIERRO} />
      </mesh>
      {Array.from({ length: barrotes }, (_, i) => (
        <mesh key={i} position={[-ancho / 2 + (i / (barrotes - 1)) * ancho, 0.45, 0.8]}>
          <boxGeometry args={[0.05, 0.8, 0.05]} />
          <meshStandardMaterial color={HIERRO} />
        </mesh>
      ))}
    </group>
  );
}

function Bandera({ x, y, z }: { x: number; y: number; z: number }) {
  const largo = 1.6;
  const alto = 1;
  const cruz = 0.16;
  const ancho = (largo - cruz) / 2;
  const altoCuadro = (alto - cruz) / 2;
  const cuadros = [
    { z: ancho / 2, y: -altoCuadro / 2, color: "#002d62" },
    { z: ancho + cruz + ancho / 2, y: -altoCuadro / 2, color: "#ce1126" },
    { z: ancho / 2, y: -(altoCuadro + cruz + altoCuadro / 2), color: "#ce1126" },
    { z: ancho + cruz + ancho / 2, y: -(altoCuadro + cruz + altoCuadro / 2), color: "#002d62" },
  ];
  return (
    <group position={[x, y, z]}>
      <mesh position-z={1} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
      <group position-z={0.3}>
        <mesh position={[0, -alto / 2, largo / 2]}>
          <boxGeometry args={[0.02, alto, largo]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {cuadros.map((c, i) => (
          <mesh key={i} position={[0, c.y, c.z]}>
            <boxGeometry args={[0.04, altoCuadro, ancho]} />
            <meshStandardMaterial color={c.color} />
          </mesh>
        ))}
        <mesh position={[0, -alto / 2, largo / 2]}>
          <boxGeometry args={[0.05, 0.14, 0.14]} />
          <meshStandardMaterial color="#2e7d32" />
        </mesh>
      </group>
    </group>
  );
}

function CasaDominicana({ x, z, giro, frente, fondo, pisos, color, colorPuerta, techoDeZinc, conBandera }: DatosCasa) {
  const alto = pisos * d.alturaPiso;
  const fachada = fondo / 2;
  return (
    <group position={[x, 0, z]} rotation-y={giro}>
      <mesh position-y={alto / 2} castShadow receiveShadow>
        <boxGeometry args={[frente, alto, fondo]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-y={0.3}>
        <boxGeometry args={[frente + 0.04, 0.6, fondo + 0.04]} />
        <meshStandardMaterial color={BLANCO} />
      </mesh>
      {techoDeZinc ? (
        <mesh position-y={alto + 0.35} rotation-x={-0.15}>
          <boxGeometry args={[frente + 0.3, 0.08, fondo + 0.8]} />
          <meshStandardMaterial color={d.colorZinc} metalness={0.6} roughness={0.4} />
        </mesh>
      ) : (
        <mesh position-y={alto}>
          <boxGeometry args={[frente + 0.2, 0.35, fondo + 0.2]} />
          <meshStandardMaterial color={BLANCO} />
        </mesh>
      )}
      <mesh position={[0, 1.15, fachada + 0.05]}>
        <boxGeometry args={[1.2, 2.3, 0.1]} />
        <meshStandardMaterial color={colorPuerta} />
      </mesh>
      {Array.from({ length: pisos }, (_, piso) => {
        const y = piso * d.alturaPiso;
        return (
          <group key={piso}>
            <Ventana x={-frente * 0.3} y={y + 1.8} z={fachada} color={colorPuerta} />
            <Ventana x={frente * 0.3} y={y + 1.8} z={fachada} color={colorPuerta} />
            {piso > 0 && <Balcon y={y} z={fachada} ancho={frente * 0.8} />}
          </group>
        );
      })}
      {conBandera && <Bandera x={frente / 2 - 0.6} y={alto - 0.3} z={fachada} />}
    </group>
  );
}

function Casa(datos: DatosCasa) {
  const barrio = datos.deBarrio;
  if (!barrio) return <CasaDominicana {...datos} />;
  return (
    <group position={[barrio.x, 0.15, datos.z]} rotation-y={datos.giro}>
      <CasaDeBarrio
        nombre={barrio.nombre}
        pared={barrio.pared}
        tejado={barrio.tejado}
        anchoMaximo={datos.frente - 0.4}
        extra={({ ancho, alto }) =>
          datos.conBandera && <Bandera x={ancho / 2 - 0.5} y={Math.min(alto - 0.6, 3.3)} z={0} />
        }
      />
    </group>
  );
}

function ObjetoDeCalle({ ruta, x, z, alto, giro }: { ruta: string; x: number; z: number; alto: number; giro: number }) {
  return (
    <group position={[x, 0.15, z]}>
      <Modelo ruta={ruta} alto={alto} giro={giro} />
    </group>
  );
}

export function Palmera({ x, z }: { x: number; z: number }) {
  const datos = useMemo(
    () => ({ nombre: alAzar(CONFIG.modelos.palmeras), giro: Math.random() * Math.PI * 2, alto: entre(0.85, 1.15) }),
    [],
  );
  return (
    <group position={[x, 0.15, z]}>
      <Modelo ruta={rutaPalmera(datos.nombre)} alto={CONFIG.modelos.altoPalmera * datos.alto} giro={datos.giro} />
    </group>
  );
}

type DatosPersona = { x: number; z: number; ruta: string; mirando: number };

function Persona({ x, z, ruta, mirando }: DatosPersona) {
  return (
    <group position={[x, 0.15, z]} rotation-y={mirando}>
      <Personaje ruta={ruta} animacion="idle" />
    </group>
  );
}

export function Decorado() {
  const cosas = useMemo(() => {
    const hueco = largoTrozo / d.casasPorTrozo;
    const casas: DatosCasa[] = [-1, 1].flatMap((lado) =>
      Array.from({ length: d.casasPorTrozo }, (_, i) => {
        const fondo = entre(5, 7);
        return {
          x: lado * (bordeCarretera + d.anchoAcera + fondo / 2),
          z: -largoTrozo / 2 + (i + 0.5) * hueco,
          giro: (-lado * Math.PI) / 2,
          frente: hueco - 0.2,
          fondo,
          pisos: 1 + Math.floor(Math.random() * d.pisosMaximos),
          color: alAzar(d.coloresCasas),
          colorPuerta: alAzar(d.coloresPuertas),
          techoDeZinc: Math.random() < 0.35,
          conBandera: Math.random() < d.probabilidadBandera,
          deBarrio:
            Math.random() < CONFIG.casas.probabilidadDeBarrio
              ? {
                  nombre: alAzar(CONFIG.casas.modelos),
                  ...alAzar(COMBINACIONES),
                  x: lado * (bordeCarretera + d.anchoAcera + 0.3),
                }
              : null,
        };
      }),
    );
    const palmeras = Array.from({ length: d.palmerasPorTrozo }, () => {
      const lado = Math.random() < 0.5 ? -1 : 1;
      return { x: lado * (bordeCarretera + 0.6), z: entre(-largoTrozo / 2, -largoTrozo / 6) };
    });
    const ladoAlAzar = () => (Math.random() < 0.5 ? -1 : 1);
    const objetos: { ruta: string; x: number; z: number; alto: number; giro: number }[] = [];
    if (Math.random() < d.probabilidadPosteDeLuz) {
      const lado = ladoAlAzar();
      objetos.push({ ruta: RUTA_POSTE, x: lado * (bordeCarretera + 0.35), z: entre(-3, 3), alto: 6.5, giro: Math.PI / 2 });
    }
    if (Math.random() < d.probabilidadFarola) {
      const lado = ladoAlAzar();
      objetos.push({ ruta: RUTA_FAROLA, x: lado * (bordeCarretera + 0.3), z: entre(5, 9), alto: 6, giro: (lado * Math.PI) / 2 });
    }
    if (Math.random() < d.probabilidadContenedor) {
      const lado = ladoAlAzar();
      objetos.push({ ruta: RUTA_CONTENEDOR, x: lado * (bordeCarretera + d.anchoAcera - 0.8), z: entre(-9, 9), alto: 1.4, giro: (-lado * Math.PI) / 2 });
    }
    const personas = Array.from({ length: d.personasPorTrozo }, () => {
      const lado = Math.random() < 0.5 ? -1 : 1;
      return {
        x: lado * (centroAcera + entre(-0.3, 0.9)),
        z: entre(-largoTrozo / 2, largoTrozo / 2),
        ruta: rutaPersona(alAzar(CONFIG.modelos.personas)),
        mirando: entre(0, Math.PI * 2),
      };
    });
    return { casas, palmeras, personas, objetos };
  }, []);

  return (
    <group>
      {[-1, 1].map((lado) => (
        <mesh key={lado} rotation-x={-Math.PI / 2} position={[lado * centroAcera, 0.15, 0]} receiveShadow>
          <planeGeometry args={[d.anchoAcera, largoTrozo]} />
          <meshStandardMaterial color={d.colorAcera} />
        </mesh>
      ))}
      {cosas.casas.map((c, i) => (
        <Casa key={i} {...c} />
      ))}
      {cosas.palmeras.map((p, i) => (
        <Palmera key={i} {...p} />
      ))}
      {cosas.personas.map((p, i) => (
        <Persona key={i} {...p} />
      ))}
      {cosas.objetos.map((o, i) => (
        <ObjetoDeCalle key={i} {...o} />
      ))}
    </group>
  );
}
