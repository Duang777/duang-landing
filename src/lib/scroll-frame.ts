export type ScrollFrame = {
  scrollY: number;
  viewportHeight: number;
  maxScroll: number;
};

type ScrollFrameListener = (frame: ScrollFrame) => void;

const listeners = new Set<ScrollFrameListener>();
let animationFrame = 0;
let listening = false;

function readFrame(): ScrollFrame {
  const viewportHeight = window.innerHeight;
  return {
    scrollY: window.scrollY,
    viewportHeight,
    maxScroll: Math.max(
      1,
      document.documentElement.scrollHeight - viewportHeight,
    ),
  };
}

function flush() {
  animationFrame = 0;
  const frame = readFrame();
  listeners.forEach((listener) => listener(frame));
}

function schedule() {
  if (!animationFrame) animationFrame = window.requestAnimationFrame(flush);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

export function subscribeScrollFrame(listener: ScrollFrameListener) {
  listeners.add(listener);
  start();
  listener(readFrame());

  return () => {
    listeners.delete(listener);
    if (!listeners.size) stop();
  };
}
