# Página para Jelly — Plan v3

## Concepto: "Todo lo que brilla"
Cada momento de este año tiene una luz: la fuente verde del primer beso, las luciérnagas,
los foquitos del campamento, el amanecer en el kayak, el girasol (un sol pequeño) y la vela del final.
**La página entera es un recorrido de luz**: el fondo cambia de noche → día → noche → amanecer → noche con vela
mientras haces scroll. Así todo tiene un hilo, no son fotos sueltas.

- Para: **Jenyfer — Jelly / boo**, cumple **24**. Firma: **Tu Pokie**.
- ~6 meses juntos, todo este año.

## Stack
**Astro + Tailwind + GSAP (ScrollTrigger) + Lenis** (scroll suave). Fotos convertidas a AVIF/WebP.
Luciérnagas y confeti en `<canvas>` ligero. Respeta `prefers-reduced-motion` (sin parallax/zoom, solo fundidos).
Diseñado primero para celular (vertical).

## Skills instaladas (`.claude/skills/`)
`frontend-design`, `ui-ux-pro-max`, y de Emil Kowalski: `animate`, `choreograph`, `emil-design-eng`,
`apple-design`, `animation-vocabulary`, `improve-animations`, `ask-emil`.

## Reglas de animación (Emil)
- Solo `transform` y `opacity` (fluido en celular). Curvas ease-out suaves, nada de rebotes exagerados salvo momentos juguetones.
- Cada sección: **una sola animación protagonista**; lo demás quieto. El texto entra *después* de la foto (no al mismo tiempo).
- Texto: frase por frase, nunca letra por letra (cansa).
- Ritmo: momentos rápidos y ligeros ↔ pausas largas (amanecer, regalo, final).

---

## Recorrido (orden cronológico)

### 0. Entrada — "Toca para empezar"
- **Visual:** pantalla negra, una sola chispa de luz respirando en el centro. Texto pequeño: "Para Jelly 🤍 · toca para empezar".
- **Por qué:** el navegador no deja sonar música sin un toque; además crea expectativa.
- **Animación:** al tocar, la chispa crece y se convierte en la llama de la portada; la música entra con fade-in de 3 s.

### 1. Portada — `04-cena-velita` (campamento del kayak)
- **Texto:** "Jelly." / "24 años." / "Esto es para ti."
- **Animación:** la foto se revela desde la llama hacia afuera (máscara circular que se abre), luz cálida.
  Las 3 líneas entran una tras otra (stagger). Indicador sutil "desliza ↓".
- **Luz:** noche cálida, ámbar.

### 2. El pretexto — `01-fuente-noche` (día del primer beso)
- **Texto:** "Ni nos gusta el futbol." / "Pero apoyamos a México… y ese fue nuestro pretexto." / "Esa noche fue mágica."
- **Animación:** el fondo se tiñe de verde (el de la fuente). La foto sube lentamente con un brillo verde detrás
  que "late" una vez. Al terminar la última frase aparece un corazoncito pequeño que flota y se va.
- **Luz:** noche verde.

### 3. Tlaxcala — día → noche de luciérnagas (`11-bosque-abrazo`, `10-piedra-canteada`)
Aquí resolvemos que no hay foto nocturna: **el scroll hace que caiga la noche**.
- **3a (de día):** las dos fotos como polaroids que caen y se acomodan sobre fondo verde/cielo.
  Texto corto: "Nuestra primera aventura."
- **3b (atardece):** al seguir bajando, el fondo pasa a azul noche, las fotos se oscurecen y se quedan atrás
  (parallax) mientras aparecen las luciérnagas una por una… hasta cientos.
- **3c (de noche):** "Tlaxcala, luces en la oscuridad…" → pausa → "Pero la que más brilla eres tú."
  En esta última frase las luciérnagas se juntan y forman un corazón por un momento, luego se dispersan.
- **Luz:** día → atardecer → noche estrellada.

### 4. Metepec — `08-metepec-selfie`, `03-metepec-letrero`
- **Texto:** "Y ahí me di cuenta de que quería mil aventuras más contigo."
- **Animación:** de la noche pasamos a día colorido. Las flores del letrero de Metepec (estilo papel/talavera)
  aparecen como ornamentos alrededor. Las dos fotos entran de lados opuestos y quedan una sobre otra.
- **Luz:** día alegre, colores mexicanos.

### 5. El kayak — `06-espejo-talavera` → `05-kayak-selfie` → `12-amanecer-kayak` → `07-desayuno-tazas`
Cuenta el viaje completo: noche de campamento → amanecer en el agua → desayuno.
- **5a Noche:** espejo de talavera; los foquitos de la foto parpadean (brillos sobre la imagen). Sin texto o mínimo.
- **5b El desastre:** selfie del kayak con un leve balanceo (como el agua).
  Texto: "Un kayak con poco control…" (toque divertido)
- **5c El amanecer (pausa grande):** foto a pantalla completa, zoom muy lento, el fondo de la página se vuelve dorado.
  Texto: "…pero el amanecer fue nuestro, y el más bonito."
