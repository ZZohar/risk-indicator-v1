export async function fetchJson(url, { revalidateSec = 300, headers = {} } = {}) {
  const res = await fetch(url, { headers: { "user-agent": "risk-indicator/1.0", ...headers }, next: { revalidate: revalidateSec } });
  if (!res.ok) throw new Error(`JSON fetch failed ${res.status} ${url}`);
  return res.json();
}
