import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';
import { Fireflies } from './fireflies';
import { Candle } from './candle';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

/* ---------------- Scroll suave ---------------- */
const lenis = new Lenis({ lerp: 0.09 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

/* ---------------- Música ---------------- */
const song = $<HTMLAudioElement>('#song');
const muteBtn = $<HTMLButtonElement>('#mute');
const vol = { v: 0 };
const MAX = 0.75;
let hasSong = false;
let muted = false;
const applyVol = () => { song.volume = muted ? 0 : Math.max(0, Math.min(1, vol.v)); };
fetch('/audio/cancion.mp3', { method: 'HEAD' })
  .then((r) => { hasSong = r.ok && (r.headers.get('content-type') || '').includes('audio'); })
  .catch(() => {});
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '♪̸' : '♪';
  muteBtn.setAttribute('aria-label', muted ? 'Activar música' : 'Silenciar música');
  applyVol();
});
function fadeMusic(to: number, duration: number) {
  if (!hasSong) return;
  gsap.to(vol, { v: to, duration, ease: 'sine.inOut', onUpdate: applyVol, overwrite: true });
}

/* ---------------- Cielo: cada capítulo tiene su luz ---------------- */
$$('[data-sky]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: (self) => {
      if (self.isActive) gsap.to('#sky', { backgroundColor: sec.dataset.sky, duration: 1.4, ease: 'sine.inOut', overwrite: 'auto' });
    },
  });
});

/* ---------------- Portada ---------------- */
function candleOrigin() {
  // la velita de la foto está en (70.8%, 93.7%) de la imagen original
  const box = $('#portada');
  const img = $<HTMLImageElement>('#portada img');
  const iw = img.naturalWidth || 960, ih = img.naturalHeight || 1280;
  const cw = box.clientWidth, ch = box.clientHeight;
  const sc = Math.max(cw / iw, ch / ih);
  const dw = iw * sc, dh = ih * sc;
  const px = (cw - dw) * 0.62 + 0.708 * dw;
  const py = (ch - dh) * 0.5 + 0.937 * dh;
  return `${((px / cw) * 100).toFixed(1)}% ${((py / ch) * 100).toFixed(1)}%`;
}

gsap.set('#portada .hl', { opacity: 0, y: 24 });

function intro() {
  const at = candleOrigin();
  const tl = gsap.timeline();
  tl.to('.spark', { scale: 3.2, duration: 0.7, ease: 'power2.in' })
    .to('#start .gate-text', { opacity: 0, duration: 0.4 }, 0)
    .to('#gate', { opacity: 0, duration: 0.9, ease: 'sine.inOut', onComplete: () => $('#gate').remove() }, 0.55)
    .fromTo('#portada .hero-photo',
      { clipPath: `circle(0% at ${at})` },
      { clipPath: `circle(150% at ${at})`, duration: reduce ? 0.6 : 2.4, ease: 'power2.inOut' }, 0.6)
    .to('#portada .hl', { opacity: 1, y: 0, duration: 1, stagger: 0.45, ease: 'power3.out' }, 1.9)
    .add(() => { document.body.classList.remove('locked'); lenis.start(); ScrollTrigger.refresh(); }, 2.4);
}

$('#start').addEventListener('click', () => {
  if (hasSong || song.src) {
    song.volume = 0;
    song.play().then(() => {
      hasSong = true;
      muteBtn.classList.add('show');
      fadeMusic(MAX, 4);
    }).catch(() => {});
  }
  intro();
}, { once: true });

/* ---------------- Revelados: primero la foto, luego las frases ---------------- */
const revealables = $$('.r-photo, .r-line');
gsap.set(revealables, { opacity: 0, y: 28 });
ScrollTrigger.batch(revealables, {
  start: 'top 86%',
  once: true,
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.55,
      onStart() {
        const thaw = batch.find((el) => el.querySelector('.thaw'));
        if (thaw) gsap.to('.thaw', { color: '#e0607e', duration: 2, delay: 1.2, ease: 'sine.inOut' });
      },
    });
  },
});

// "…y yo daría otra por ti." llega sola, con pausa
gsap.set('.r-last', { opacity: 0, y: 14 });
ScrollTrigger.create({
  trigger: '.r-last', start: 'top 85%', once: true,
  onEnter: () => gsap.to('.r-last', { opacity: 1, y: 0, duration: 1.8, delay: 1.1, ease: 'power2.out' }),
});

