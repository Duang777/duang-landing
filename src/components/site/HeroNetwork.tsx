"use client";

import { useEffect, useRef } from "react";

type HeroNetworkProps = {
  className?: string;
};

const PAGE_BG = "#b0563a";
const BASE = "#faf9f5";

const CFG = {
  radiusFactor: 0.3,
  count: 130,
  dotMin: 2.0,
  dotMax: 3.3,
  lineWidth: 1.0,
  windAmpPx: 52,
  windFreq: 0.16,
  windPhaseDrift: 0.06,
  stiffness: 12.0,
  damping: 4.8,
  maxBendPx: 300,
  midBoost: 1.95,
  mouseRadius: 155,
  highlightRadius: 128,
  impulseForce: 3900,
  impulseFalloff: 1.7,
  globalRotateSpeed: 0.055,
  flowSpeed: 0.2,
  flowWidth: 0.3,
  flowBaseAlpha: 0.14,
  flowPeakAlpha: 0.58,
  labelPad: 10,
  labelOffsetMin: 26,
  labelOffsetMax: 40,
  labelClamp: 12,
  labelMinGapPx: 44,
  labelEdgePad: 14,
  labelClearDotPx: 8,
  labelNudgeStepPx: 3,
  labelNudgeMaxIters: 64,
  labelBatchSize: 5,
  labelInDur: 0.45,
  labelOutDur: 0.55,
  labelShowHoldMin: 1.0,
  labelShowHoldMax: 2.0,
  labelInStaggerMin: 0.14,
  labelInStaggerMax: 0.42,
  labelOutStaggerMin: 0.12,
  labelOutStaggerMax: 0.38,
  labelBatchGap: 0.25,
  labelFontPx: 11,
};

const TOKENS = [
  "PROMPT...",
  "TOOL CALL...",
  "REQUEST...",
  "CONTEXT...",
  "SHADER...",
  "TIMEOUT...",
  "HANDLER...",
  "QUERY...",
  "AGENT LOOP...",
  "ROUTING...",
  "MEMORY...",
  "PIPELINE...",
];

type Node = {
  baseAngle: number;
  dotR: number;
  nx: number;
  ny: number;
  bend: number;
  vel: number;
  phase: number;
  freqJ: number;
  ampJ: number;
};

type Label = {
  nodeIndex: number;
  text: string;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
};

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cycDist(a: number, b: number) {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
}

function pulseAlpha(
  u: number,
  phase: number,
  width: number,
  base: number,
  peak: number,
) {
  const d = cycDist(u, phase);
  const x = Math.max(0, 1 - d / width);
  const s = x * x * (3 - 2 * x);
  return base + (peak - base) * s;
}

/**
 * Port of Cantor8's webgl-circle canvas: rotating spokes, wind bend,
 * traveling flow highlights, mouse impulse, and cycling mono labels.
 */
