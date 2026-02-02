import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS = 36;
const DEFAULT_FEEDS = ["https://netblocks.org/feed"];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

const KEYWORDS=[
  {re:/internet|connectivity|network|shutdown|restricted|blocked/i,w:0.40},
  {re:/Iran|Iraq|Syria|Lebanon|Israel|Gulf|UAE|Qatar|Bahrain|Kuwait|Oman|Jordan|Turkey/i,w:0.30},
  {re:/outage|disruption|incident/i,w:0.20},
];
const scoreText=(t)=>clamp(KEYWORDS.reduce((s,k)=>s+(k.re.test(t)?k.w:0),0),0,1);

export async function getConnectivity(){
  const feeds=(process.env.CONNECTIVITY_FEEDS || DEFAULT_FEEDS.join(",")).split(",").map(s=>s.trim()).filter(Boolean);
  const scored=[];
  for(const url of feeds){
    try{
      const items=await fetchRss(url,{revalidateSec:600});
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
  const score=clamp(top.reduce((sum,x)=>sum+x.s,0)/1.2,0,1);
  return { score, evidence: top.map(x=>`NetBlocks: ${x.title}`) };
}