// corazoncito que flota en "Esa noche fue mágica."
gsap.set('.r-heart', { opacity: 0, scale: 0 });
ScrollTrigger.create({
  trigger: '.r-heart', start: 'top 90%', once: true,
  onEnter: () => {
    gsap.timeline({ delay: 1.6 })
      .to('.r-heart', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' })
      .to('.r-heart', { y: -70, x: 14, opacity: 0, duration: 2.6, ease: 'sine.in' }, '+=0.6');
  },
});

/* ---------------- Tlaxcala: el día se vuelve noche ---------------- */
const ff = new Fireflies($<HTMLCanvasElement>('#fireflies'), reduce ? 60 : 170);
new IntersectionObserver(([e]) => (e.isIntersecting ? ff.start() : ff.stop())).observe($('#tlaxcala'));

gsap.set(['#tlaxcala .day-caption', '#tlaxcala .n1', '#tlaxcala .n2'], { opacity: 0, y: 20 });
const tl = gsap.timeline({
  scrollTrigger: { trigger: '#tlaxcala', start: 'top top', end: '+=340%', pin: true, scrub: 1, onRefresh: () => ff.resize() },
  defaults: { ease: 'none' },
});
tl.fromTo('.ph-a', { y: '-115vh', rotation: -16 }, { y: 0, rotation: -5, duration: 1.2, ease: 'power2.out' }, 0)
  .fromTo('.ph-b', { y: '-115vh', rotation: 18 }, { y: 0, rotation: 4, duration: 1.2, ease: 'power2.out' }, 0.45)
  .to('#tlaxcala .day-caption', { opacity: 1, y: 0, duration: 0.8 }, 1.2)
  // atardece
  .to('#tlaxcala .day-caption', { opacity: 0, duration: 0.6 }, 3)
  .to('#tlaxcala .tl-dusk', { opacity: 1, duration: 1.4 }, 3)
  .to('#tlaxcala .tl-night', { opacity: 1, duration: 1.6 }, 4.1)
  .to('#tlaxcala .dim', { opacity: 0.6, duration: 2 }, 3.8)
  .to('#tlaxcala .photos', { scale: 0.84, y: '-6vh', opacity: 0.45, duration: 2.4 }, 4)
  // luciérnagas
  .to(ff, { density: 1, duration: 3.2 }, 4.6)
  .to('#tlaxcala .n1', { opacity: 1, y: 0, duration: 0.8 }, 5.6)
  .to('#tlaxcala .photos', { opacity: 0.12, duration: 1 }, 7)
  .to('#tlaxcala .n2', { opacity: 1, y: 0, duration: 0.8 }, 7.1)
  .to(ff, { heart: 1, duration: 1.6, ease: 'power1.inOut' }, 7.5)
  .to({}, { duration: 0.8 })
  .to(ff, { heart: 0, duration: 1.1, ease: 'power1.in' });

/* ---------------- Metepec ---------------- */
gsap.set('#metepec .duo .a', { x: '-70vw', rotation: -16, opacity: 0 });
gsap.set('#metepec .duo .b', { x: '70vw', rotation: 18, opacity: 0 });
$$<SVGElement>('#metepec .flower').forEach((f) => gsap.set(f, { scale: 0, rotation: -120 }));
ScrollTrigger.create({
  trigger: '#metepec', start: 'top 62%', once: true,
  onEnter: () => {
    const t = gsap.timeline();
    t.to('#metepec .duo .a', { x: 0, rotation: -4, opacity: 1, duration: 1.2, ease: 'power3.out' })
      .to('#metepec .duo .b', { x: 0, rotation: 5, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.35);
    $$<SVGElement>('#metepec .flower').forEach((f, i) => {
      const s = parseFloat(f.style.getPropertyValue('--s')) || 1;
      t.to(f, { scale: s, rotation: 0, duration: 1.1, ease: 'back.out(1.7)' }, 0.5 + i * 0.12);
      if (!reduce) gsap.to(f, { rotation: 360, duration: 70 + i * 9, repeat: -1, ease: 'none', delay: 1.8 + i * 0.12 });
    });
  },
});

/* ---------------- Amanecer ---------------- */
gsap.set(['#amanecer .a1', '#amanecer .a2'], { opacity: 0, y: 18 });
gsap.timeline({
  scrollTrigger: { trigger: '#amanecer', start: 'top top', end: '+=170%', pin: true, scrub: 1 },
  defaults: { ease: 'none' },
})
  .fromTo('#amanecer img', { scale: reduce ? 1 : 1.22 }, { scale: 1, duration: 3 }, 0)
  .to('#amanecer .a1', { opacity: 1, y: 0, duration: 0.6 }, 0.5)
  .to('#amanecer .a2', { opacity: 1, y: 0, duration: 0.6 }, 1.4)
  .to({}, { duration: 0.6 });

/* ---------------- Desayuno: chin-chin ---------------- */
gsap.set('.clink span', { opacity: 0 });
ScrollTrigger.create({
  trigger: '#desayuno .print', start: 'top 60%', once: true,
  onEnter: () => {
    gsap.timeline({ delay: 1.2, repeat: 1, repeatDelay: 0.5 })
      .fromTo('.clink', { scale: 0.4 }, { scale: 1.3, duration: 0.45, ease: 'power2.out' })
      .to('.clink span', { opacity: 1, duration: 0.12, stagger: 0.015 }, 0)
      .to('.clink span', { opacity: 0, duration: 0.35 }, 0.3);
  },
});

/* ---------------- El regalo: el girasol florece ---------------- */
gsap.set('#regalo .petal', { scale: 0, transformOrigin: '50% 100%' });
gsap.set('#regalo .seed', { scale: 0, transformOrigin: '50% 50%' });
gsap.set('#regalo .q', { opacity: 0, y: 14 });
gsap.set('#regalo .shine', { scale: 0, transformOrigin: '50% 50%' });
gsap.timeline({
  scrollTrigger: { trigger: '#regalo', start: 'top top', end: '+=260%', pin: true, scrub: 1 },
  defaults: { ease: 'none' },
})
  .to('#regalo .seed', { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0)
  .to('#regalo .petal.outer', { scale: 1, duration: 0.5, stagger: 0.09, ease: 'back.out(1.6)' }, 0.2)
  .to('#regalo .petal.inner', { scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.6)' }, 1.1)
  .to('#regalo .aura', { opacity: 0.85, duration: 0.6 }, 2.2)
  .to('#regalo .shine', { scale: 1, opacity: 1, rotation: 90, duration: 0.5 }, 2.4)
  .to('#regalo .shine', { scale: 0, opacity: 0, duration: 0.4 }, 2.95)
  .to('#regalo .q', { opacity: 1, y: 0, duration: 0.55, stagger: 0.55 }, 2.6)
  .to({}, { duration: 0.6 });
if (!reduce) gsap.to('#regalo .pendant', { rotation: 2.5, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 0%' });

/* ---------------- Final: la vela y el deseo ---------------- */
const candle = new Candle($<HTMLCanvasElement>('#candle'));
const wishSky = new Fireflies($<HTMLCanvasElement>('#wishsky'), 90);
const finalSec = $('#final');
candle.onLight = (l) => finalSec.style.setProperty('--lit', String(Math.min(1, l)));
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { candle.resize(); candle.start(); wishSky.start(); }
  else { wishSky.stop(); }
}, { threshold: 0.05 }).observe(finalSec);

ScrollTrigger.create({
  trigger: '#final', start: 'top 60%',
  onEnter: () => fadeMusic(0.18, 2.5),
  onLeaveBack: () => { if (candle.lit) fadeMusic(MAX, 2); },
});

function showStep(id: string) {
  const cur = $('#final .step.on');
  const next = $(`#${id}`);
  gsap.to(cur, {
    opacity: 0, y: -10, duration: 0.45, ease: 'power2.in',
    onComplete: () => {
      cur.classList.remove('on');
      next.classList.add('on');
      gsap.fromTo(next, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    },
  });
}

$('#b-wished').addEventListener('click', () => {
  const ta = $<HTMLTextAreaElement>('#wish');
  const text = ta.value.trim();
  if (text) {
    // el deseo se dobla y entra en la llama
    const r = ta.getBoundingClientRect();
    const fly = document.createElement('div');
    fly.className = 'wish-fly';
    fly.textContent = text;
    Object.assign(fly.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, padding: '.8rem 1rem' });
    document.body.append(fly);
    ta.style.visibility = 'hidden';
    ta.value = '';
    const p = candle.flamePoint();
    gsap.to(fly, {
      x: p.x - (r.left + r.width / 2), y: p.y - (r.top + r.height / 2),
      scale: 0.04, opacity: 0, duration: 1.5, ease: 'power2.in',
      onComplete: () => { fly.remove(); candle.receiveWish(); },
    });
    setTimeout(() => showStep('s-blow'), 1700);
  } else {
    candle.receiveWish();
    showStep('s-blow');
  }
});

/* micrófono: soplar de verdad */
let micStop: (() => void) | null = null;
$('#b-mic').addEventListener('click', async () => {
  const hint = $('#blow-hint');
  const btn = $<HTMLButtonElement>('#b-mic');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } });
    const ac = new AudioContext();
    const src = ac.createMediaStreamSource(stream);
    const an = ac.createAnalyser();
    an.fftSize = 1024;
    src.connect(an);
    const data = new Uint8Array(an.frequencyBinCount);
    let base = 0, frames = 0, hold = 0, last = performance.now(), raf = 0;
    btn.style.display = 'none';
    hint.textContent = 'Sopla fuerte, como a tu pastel 🎂';
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      an.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 1; i < 14; i++) sum += data[i];
      const low = sum / 13 / 255;
      if (frames < 25) { base = (base * frames + low) / (frames + 1); frames++; }
      const level = Math.max(0, (low - base) / Math.max(0.2, 1 - base));
      candle.targetWind = Math.max(0, Math.min(1, (level - 0.1) / 0.45));
      hold = level > 0.42 ? hold + dt : Math.max(0, hold - dt * 0.5);
      if (hold > 0.32) candle.extinguish();
      if (candle.lit) raf = requestAnimationFrame(loop);
      else micStop?.();
    };
    raf = requestAnimationFrame(loop);
    micStop = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      ac.close();
      candle.targetWind = 0;
      micStop = null;
    };
  } catch {
    btn.style.display = 'none';
    hint.textContent = 'Desliza el dedo hacia arriba sobre la llama para soplarla.';
  }
});

