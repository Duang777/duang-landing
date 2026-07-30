import { writeFile } from "node:fs/promises";

const port = process.argv[2];
const match = process.argv[3];
const out = process.argv[4];

const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const page = pages.find((p) => p.type === "page" && p.url.includes(match));
if (!page) throw new Error(`no page matching ${match} on ${port}`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let seq = 0;
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
socket.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  const resolve = pending.get(msg.id);
  if (resolve) {
    pending.delete(msg.id);
    resolve(msg);
  }
});
const call = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++seq;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

await call("Runtime.evaluate", { expression: "window.scrollTo(0,0)" });
await new Promise((r) => setTimeout(r, 700));

const expression = `JSON.stringify((() => {
  const seen = [];
  const norm = (s) => (s || "").replace(/\\s+/g, " ").trim();
  const els = [...document.querySelectorAll("body *")];
  for (const el of els) {
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(" ");
    const text = norm(own);
    if (!text || text.length > 90) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const c = getComputedStyle(el);
    if (c.visibility === "hidden" || c.opacity === "0") continue;
    seen.push({
      text,
      tag: el.tagName,
      x: Math.round(r.left),
      y: Math.round(r.top + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      fs: Math.round(parseFloat(c.fontSize) * 10) / 10,
      fw: c.fontWeight,
      lh: c.lineHeight,
      color: c.color,
      bg: c.backgroundColor,
      radius: c.borderRadius,
    });
  }
  return {
    docHeight: document.documentElement.scrollHeight,
    docWidth: document.documentElement.scrollWidth,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    nodes: seen,
  };
})())`;

const res = await call("Runtime.evaluate", { expression, returnByValue: true });
await writeFile(out, res.result.result.value);
console.log(out, JSON.parse(res.result.result.value).nodes.length, "nodes");
socket.close();