export function HeroNetwork({ className }: HeroNetworkProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 1;
    let h = 1;
    let cx = 0;
    let cy = 0;
    let R = 1;
    let lastTs = performance.now();
    let rotation = 0;
    let nodes: Node[] = [];
    let nearBoost = new Float32Array(0);
    let labels: Label[] = [];
    let batchEndAt = 0;
    let isInViewport = true;
    let isPageVisible = document.visibilityState !== "hidden";

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      vx: 0,
      vy: 0,
      px: -9999,
      py: -9999,
    };
    const enablePointerFx = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      w = Math.max(1, box.width);
      h = Math.max(1, box.height);
      cx = w * 0.5;
      cy = h * 0.5;
      R = Math.min(w, h) * CFG.radiusFactor;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildNodes = () => {
      nodes = Array.from({ length: CFG.count }, (_, i) => {
        const seed = i * 19.37;
        return {
          baseAngle: (i / CFG.count) * Math.PI * 2,
          dotR: CFG.dotMin + hash(seed + 9.9) * (CFG.dotMax - CFG.dotMin),
          nx: 0,
          ny: 0,
          bend: 0,
          vel: 0,
          phase: hash(seed + 1.1) * Math.PI * 2,
          freqJ: 0.65 + hash(seed + 2.7) * 0.7,
          ampJ: 0.75 + hash(seed + 4.8) * 0.8,
        };
      });
      nearBoost = new Float32Array(nodes.length);
    };

    const endpointForIndex = (i: number) => {
      const a = nodes[i].baseAngle + rotation;
      return { a, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
    };

    const pointLineDistanceWithT = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => {
      const vx = x2 - x1;
      const vy = y2 - y1;
      const wx = px - x1;
      const wy = py - y1;
      const c2 = vx * vx + vy * vy || 1;
      let t = (wx * vx + wy * vy) / c2;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      const sx = x1 + t * vx;
      const sy = y1 + t * vy;
      return { d: Math.hypot(px - sx, py - sy), t };
    };

    const pickLabelText = (used: Set<string>) => {
      const pool = TOKENS.filter((token) => !used.has(token));
      const src = pool.length ? pool : TOKENS;
      return src[(Math.random() * src.length) | 0];
    };

    const canPlaceLabel = (
      x: number,
      y: number,
      chosen: Array<{ x: number; y: number }>,
    ) => {
      for (const item of chosen) {
        if (Math.hypot(x - item.x, y - item.y) < CFG.labelMinGapPx) return false;
      }
      return true;
    };

    const buildLabelBatch = (nowSec: number) => {
      const chosen: Array<{
        nodeIndex: number;
        text: string;
        x: number;
        y: number;
      }> = [];
      const usedNode = new Set<number>();
      const usedText = new Set<string>();
      let tries = 0;
      const r0 = CFG.dotMax + CFG.labelClearDotPx + CFG.labelFontPx * 0.85;

      while (chosen.length < CFG.labelBatchSize && tries < 1600) {
        tries += 1;
        const nodeIndex = (Math.random() * nodes.length) | 0;
        if (usedNode.has(nodeIndex)) continue;
        const ep = endpointForIndex(nodeIndex);
        const nx = Math.cos(ep.a);
        const ny = Math.sin(ep.a);
        let x =
          ep.x +
          nx *
            (rand(r0, r0 + (CFG.labelOffsetMax - CFG.labelOffsetMin)) +
              CFG.labelPad);
        let y =
          ep.y +
          ny * (rand(CFG.labelOffsetMin, CFG.labelOffsetMax) + CFG.labelPad);
        if (Math.abs(nx) < 0.35) x += (nx >= 0 ? 1 : -1) * 10;
        y += rand(-10, 10);
        x = Math.max(CFG.labelEdgePad, Math.min(w - CFG.labelEdgePad, x));
        y = Math.max(CFG.labelEdgePad, Math.min(h - CFG.labelEdgePad, y));
        if (!canPlaceLabel(x, y, chosen)) continue;
        const text = pickLabelText(usedText);
        chosen.push({ nodeIndex, text, x, y });
        usedNode.add(nodeIndex);
        usedText.add(text);
      }

      while (chosen.length < CFG.labelBatchSize) {
        const nodeIndex = (Math.random() * nodes.length) | 0;
        const ep = endpointForIndex(nodeIndex);
        const nx = Math.cos(ep.a);
        const ny = Math.sin(ep.a);
        const rr = r0;
        let x = ep.x + nx * (rand(rr, rr + 24) + CFG.labelPad);
        let y =
          ep.y +
          ny * (rand(CFG.labelOffsetMin, CFG.labelOffsetMax) + CFG.labelPad);
        x = Math.max(CFG.labelEdgePad, Math.min(w - CFG.labelEdgePad, x));
        y = Math.max(CFG.labelEdgePad, Math.min(h - CFG.labelEdgePad, y));
        const text = pickLabelText(usedText);
        chosen.push({ nodeIndex, text, x, y });
        usedText.add(text);
      }

      const inOrder = shuffle([...Array(CFG.labelBatchSize).keys()]);
      const outOrder = shuffle([...Array(CFG.labelBatchSize).keys()]);
      const inDelay = new Array(CFG.labelBatchSize).fill(0);
      const outDelay = new Array(CFG.labelBatchSize).fill(0);
      let accIn = 0;
      for (const idx of inOrder) {
        inDelay[idx] = accIn;
        accIn += rand(CFG.labelInStaggerMin, CFG.labelInStaggerMax);
      }
      const hold = rand(CFG.labelShowHoldMin, CFG.labelShowHoldMax);
      let accOut = accIn + hold;
      for (const idx of outOrder) {
        outDelay[idx] = accOut;
        accOut += rand(CFG.labelOutStaggerMin, CFG.labelOutStaggerMax);
      }

      labels = chosen.map((item, i) => ({
        nodeIndex: item.nodeIndex,
        text: item.text,
        inStart: nowSec + inDelay[i],
        inEnd: nowSec + inDelay[i] + CFG.labelInDur,
        outStart: nowSec + outDelay[i],
        outEnd: nowSec + outDelay[i] + CFG.labelOutDur,
      }));
      batchEndAt = Math.max(...labels.map((lb) => lb.outEnd)) + CFG.labelBatchGap;
    };

    const labelAlpha = (nowSec: number, lb: Label) => {
      if (nowSec < lb.inStart) return 0;
      if (nowSec < lb.inEnd) {
        return (nowSec - lb.inStart) / Math.max(0.0001, CFG.labelInDur);
      }
      if (nowSec < lb.outStart) return 1;
      if (nowSec < lb.outEnd) {
        return 1 - (nowSec - lb.outStart) / Math.max(0.0001, CFG.labelOutDur);
      }
      return 0;
    };

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        mouse.active = false;
        mouse.vx = 0;
        mouse.vy = 0;
        return;
      }
      const sx = w / rect.width;
      const sy = h / rect.height;
      const nx = (clientX - rect.left) * sx;
      const ny = (clientY - rect.top) * sy;
      mouse.vx = nx - mouse.px;
      mouse.vy = ny - mouse.py;
      mouse.px = nx;
      mouse.py = ny;
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const startLoop = () => {
      if (!raf && isInViewport && isPageVisible && running) {
        lastTs = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const syncLoopState = () => {
      if (isInViewport && isPageVisible && running) startLoop();
      else stopLoop();
    };

    const draw = (ts: number) => {
      if (!running) return;
      const dt = Math.min(0.033, (ts - lastTs) / 1000);
      lastTs = ts;
      const t = ts * 0.001;
      const flowPhase = (t * CFG.flowSpeed) % 1;
      rotation += CFG.globalRotateSpeed * dt;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAGE_BG;
      ctx.fillRect(0, 0, w, h);

      const drift = t * CFG.windPhaseDrift;
      ctx.lineWidth = CFG.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      nearBoost.fill(0);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const a = n.baseAngle + rotation;
        const ex = cx + Math.cos(a) * R;
        const ey = cy + Math.sin(a) * R;
        const dx = ex - cx;
        const dy = ey - cy;
        const len = Math.hypot(dx, dy) || 1;
        n.nx = -dy / len;
        n.ny = dx / len;

        const baseBend =
          Math.sin(t * CFG.windFreq * n.freqJ + n.phase + drift) *
          (CFG.windAmpPx * n.ampJ);

        if (enablePointerFx && mouse.active) {
          const hit = pointLineDistanceWithT(mouse.x, mouse.y, cx, cy, ex, ey);
          const tipDist = Math.hypot(mouse.x - ex, mouse.y - ey);
          if (tipDist < CFG.highlightRadius) {
            nearBoost[i] = Math.max(
              nearBoost[i],
              Math.pow(1 - tipDist / CFG.highlightRadius, 1.35),
            );
          }
          if (hit.d < CFG.mouseRadius) {
            const f = 1 - hit.d / CFG.mouseRadius;
            const falloff = Math.pow(f, CFG.impulseFalloff);
            nearBoost[i] = Math.max(nearBoost[i], falloff * 0.72);
            const along = Math.sin(Math.PI * hit.t);
            const side =
              Math.sign((mouse.x - cx) * dy - (mouse.y - cy) * dx) || 1;
            const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);
            const speedGain = Math.min(2.2, 0.55 + mouseSpeed * 0.085);
            const impulse =
              side * falloff * along * CFG.impulseForce * speedGain;
            n.vel += impulse * dt;
          }
        }

        const acc = -CFG.stiffness * (n.bend - baseBend) - CFG.damping * n.vel;
        n.vel += acc * dt;
        n.bend += n.vel * dt;
        if (n.bend > CFG.maxBendPx) n.bend = CFG.maxBendPx;
        if (n.bend < -CFG.maxBendPx) n.bend = -CFG.maxBendPx;

        const mx = (cx + ex) * 0.5;
        const my = (cy + ey) * 0.5;
        const cpx = mx + n.nx * n.bend * CFG.midBoost;
        const cpy = my + n.ny * n.bend * CFG.midBoost;
        const boost = nearBoost[i];

        const g = ctx.createLinearGradient(cx, cy, ex, ey);
        const stops = 3;
        for (let si = 0; si <= stops; si++) {
          const u = si / stops;
          const aPulse = pulseAlpha(
            u,
            flowPhase,
            CFG.flowWidth,
            CFG.flowBaseAlpha,
            CFG.flowPeakAlpha,
          );
          const alpha = Math.min(0.92, aPulse + boost * 0.48);
          g.addColorStop(u, `rgba(250, 249, 245, ${alpha.toFixed(4)})`);
        }

        ctx.lineWidth = CFG.lineWidth + boost * 0.85;
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        ctx.stroke();
      }

      ctx.lineWidth = CFG.lineWidth;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i].baseAngle + rotation;
        const ex = cx + Math.cos(a) * R;
        const ey = cy + Math.sin(a) * R;
        const boost = nearBoost[i];
        if (boost > 0.08) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(250, 249, 245, ${(0.12 + boost * 0.28).toFixed(3)})`;
          ctx.arc(ex, ey, nodes[i].dotR + 4.5 + boost * 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = BASE;
        ctx.globalAlpha = 0.72 + boost * 0.28;
        ctx.arc(ex, ey, nodes[i].dotR + boost * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!labels.length || t >= batchEndAt) buildLabelBatch(t);

      ctx.font = `${CFG.labelFontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = BASE;
      const radBase = CFG.dotMax + CFG.labelClearDotPx + CFG.labelFontPx * 0.85;

      for (const lb of labels) {
        const alpha = labelAlpha(t, lb);
        if (alpha <= 0.001) continue;
        const ep = endpointForIndex(lb.nodeIndex);
        const nx = Math.cos(ep.a);
        const ny = Math.sin(ep.a);
        let x = ep.x + nx * radBase;
        let y = ep.y + ny * radBase;
        if (Math.abs(nx) < 0.35) x += (nx >= 0 ? 1 : -1) * 10;
        x = Math.max(CFG.labelClamp, Math.min(w - CFG.labelClamp, x));
        y = Math.max(CFG.labelClamp, Math.min(h - CFG.labelClamp, y));
        ctx.textAlign = nx >= 0 ? "left" : "right";
        ctx.globalAlpha = alpha * 0.95;
        ctx.fillText(lb.text, x, y);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = BASE;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();

      if (isInViewport && isPageVisible && running) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    resize();
    buildNodes();
    syncLoopState();

    const onMove = (event: MouseEvent) => {
      updatePointerFromClient(event.clientX, event.clientY);
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
    };
    const onResize = () => {
      resize();
    };
    const onVisibility = () => {
      isPageVisible = document.visibilityState !== "hidden";
      syncLoopState();
    };

    if (enablePointerFx) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        isInViewport = !!(entries[0] && entries[0].isIntersecting);
        syncLoopState();
      },
      { threshold: [0, 0.05, 0.2] },
    );
    io.observe(canvas);

    return () => {
      running = false;
      stopLoop();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
