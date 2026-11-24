// Luciérnagas en canvas. `density` (0..1) las va encendiendo una a una,
// `heart` (0..1) las junta en forma de corazón.

type Fly = {
  x: number; y: number; a: number; sp: number;
  phase: number; blink: number; size: number; t: number;
};

function makeSprite(): HTMLCanvasElement {
  const s = document.createElement('canvas');
  s.width = s.height = 64;
  const g = s.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,230,1)');
  grd.addColorStop(0.12, 'rgba(240,255,170,.95)');
  grd.addColorStop(0.35, 'rgba(205,255,110,.28)');
  grd.addColorStop(1, 'rgba(180,255,80,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return s;
}

export class Fireflies {
  density = 0;
  heart = 0;
  private ctx: CanvasRenderingContext2D;
  private flies: Fly[] = [];
  private sprite = makeSprite();
  private w = 0; private h = 0; private dpr = 1;
  private raf = 0; private running = false; private last = 0;

  constructor(private canvas: HTMLCanvasElement, count = 160) {
    this.ctx = canvas.getContext('2d')!;
    for (let i = 0; i < count; i++) {
      this.flies.push({
        x: Math.random(), y: Math.random(),
        a: Math.random() * Math.PI * 2,
        sp: 0.012 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        blink: 0.6 + Math.random() * 1.6,
        size: 10 + Math.random() * 16,
        t: (i / count) * Math.PI * 2,
      });
    }
    // orden aleatorio de aparición
    this.flies.sort(() => Math.random() - 0.5);
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = r.width; this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
  }

  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.draw(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() { this.running = false; cancelAnimationFrame(this.raf); }

  private draw(now: number) {
    const dt = Math.min((now - this.last) / 16.67, 3);
    this.last = now;
    const { ctx, w, h } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (this.density <= 0.001) return;
    ctx.globalCompositeOperation = 'lighter';

    const n = this.flies.length;
    const shown = this.density * n;
    const k = Math.min(w, h) / 40;          // tamaño del corazón
    const cx = w / 2, cy = h * 0.36;
    const hEase = this.heart < 0.5 ? 2 * this.heart ** 2 : 1 - (-2 * this.heart + 2) ** 2 / 2;
    const time = now / 1000;

    for (let i = 0; i < n; i++) {
      const vis = Math.max(0, Math.min(1, shown - i));
      if (vis <= 0) continue;
      const f = this.flies[i];
      // vagar suavemente
      f.a += (Math.random() - 0.5) * 0.25 * dt;
      f.x += (Math.cos(f.a) * f.sp * dt) / 60 * 4;
      f.y += (Math.sin(f.a) * f.sp * dt) / 60 * 4 - 0.00008 * dt;
      if (f.x < -0.05) f.x = 1.05; if (f.x > 1.05) f.x = -0.05;
      if (f.y < -0.05) f.y = 1.05; if (f.y > 1.05) f.y = -0.05;

      let px = f.x * w, py = f.y * h;
      if (hEase > 0) {
        const t = f.t;
        const hx = cx + 16 * Math.sin(t) ** 3 * k;
        const hy = cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k;
        const jx = Math.sin(time * 1.3 + f.phase) * 3;
        const jy = Math.cos(time * 1.1 + f.phase) * 3;
        px += (hx + jx - px) * hEase;
        py += (hy + jy - py) * hEase;
      }
      const b = Math.pow(0.5 + 0.5 * Math.sin(time * f.blink + f.phase), 2);
      const glow = Math.max(b, hEase * 0.8);
      const s = f.size * (0.55 + glow * 0.7);
      ctx.globalAlpha = vis * (0.18 + 0.82 * glow);
      ctx.drawImage(this.sprite, px - s / 2, py - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
