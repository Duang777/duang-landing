import posts from "@/data/posts.json";
import { columns, nonArticleHrefs } from "@/data/site";

export type Post = (typeof posts)[number];

const DAY_MS = 86_400_000;

const isStub = (p: Post) => p.description.startsWith("待更新");

export const allPosts: Post[] = posts;

export function recentArticles(limit: number): Post[] {
  return allPosts
    .filter((p) => !isStub(p) && !nonArticleHrefs.has(p.href))
    .slice(0, limit);
}

export function findPost(href: string): Post | undefined {
  return allPosts.find((p) => p.href === href);
}

export function columnCount(series: string | null): number {
  if (!series) return 0;
  return allPosts.filter((p) => p.title.startsWith(series)).length;
}

export function siteStats() {
  const dates = allPosts.map((p) => p.date).sort();
  return {
    total: allPosts.length,
    bilingual: allPosts.filter((p) => p.bilingual).length,
    activeDays: new Set(dates).size,
    columns: columns.length,
    first: dates[0],
    latest: dates[dates.length - 1],
  };
}

export type LogDay = {
  date: string;
  posts: Array<{ title: string; href: string }>;
} | null;

export type WritingLog = {
  weeks: LogDay[][];
  months: Array<{ week: number; label: string }>;
};

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Monday-first weeks from the first post's week through the week of `end`; days after `end` are null. */
export function writingLog(end: Date): WritingLog {
  const byDate = new Map<string, LogDay & object>();
  for (const p of allPosts) {
    const day = byDate.get(p.date) ?? { date: p.date, posts: [] };
    day.posts.push({ title: p.title, href: p.href });
    byDate.set(p.date, day);
  }

  const first = Date.parse(siteStats().first);
  const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY_MS;
  const last = Date.parse(iso(end.getTime()));

  const weeks: LogDay[][] = [];
  const months: WritingLog["months"] = [];
  for (let t = start, w = 0; t <= last; t += 7 * DAY_MS, w++) {
    const week: LogDay[] = [];
    for (let d = 0; d < 7; d++) {
      const day = t + d * DAY_MS;
      const date = iso(day);
      week.push(day > last ? null : (byDate.get(date) ?? { date, posts: [] }));
      if (date.endsWith("-01") || (w === 0 && d === 0)) {
        months.push({ week: w, label: `${Number(date.slice(5, 7))}月` });
      }
    }
    weeks.push(week);
  }
  // The opening label collides with the next month's when that month starts a week later.
  if (months.length > 1 && months[1].week - months[0].week < 2) months.shift();
  return { weeks, months };
}
