# Página para Jelly — Plan (borrador para decidir juntos)

## 1. Stack recomendado
**Astro + Tailwind + GSAP (+ Lenis para el scroll suave)**, TypeScript solo donde haga falta.
- Una sola página larga con scroll narrativo → Astro es ligero, rápido en celular (ella la abrirá en el cel).
- Tailwind para estilos rápidos; CSS propio para detalles finos (grano, brillos, tipografía).
- GSAP ScrollTrigger para animaciones por foto (revelados, parallax, texto que aparece palabra por palabra).
- Fotos optimizadas a AVIF/WebP automáticamente (las originales están en `public/photos-original/`).
- Música opcional (botón "con música") — *tú decides la canción*.

## 2. Skills instaladas (en `.claude/skills/`)
- `frontend-design` (oficial Anthropic) → dirección estética antes de codear.
- `ui-ux-pro-max` → paletas, pares tipográficos, presets GSAP, reglas de UX/accesibilidad.
- Pendientes (no se pudieron verificar aún): Taste Skill, Emil Kowalski (animaciones).

## 3. Las 12 fotos (revisadas) y orden propuesto
Hilo narrativo: **"un año/viaje juntos → lo que me enseñaste → feliz cumpleaños, te quiero"**.
Solo usaría **9–10**; marco cuáles son las más fuertes.

| # | Archivo | Qué se ve | Rol en la historia | Animación propuesta |
|---|---|---|---|---|
| 1 ⭐ | `04-cena-velita` | Jelly sonriendo de noche, velita, focos, tiendas azules | **Portada / apertura**: la vela = cumpleaños | Fade lento desde negro; la llama de la vela "enciende" la página |
| 2 | `02-banca-lavanda` | Jelly en banca de madera, paz ✌️, lavanda | "Así de tú eres: luz y paz" | Foto se revela con máscara que sube; texto a la izquierda |
| 3 ⭐ | `08-metepec-selfie` + `03-metepec-letrero` | Selfie en Metepec / los dos frente al letrero | "Donde empezamos a salir de aventura" | Parallax entre las dos, polaroid que cae |
| 4 | `01-fuente-noche` | Selfie bajo la fuente verde, lluvia | "Contigo hasta la lluvia es bonita" | Gotas sutiles + brillo verde de fondo |
| 5 ⭐ | `12-amanecer-kayak` | Amanecer en el agua, remo | Pausa emocional — **solo imagen, poco texto** | Pantalla completa, zoom lento (Ken Burns) |
| 6 | `05-kayak-selfie` | Selfie en kayak, chaleco rosa | "Contigo me atrevo a todo" | Slide con ligera inclinación |
| 7 | `07-desayuno-tazas` | Chilaquiles, tazas "Casa del Sol" | "Hasta lo simple contigo sabe mejor" | Tazas que "brindan" (se acercan al hacer scroll) |
| 8 ⭐ | `06-espejo-talavera` | Espejo de talavera, beso, luces | Momento romántico central | Marco de talavera que se dibuja; confeti de luces |
| 9 | `11-bosque-abrazo` | Abrazo en el pasto, ella con beso | "Mi lugar favorito es abrazándote" | Foto con corazón/respiración suave |
| 10 | `10-piedra-canteada` | Abrazo bajo cabaña, bosque | Cierre antes del mensaje final | Foto pequeña dentro de paisaje grande |
| 11 | `09-jerseys-guino` | Jerseys, lengua, guiño | Toque divertido (¿antes del final?) | Aparece con "pop" y rebote |
| Final | — | Pantalla oscura + vela | **Mensaje de "te quiero" + botón "sopla la vela"** | Confeti + corazones al soplar |

Descartaría o dejaría opcionales: la que está más borrosa (`01-fuente-noche` si prefieres menos fotos) y `08`/`03` (puede quedar solo una).
**Tú decides** cuáles quitar/dejar y el orden.

## 4. Dirección visual (propuesta, lo afinamos)
- Ambiente: **noche cálida de luces de feria** (como la foto de la velita y el espejo), no rosa cursi genérico.
- Paleta: vino/ciruela profundo + ámbar de foquitos + crema; acento coral (del chaleco rosa / talavera).
- Tipografía: serif editorial elegante para frases + manuscrita muy sutil para detalles.
- Detalles mexicanos (talavera, flores del letrero de Metepec) como ornamentos.

## 5. Preguntas para ti (así escribimos las palabras juntos)
1. ¿Cuántos años cumple y cómo le dices de cariño (Jelly, otro apodo)?
2. ¿Cuándo y dónde fue cada foto? (Metepec, Xochimilco, Piedra Canteada…, fechas aprox.)
3. Para cada foto: ¿qué recuerdo, chiste interno o sentimiento quieres poner?
4. ¿Tono: tierno y poético / divertido / mezcla?
5. ¿Qué cosas quieres agradecerle exactamente? (3–5 cosas concretas)
6. ¿Frase final exacta de "te quiero"? (la escribimos juntos)
7. ¿Música? ¿Canción que sea de ustedes?
8. ¿Dónde la publicamos? (link privado con contraseña/fecha de apertura sorpresa)
