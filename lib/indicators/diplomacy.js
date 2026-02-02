import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS=168;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

const KEYWORDS=[
  {re:/Do not travel|Reconsider travel|Travel Advisory|Security Alert|Evacuat/i,w:0.55},
  {re:/Iran|Iraq|Syria|Lebanon|Israel|Gulf|UAE|Qatar|Jordan|Turkey|Egypt/i,w:0.25},
  {re:/warning|alert|threat/i,w:0.20},
];
const scoreText=(t)=>clamp(KEYWORDS.reduce((s,k)=>s+(k.re.test(t)?k.w:0),0),0,1);

export async function getDiplomacy(){
  const feeds=(process.env.DIPLOMACY_FEEDS || "").split(",").map(s=>s.trim()).filter(Boolean);
  if(!feeds.length) return { score: 0.06, evidence: ["לא הוגדרו מקורות RSS לדיפלומטיה (DIPLOMACY_FEEDS)."] };

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
  return { score, evidence: top.map(x=>`אזהרת מסע: ${x.title}`) };
}