- **5d Desayuno:** las dos tazas "brindan" (se acercan) al hacer scroll. Sin texto.
- **Luz:** noche de foquitos → amanecer dorado.

### 6. Gracias — `02-banca-lavanda`
- **Visual:** retrato de Jelly a un lado (en celular: arriba), fondo crema/lavanda, mucho aire.
- **Texto (frase por frase):**
  "Gracias por ser tan atenta, tan buena, tan cariñosa."
  "Gracias por descongelar un corazón que ya no sentía."
  "Tú darías la vuelta al mundo por cuidarme…"
  "…y yo daría otra por ti."
- **Animación:** la palabra "descongelar" pasa de tono frío (azul) a cálido (rosa) al aparecer. La última frase llega sola, con pausa.
- **Luz:** día suave.

### 7. El regalo — corazón con girasol (ilustración SVG, no la captura)
- **Visual:** un corazón de cristal con un girasol adentro, como el collar.
- **Animación:** el girasol florece pétalo por pétalo con el scroll; el corazón brilla al completarse.
- **Texto:** "Que todo lo que llegue sea mejor de lo que buscas, / dure más de lo que esperas / y te haga más feliz de lo que pudiste imaginar."
  Pequeño, debajo: "El que tienes en tus manos." (ella escanea el NFC con el collar enfrente)
- **Luz:** dorado (el girasol es el sol del día).

### 8. Final — la vela y el deseo (el momento estrella)
Todo se oscurece; queda una sola vela (la misma llama del inicio: se cierra el círculo). La música baja.
1. **Vela realista** (canvas): llama con parpadeo orgánico (ruido, no un loop), núcleo azul, halo cálido
   que ilumina el texto alrededor, la cera brilla bajo la llama.
2. "Feliz cumpleaños, Jelly." → "Pide un deseo."
3. **El deseo:** campo opcional "Escríbelo… o solo piénsalo". **No se guarda en ningún lado** —
   texto en pantalla: *"Nadie lo va a leer. Ni yo."* (romántico y sin base de datos).
4. **"Ahora sopla 🕯️"**
   - Con permiso de micrófono: la llama se inclina y tiembla según la fuerza del soplido; con un soplido fuerte se apaga.
   - Si no da permiso o falla: deslizar el dedo hacia arriba sobre la llama (o tocarla) también la apaga.
5. **Se apaga:** la llama se encoge, sale un hilo de humo que sube y se enrosca; 1 s de oscuridad y silencio.
6. **El deseo viaja:** una chispa sale del pabilo humeante, se convierte en luciérnaga y sube al cielo
   uniéndose a otras (eco del capítulo de Tlaxcala). Texto: **"Tu deseo está en camino ✨"**.
7. **Celebración:** la música vuelve a subir; lluvia de **pétalos de girasol** + confeti dorado/coral
   (no confeti genérico), destellos.
8. Cierre: "Te quiero, boo." / "— Tu Pokie" · botón pequeño "ver otra vez".
- **Luz:** oscuridad total → una vela → humo → explosión de luz cálida.

---

## Fotos usadas (10) / fuera
Usadas: 04, 01, 11, 10, 08, 03, 06, 05, 12, 07, 02 (11 en total).
Fuera: `09-jerseys-guino` (otra ocasión). Las capturas de MercadoLibre no se usan.

## Música
*You Are the Reason* — Calum Scott. Entra al tocar "empezar", volumen suave, botón para silenciar.
No se puede usar un link de YouTube Music como audio de la página (no permiten descargar ni reproducir su audio
dentro de otra página de forma oculta). Opciones:
1. **Recomendada:** comprarla en iTunes / Amazon Music (~$15–20 MXN) → te da el MP3/M4A → súbelo a la carpeta de Drive "09 JELLY".
2. Si no, usamos un embed visible de Spotify/YouTube (pequeño reproductor), pero se ve menos limpio y ella necesita sesión iniciada para la canción completa.

## Publicación + NFC
- **Fecha límite:** cumpleaños 25 de noviembre de 2026 (24 años). Página lista y probada el 24.
- **Hosting gratis que no caduca:** GitHub Pages (`erickddp.github.io/...`) o Vercel (`jelly-xxx.vercel.app`).
  Ojo: GitHub Pages gratis requiere repo **público** (las fotos quedarían visibles en GitHub);
  Vercel funciona con repo privado. Ninguno caduca mientras exista la cuenta.
- **Etiqueta NFC:** NTAG213/215 (las más comunes). Grabar el link con la app *NFC Tools* (Android/iPhone),
  registro tipo URL. Probar en su tipo de celular, y **solo después** bloquearla (lock) para que no se borre.
  iPhone XS+ la lee sola; en Android debe tener NFC activado.
  Recomendado: QR pequeñito escondido en la caja como respaldo.
- La página detecta si es antes del 25 y muestra una cuenta regresiva (opcional).
