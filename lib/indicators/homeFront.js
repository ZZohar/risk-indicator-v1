import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS = 24;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export async function getHomeFront(){
  const feeds = (process.env.HOMEFRONT_FEEDS || "").split(",").map(s=>s.trim()).filter(Boolean);
  if(!feeds.length) return { score: 0.08, evidence: ["לא הוגדר מקור RSS להנחיות רשמיות (HOMEFRONT_FEEDS)."] };

  const hits=[];
  for(const url of feeds){
    try{
      const items = await fetchRss(url,{revalidateSec:300});
      for(const it of items){
        const {title,desc,date} = normalizeRssItem(it);
        if(hoursAgo(date)<=WINDOW_HOURS) hits.push({title,desc});
      }
    }catch{}
  }
  const score = clamp(0.05 + hits.length*0.06, 0.05, 0.60);
  return { score, evidence: hits.slice(0,3).map(x=>`עדכון: ${x.title}`) };
}
