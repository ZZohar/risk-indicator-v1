import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS=168;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const DEFAULT_FEEDS=["https://www.easa.europa.eu/en/rss"];

const KEYWORDS=[
  {re:/Conflict Zone|CZIB|advisory|airspace|avoid|high risk/i,w:0.45},
  {re:/Iran|Iraq|Syria|Lebanon|Israel|Gulf|UAE|Qatar|Jordan|Turkey/i,w:0.25},
  {re:/NOTAM|closure|closed|reroute|divert/i,w:0.20},
];
const scoreText=(t)=>clamp(KEYWORDS.reduce((s,k)=>s+(k.re.test(t)?k.w:0),0),0,1);

export async function getAirspace(){
  const feeds=(process.env.AIRSPACE_FEEDS || DEFAULT_FEEDS.join(",")).split(",").map(s=>s.trim()).filter(Boolean);
  const scored=[];
  for(const url of feeds){
    try{
      const items=await fetchRss(url,{revalidateSec:3600});
      for(const it of items){
        const {title,desc,date}=normalizeRssItem(it);
        if(hoursAgo(date)<=WINDOW_HOURS){
          const s=scoreText(`${title} ${desc}`);
          if(s>0.2) scored.push({title,s});
        }
      }
    }catch{}
  }
  scored.sort((a,b)=>b.s-a.s);
  const top=scored.slice(0,3);
  const score=clamp(top.reduce((sum,x)=>sum+x.s,0)/1.2,0,0.85);
  return { score, evidence: top.map(x=>`תעופה: ${x.title}`) };
}
