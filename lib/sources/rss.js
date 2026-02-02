import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser({ ignoreAttributes: false });

export async function fetchRss(url, { revalidateSec = 300 } = {}) {
  const res = await fetch(url, { headers: { "user-agent": "risk-indicator/1.0" }, next: { revalidate: revalidateSec } });
  if (!res.ok) throw new Error(`RSS fetch failed ${res.status} ${url}`);
  const xml = await res.text();
  const data = parser.parse(xml);
  const items = data?.rss?.channel?.item || data?.feed?.entry || [];
  return Array.isArray(items) ? items : [items];
}

export function normalizeRssItem(it) {
  const title = it?.title?.["#text"] ?? it?.title ?? "";
  const desc = it?.description?.["#text"] ?? it?.summary?.["#text"] ?? it?.description ?? it?.summary ?? "";
  const date = it?.pubDate ?? it?.published ?? it?.updated ?? it?.["dc:date"] ?? "";
  return { title: String(title), desc: String(desc), date: String(date) };
}

export function hoursAgo(dateStr) {
  const t = new Date(dateStr).getTime();
  if (!Number.isFinite(t)) return Infinity;
  return (Date.now() - t) / (1000 * 60 * 60);
}
