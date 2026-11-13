// Closed-form damped springs and falling bodies, ported from goopUI's core/spring.ts
// (MIT, Timothy McMasters, https://github.com/Tmmcmasters/goopui). Exact for any frame delta.

export type Spring = { x: number; v: number };

/** { response (s), dampingRatio } → stiffness / damping for a unit mass. */
export function springConfig(response: number, dampingRatio: number) {
  const w = (2 * Math.PI) / Math.max(0.01, response);
  return { stiffness: w * w, damping: 2 * dampingRatio * w };
}

export type SpringConfig = ReturnType<typeof springConfig>;

export function stepSpring(s: Spring, target: number, cfg: SpringConfig, dt: number) {
  if (!(dt > 0)) return;
  const w0 = Math.sqrt(cfg.stiffness);
  const y0 = s.x - target;
  const v0 = s.v;
  const zeta = cfg.damping / (2 * w0);
  let y: number;
  let v: number;
  if (Math.abs(zeta - 1) < 1e-4) {
    const e = Math.exp(-w0 * dt);
    const b = v0 + w0 * y0;
    y = (y0 + b * dt) * e;
    v = (v0 - w0 * b * dt) * e;
  } else if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const e = Math.exp(-zeta * w0 * dt);
    const cos = Math.cos(wd * dt);
    const sin = Math.sin(wd * dt);
    y = e * (y0 * cos + ((v0 + zeta * w0 * y0) / wd) * sin);
    v = e * (v0 * cos - ((zeta * w0 * v0 + w0 * w0 * y0) / wd) * sin);
  } else {
    const root = Math.sqrt(zeta * zeta - 1);
    const r1 = -w0 * (zeta - root);
    const r2 = -w0 * (zeta + root);
    const c2 = (v0 - r1 * y0) / (r2 - r1);
    const c1 = y0 - c2;
    const e1 = Math.exp(r1 * dt);
    const e2 = Math.exp(r2 * dt);
    y = c1 * e1 + c2 * e2;
    v = r1 * c1 * e1 + r2 * c2 * e2;
  }
  s.x = target + y;
  s.v = v;
}

export const settled = (s: Spring, target: number, eps = 0.05) =>
  Math.abs(s.x - target) < eps && Math.abs(s.v) < eps * 4;

/** Gravity with linear drag, closed form of v' = g − drag·v. */
export function stepFall(s: Spring, gravity: number, drag: number, dt: number) {
  const vt = gravity / drag;
  const e = Math.exp(-drag * dt);
  s.x += vt * dt + ((s.v - vt) * (1 - e)) / drag;
  s.v = vt + (s.v - vt) * e;
}

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `step(dt)` every frame until it returns false; call the returned wake() to restart. */
export function frameLoop(step: (dt: number) => boolean) {
  let raf = 0;
  let last = 0;
  const tick = (now: number) => {
    const dt = Math.min(1 / 20, (now - last) / 1000);
    last = now;
    raf = step(dt) ? requestAnimationFrame(tick) : 0;
  };
  return {
    wake() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