/* se apagó: el deseo viaja y celebramos */
const confettiCanvas = $<HTMLCanvasElement>('#confetti');
const party = confetti.create(confettiCanvas, { resize: true, useWorker: true });
const petalShape = confetti.shapeFromPath({ path: 'M0 10 C 3 0, 9 0, 12 10 C 9 20, 3 20, 0 10 Z' });

function celebrate() {
  const petals = { shapes: [petalShape], colors: ['#ffc21a', '#f4b400', '#ffd95a', '#e79a00'], scalar: 1.6 };
  const bits = { colors: ['#ffd38a', '#f2a3b3', '#ffffff', '#ffb54d'] };
  party({ ...petals, particleCount: 70, spread: 100, startVelocity: 42, origin: { x: 0.5, y: 0.75 } });
  party({ ...bits, particleCount: 90, spread: 120, startVelocity: 50, origin: { x: 0.5, y: 0.8 } });
  const end = Date.now() + 3200;
  let n = 0;
  const side = () => {
    if (n++ % 3) { requestAnimationFrame(side); return; }
    party({ ...petals, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.85 }, gravity: 0.6, drift: 0.4 });
    party({ ...petals, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.85 }, gravity: 0.6, drift: -0.4 });
    party({ ...bits, particleCount: 2, angle: 90, spread: 160, origin: { x: Math.random(), y: -0.05 }, gravity: 0.5, startVelocity: 8 });
    if (Date.now() < end) requestAnimationFrame(side);
  };
  side();
}

