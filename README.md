# Nuestro juego 🎮

Un juego 3D que se juega en el navegador y que vamos creando **pidiéndoselo a la IA**.

Ahora mismo eres una cápsula rosa en un bosque y tienes que recoger 10 estrellas. A partir de aquí, el juego será lo que nosotros queramos.

## Jugar

- **Ordenador:** flechas o WASD para moverte, Espacio para saltar.
- **Móvil o tablet:** joystick abajo a la izquierda y botón *Saltar* a la derecha.

## Cómo lo creamos

1. Uno de los dos le escribe a Claude lo que quiere ("quiero que las estrellas sean corazones", "pon un enemigo que me persiga").
2. Claude cambia el código y explica qué ha hecho.
3. Lo probamos en local; si nos gusta, Wiler lo sube a GitHub.
4. Railway lo publica solo en un par de minutos y aparece en el link del juego.

La guía para escribir buenas peticiones está en [docs/COMO-PROMPTEAR.md](docs/COMO-PROMPTEAR.md), y las ideas pendientes en [docs/IDEAS.md](docs/IDEAS.md).

### Tocar el juego sin IA

Abre [`src/config.ts`](src/config.ts): ahí están todos los números del juego (color del personaje, velocidad, altura del salto, cuántas estrellas hay…). Cambia uno, guarda, y el juego se actualiza al momento.

## Desarrollo en local

```bash
npm install
npm run dev        # http://localhost:5173 (también accesible desde el móvil en la misma wifi)
npm run build      # comprueba tipos y genera dist/
npm start          # sirve dist/ como en Railway
```

## Despliegue en Railway

El proyecto ya trae [`railway.json`](railway.json): build con `npm run build` y arranque con `npm start` (que escucha en el `$PORT` que pone Railway).

1. Sube el proyecto a un repositorio de GitHub.
2. En Railway: *New Project → Deploy from GitHub repo* y elige el repo.
3. En el servicio: *Settings → Networking → Generate Domain*. Ese es el link para jugar.
4. Cada push a `main` vuelve a desplegar el juego automáticamente.

## Tecnología

Vite · React 19 · TypeScript · three.js con @react-three/fiber y @react-three/drei · serve en producción.
