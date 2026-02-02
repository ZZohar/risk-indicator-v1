export const runtime = "nodejs";

import { getHomeFront } from "@/lib/indicators/homeFront";
import { getConnectivity } from "@/lib/indicators/connectivity";
import { getCyber } from "@/lib/indicators/cyber";
import { getNews } from "@/lib/indicators/news";
import { getAirspace } from "@/lib/indicators/airspace";
import { getDiplomacy } from "@/lib/indicators/diplomacy";
import { getWeather } from "@/lib/indicators/weather";
import { computeRiskPercent, buildHebrewSummary } from "@/lib/scoring";

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export async function GET(){
  const [homeFront,airspace,diplomacy,connectivity,cyber,news,weather] = await Promise.all([
    getHomeFront(), getAirspace(), getDiplomacy(), getConnectivity(), getCyber(), getNews(), getWeather()
  ]);

  const inputs = {
    homeFront: clamp(homeFront.score ?? 0, 0, 1),
    airspace: clamp(airspace.score ?? 0, 0, 1),
    diplomacy: clamp(diplomacy.score ?? 0, 0, 1),
    connectivity: clamp(connectivity.score ?? 0, 0, 1),
    cyber: clamp(cyber.score ?? 0, 0, 1),
    news: clamp(news.score ?? 0, 0, 1),
    weather: clamp(weather.score ?? 0, 0, 1),
  };

  const riskPercent = computeRiskPercent(inputs);
  const summaryHe = buildHebrewSummary(inputs);

  const evidence = {
    homeFront: homeFront.evidence ?? [],
    airspace: airspace.evidence ?? [],
    diplomacy: diplomacy.evidence ?? [],
    connectivity: connectivity.evidence ?? [],
    cyber: cyber.evidence ?? [],
    news: news.evidence ?? [],
    weather: weather.evidence ?? [],
  };

  return Response.json(
    { ok:true, ts:new Date().toISOString(), riskPercent, inputs, summaryHe, evidence, version:"v1" },
    { headers: { "Cache-Control":"s-maxage=300, stale-while-revalidate=600" } }
  );
}
