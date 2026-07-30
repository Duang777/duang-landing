import { mkdir, writeFile } from "node:fs/promises";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const pages = await fetch(`${endpoint}/json/list`).then((response) => response.json());
const page = pages.find(
  (candidate) => candidate.type === "page" && candidate.url.includes("cantor8.io"),
);

if (!page) {
  throw new Error("Cantor8 page not found in the active Chrome debugging session.");
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let requestId = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const resolve = pending.get(message.id);

  if (resolve) {
    pending.delete(message.id);
    resolve(message);
  }
});

function call(method, params = {}) {
  return new Promise((resolve) => {
    const id = ++requestId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await mkdir("docs/design-references/cantor8", { recursive: true });

const stops = [
  ["hero", 0],
  ["foundation", 813],
  ["partners", 2050],
  ["products", 3374],
  ["product-detail", 6500],
  ["workflows", 8041],
  ["newsroom", 10633],
  ["cta", 11511],
  ["footer", 12400],
];

for (const [name, top] of stops) {
  await call("Runtime.evaluate", {
    expression: `window.scrollTo({ top: ${top}, behavior: "instant" })`,
  });
  await new Promise((resolve) => setTimeout(resolve, 450));

  const response = await call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  await writeFile(
    `docs/design-references/cantor8/${name}.png`,
    Buffer.from(response.result.data, "base64"),
  );
}

socket.close();
console.log(`Captured ${stops.length} desktop reference screenshots.`);