candle.onOut = () => {
  micStop?.();
  gsap.to('#s-blow', { opacity: 0, duration: 0.4 });
  // la chispa del deseo sube al cielo
  const p = candle.flamePoint();
  const spark = document.createElement('span');
  spark.className = 'spark';
  Object.assign(spark.style, { position: 'fixed', left: `${p.x - 7}px`, top: `${p.y + 14}px`, zIndex: '6', animation: 'none' });
  document.body.append(spark);
  const tlOut = gsap.timeline({ delay: 0.6 });
  tlOut
    .fromTo(spark, { scale: 0, opacity: 0 }, { scale: 0.7, opacity: 1, duration: 0.5 })
    .to(spark, { y: -p.y - 40, duration: 3.2, ease: 'power1.in' }, 0.4)
    .to(spark, { keyframes: [{ x: 18 }, { x: -14 }, { x: 10 }, { x: 0 }], duration: 3.2, ease: 'sine.inOut' }, 0.4)
    .to(wishSky, { density: 0.55, duration: 3 }, 1.4)
    .add(() => {
      spark.remove();
      $('#s-blow').classList.remove('on');
      const done = $('#s-done');
      done.classList.add('on');
      gsap.set(['#s-done .d1', '#s-done .d2', '#s-done .d3', '#s-done .d4'], { opacity: 0, y: 14 });
      gsap.timeline()
        .to('#s-done .d1', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .add(() => { fadeMusic(MAX, 3); celebrate(); }, 0.9)
        .to('#s-done .d2', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 2.6)
        .to('#s-done .d3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 3.6)
        .to('#s-done .d4', { opacity: 1, y: 0, duration: 0.8 }, 5.2);
    }, 3.4);
};

$('#b-again').addEventListener('click', () => {
  scrollTo(0, 0);
  location.reload();
});

// los pins agregan espacio: recalcular todo en orden de página
ScrollTrigger.sort();
ScrollTrigger.refresh();
addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
