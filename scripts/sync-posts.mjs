// Pull the notes blog RSS into src/data/posts.json so the landing page lists real posts.
// A failed fetch keeps the committed snapshot, so offline builds still work.
import { writeFile } from "node:fs/promises";

const FEED = "https://duangblog.pages.dev/rss.xml";
const OUT = new URL("../src/data/posts.json", import.meta.url);

const decode = (s) =>
  s
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

const field = (item, tag) => {
  const m = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : "";
};

try {
  const res = await fetch(FEED, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const xml = await res.text();

  // The feed lists each bilingual post twice under one link, Chinese first.
  const byHref = new Map();
  const posts = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const href = field(item, "link");
    if (!href) continue;
    if (byHref.has(href)) {
      byHref.get(href).bilingual = true;
      continue;
    }
    const post = {
      title: field(item, "title"),
      href,
      date: new Date(field(item, "pubDate")).toISOString().slice(0, 10),
      description: field(item, "description"),
      bilingual: false,
    };
    byHref.set(href, post);
    posts.push(post);
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));

  await writeFile(OUT, `${JSON.stringify(posts, null, 2)}\n`);
  console.log(`sync-posts: wrote ${posts.length} posts`);
} catch (err) {
  console.warn(`sync-posts: kept existing snapshot (${err.message})`);
}
