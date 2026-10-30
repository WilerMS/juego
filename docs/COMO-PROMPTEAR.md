# Cómo pedirle cosas a la IA

Un *prompt* es lo que le escribes a la IA para que haga algo. Cuanto mejor lo explicas, mejor lo hace. Es como explicarle a un amigo un juego que se te ha ocurrido: si le dices solo "haz algo chulo", no sabe qué hacer; si le dices "quiero que cuando toque una estrella suene un ding y salgan chispas", lo clava.

## La receta

Un buen prompt suele tener tres cosas:

1. **Qué quieres** → "Quiero un enemigo"
2. **Cómo es** → "que sea un cubo rojo y vaya más lento que yo"
3. **Qué pasa** → "si me toca, pierdo una vida"

Junto: *"Quiero un enemigo que sea un cubo rojo, que me persiga un poco más lento que yo, y que si me toca pierda una vida. Empiezo con 3 vidas."*

## Trucos

- **Una cosa cada vez.** Pide algo, pruébalo, y luego lo siguiente. Si pides diez cosas a la vez, es más difícil saber qué ha salido mal.
- **Si algo no te gusta, dilo tal cual.** "El salto es demasiado alto", "el enemigo da miedo, hazlo más mono", "no se ve bien el contador".
- **Si algo se rompe**, cuéntale qué ves: "ahora la pantalla sale en blanco", "el personaje atraviesa los árboles".
- **Pregúntale cómo funciona algo.** "¿Cómo sabe el enemigo dónde estoy?" Tú también estás aprendiendo, no solo el juego.
- **Pídele ideas.** "Dame 5 ideas para que el juego sea más difícil."

## Ideas para empezar

- "Cambia mi personaje por un gato hecho con formas" 🐱
- "Haz que las estrellas suenen al cogerlas"
- "Añade un cronómetro: tengo 60 segundos para coger todas las estrellas"
- "Pon un enemigo que me persiga"
- "Haz que sea de noche y las estrellas brillen"
- "Que no pueda atravesar los árboles"
- "Pon plataformas flotantes a las que tenga que saltar"

## El panel de mandos

En `src/config.ts` están los números del juego. Puedes cambiarlos tú directamente sin pedírselo a nadie:

```ts
jugador: {
  color: "#ff6fb5",   // ← prueba "#3fa9f5" (azul) o "#ffcc00" (amarillo)
  velocidad: 6,       // ← más alto = más rápido
  salto: 8,           // ← más alto = saltas más
},
```
