// Vela de cumpleaños en canvas: llama con parpadeo orgánico, reacciona al
// "viento" (micrófono o dedo), se apaga con brasa y humo.

type Smoke = { x: number; y: number; vx: number; vy: number; r: number; life: number; age: number; seed: number };

export class Candle {
  wind = 0;            // viento suavizado 0..1
  targetWind = 0;      // viento objetivo (micrófono / dedo)
  lit = true;
  onOut: (() => void) | null = null;
  onLight: ((l: number) => void) | null = null;

  private ctx: CanvasRenderingContext2D;
  private w = 0; private h = 0; private dpr = 1;
  private flame = 1;     // escala de la llama
  private flare = 0;     // destello al recibir el deseo
  private ember = 0;     // brasa del pabilo
  private smoke: Smoke[] = [];
  private smokeUntil = 0;
  private raf = 0; private running = false; private last = 0;
  private seeds = Array.from({ length: 6 }, () => Math.random() * 100);
  private drag: { y: number; id: number } | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    addEventListener('resize', () => this.resize());
    this.bindSwipe();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = r.width; this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
  }

  /** geometría de la vela, en px del canvas */
  private geo() {
    const ch = Math.min(this.h * 0.36, 190);
    const cw = Math.max(26, Math.min(34, this.w * 0.08));
    const x = this.w / 2;
    const bottom = this.h - 6;
    const top = bottom - ch;
    return { x, top, bottom, cw, ch, wickTop: top - 13 };
  }

  /** posición de la llama en coordenadas de la ventana */
  flamePoint() {
    const r = this.canvas.getBoundingClientRect();
    const g = this.geo();
    return { x: r.left + g.x, y: r.top + g.wickTop - 24 };
  }

  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.step(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }

  receiveWish() { this.flare = 1; }

  extinguish() {
    if (!this.lit) return;
    this.lit = false;
    this.ember = 1;
    this.smokeUntil = performance.now() + 2800;
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => this.onOut?.(), 900);
  }

  private bindSwipe() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      if (!this.lit) return;
      this.drag = { y: e.clientY, id: e.pointerId };
      c.setPointerCapture(e.pointerId);
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const dy = this.drag.y - e.clientY;
      this.targetWind = Math.max(0, Math.min(1, dy / 110));
      if (dy > 85) { this.drag = null; this.extinguish(); }
    });
    const end = () => { this.drag = null; this.targetWind = 0; };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
  }

  private noise(t: number, i: number) {
    const s = this.seeds[i];
    return (Math.sin(t * 7.3 + s) * 0.5 + Math.sin(t * 13.1 + s * 2) * 0.3 + Math.sin(t * 23.7 + s * 3) * 0.2);
  }

  private step(now: number) {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const t = now / 1000;

    this.wind += (this.targetWind - this.wind) * Math.min(1, dt * 10);
    if (!this.lit) this.flame = Math.max(0, this.flame - dt * 6);
    this.flare = Math.max(0, this.flare - dt * 1.2);
    if (!this.lit) this.ember = Math.max(0, this.ember - dt * 0.55);

    const g = this.geo();
    // humo
    if (now < this.smokeUntil) {
      const rate = (this.smokeUntil - now) / 2800;
      for (let i = 0; i < 3; i++) {
        if (Math.random() < rate + 0.15) {
          this.smoke.push({
            x: g.x + (Math.random() - 0.5) * 2, y: g.wickTop,
            vx: (Math.random() - 0.5) * 6, vy: -(28 + Math.random() * 26),
            r: 1.5 + Math.random() * 1.5, life: 1, age: 0, seed: Math.random() * 10,
          });
        }
      }
    }
    for (const p of this.smoke) {
      p.age += dt;
      p.x += (p.vx + Math.sin(p.age * 2.6 + p.seed) * 14 * p.age + 6) * dt;
      p.y += p.vy * dt;
      p.vy *= 0.995;
      p.r += dt * 5;
      p.life -= dt * 0.38;
    }
    this.smoke = this.smoke.filter((p) => p.life > 0);

    const light = Math.max(this.flame * (1 + this.flare * 0.6) * (1 - this.wind * 0.3), this.ember * 0.12);
    this.onLight?.(light);
    this.draw(t, g, light);

    if (!this.lit && this.flame <= 0 && this.ember <= 0 && this.smoke.length === 0) this.stop();
  }

  private draw(t: number, g: ReturnType<Candle['geo']>, light: number) {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    const flick = 1 + this.noise(t, 0) * 0.06 + (Math.random() - 0.5) * 0.02;
    const fx = g.x, fy = g.wickTop + 3;

    // halo cálido
    if (light > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      const R = 240 * (0.85 + light * 0.25) * flick;
      const grd = ctx.createRadialGradient(fx, fy - 20, 0, fx, fy - 20, R);
      grd.addColorStop(0, `rgba(255,190,100,${0.42 * light})`);
      grd.addColorStop(0.3, `rgba(255,140,50,${0.16 * light})`);
      grd.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = 'source-over';
    }

    this.drawCandle(g, light);
    this.drawSmoke();

    // pabilo
    ctx.strokeStyle = '#2a1a10';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(g.x, g.top + 2);
    ctx.quadraticCurveTo(g.x + 1, g.top - 6, g.x + 2.5, g.wickTop);
    ctx.stroke();
    if (this.ember > 0) {
      ctx.globalCompositeOperation = 'lighter';
      const e = ctx.createRadialGradient(g.x + 2.5, g.wickTop, 0, g.x + 2.5, g.wickTop, 7);
      e.addColorStop(0, `rgba(255,120,40,${this.ember})`);
      e.addColorStop(1, 'rgba(255,60,0,0)');
      ctx.fillStyle = e;
      ctx.beginPath(); ctx.arc(g.x + 2.5, g.wickTop, 7, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    if (this.flame > 0.01) this.drawFlame(t, fx, fy, flick);
  }

  private drawCandle(g: ReturnType<Candle['geo']>, light: number) {
    const { ctx } = this;
    const { x, top, bottom, cw } = g;
    const left = x - cw / 2;
    const r = 5;
    const body = new Path2D();
    body.moveTo(left, top + r);
    body.quadraticCurveTo(left, top, left + r, top);
    body.lineTo(left + cw - r, top);
    body.quadraticCurveTo(left + cw, top, left + cw, top + r);
    body.lineTo(left + cw, bottom);
    body.lineTo(left, bottom);
    body.closePath();

    ctx.save();
    ctx.clip(body);
    // cera
    ctx.fillStyle = '#fbefe2';
    ctx.fillRect(left, top, cw, bottom - top);
    // espiral rosa (vela de cumpleaños)
    ctx.fillStyle = '#ef8fa6';
    const step = 30;
    for (let yy = top - cw * 2; yy < bottom + cw; yy += step) {
      ctx.beginPath();
      ctx.moveTo(left, yy);
      ctx.lineTo(left + cw, yy - cw * 0.9);
      ctx.lineTo(left + cw, yy - cw * 0.9 + 11);
      ctx.lineTo(left, yy + 11);
      ctx.closePath();
      ctx.fill();
    }
    // volumen
    const vol = ctx.createLinearGradient(left, 0, left + cw, 0);
    vol.addColorStop(0, 'rgba(60,20,20,.55)');
    vol.addColorStop(0.35, 'rgba(255,255,255,.18)');
    vol.addColorStop(0.55, 'rgba(255,255,255,0)');
    vol.addColorStop(1, 'rgba(40,10,10,.6)');
    ctx.fillStyle = vol;
    ctx.fillRect(left, top, cw, bottom - top);
    // la cera brilla bajo la llama
    if (light > 0.01) {
      const glow = ctx.createLinearGradient(0, top, 0, top + 70);
      glow.addColorStop(0, `rgba(255,190,110,${0.75 * light})`);
      glow.addColorStop(1, 'rgba(255,170,90,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(left, top, cw, 70);
    }
    // oscurecer hacia abajo
    const fade = ctx.createLinearGradient(0, top, 0, bottom);
    fade.addColorStop(0, 'rgba(5,3,7,0)');
    fade.addColorStop(1, 'rgba(5,3,7,.85)');
    ctx.fillStyle = fade;
    ctx.fillRect(left, top, cw, bottom - top);
    ctx.restore();

    // charquito de cera arriba
    ctx.fillStyle = light > 0.01 ? `rgba(255,236,205,${0.6 + 0.4 * light})` : 'rgba(220,205,190,.8)';
    ctx.beginPath();
    ctx.ellipse(x, top + 1.5, cw / 2 - 1, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // escurrimiento
    ctx.beginPath();
    ctx.moveTo(left + 4, top + 1);
    ctx.quadraticCurveTo(left + 3, top + 14, left + 5, top + 22);
    ctx.quadraticCurveTo(left + 8, top + 26, left + 9, top + 18);
    ctx.quadraticCurveTo(left + 10, top + 8, left + 11, top + 1);
    ctx.fill();
  }

  private drawSmoke() {
    const { ctx } = this;
    for (const p of this.smoke) {
      ctx.fillStyle = `rgba(200,196,205,${0.13 * p.life * Math.min(1, p.age * 6)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawFlame(t: number, fx: number, fy: number, flick: number) {
    const { ctx } = this;
    const wnd = this.wind;
    const s = this.flame * (1 + this.flare * 0.45);
    const H = 58 * s * flick * (1 - wnd * 0.45) * (1 + this.noise(t, 1) * 0.07);
    const W = 12.5 * s * (1 + this.noise(t, 2) * 0.06) * (1 + wnd * 0.25);
    const shake = wnd > 0.05 ? Math.sin(t * 38) * 9 * wnd : 0;
    const lean = this.noise(t, 3) * 2.6 + wnd * 22 + shake;
    const tipX = fx + lean, tipY = fy - H;

    const shape = (scaleW: number, scaleH: number) => {
      const h = H * scaleH, w = W * scaleW;
      const tx = fx + lean * scaleH, ty = fy - h;
      const p = new Path2D();
      p.moveTo(fx, fy + 5 * scaleH);
      p.bezierCurveTo(fx + w * 1.15, fy + 2, fx + w * 0.75 + lean * 0.25, fy - h * 0.55, tx, ty);
      p.bezierCurveTo(fx - w * 0.75 + lean * 0.25, fy - h * 0.55, fx - w * 1.15, fy + 2, fx, fy + 5 * scaleH);
      return p;
    };

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // capa exterior
    const outer = ctx.createRadialGradient(fx, fy - H * 0.25, 1, fx + lean * 0.3, fy - H * 0.35, H * 0.95);
    outer.addColorStop(0, 'rgba(255,250,230,.95)');
    outer.addColorStop(0.25, 'rgba(255,225,140,.9)');
    outer.addColorStop(0.55, 'rgba(255,160,60,.75)');
    outer.addColorStop(0.85, 'rgba(255,100,20,.35)');
    outer.addColorStop(1, 'rgba(255,80,0,0)');
    ctx.shadowColor = 'rgba(255,150,50,.9)';
    ctx.shadowBlur = 28;
    ctx.fillStyle = outer;
    ctx.fill(shape(1, 1));
    ctx.shadowBlur = 0;

    // núcleo
    const core = ctx.createLinearGradient(0, fy, 0, fy - H * 0.6);
    core.addColorStop(0, 'rgba(255,255,250,.0)');
    core.addColorStop(0.25, 'rgba(255,255,245,.85)');
    core.addColorStop(1, 'rgba(255,245,210,.0)');
    ctx.fillStyle = core;
    ctx.fill(shape(0.45, 0.62));

    // base azul
    const blue = ctx.createRadialGradient(fx, fy + 1, 0, fx, fy + 1, W * 0.9);
    blue.addColorStop(0, 'rgba(110,150,255,.75)');
    blue.addColorStop(1, 'rgba(60,90,255,0)');
    ctx.fillStyle = blue;
    ctx.beginPath();
    ctx.ellipse(fx, fy + 1, W * 0.7, H * 0.13 + 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    void tipX; void tipY;
  }
}
