import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS = 6;
const DEFAULT_FEEDS=[
  "https://www.ynet.co.il/Integration/StoryRss1854.xml",
  "https://storage.googleapis.com/mako-sitemaps/rssHomepage.xml",
];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

const KEYWORDS=[
  {re:/Iran|איראן|Lebanon|לבנון|Syria|סוריה|Iraq|עיראק|Gulf|מפרץ|airspace|מרחב אווירי|NOTAM|evacuate|פינוי|alert|הנחיות|פיקוד העורף/i,w:0.35},
  {re:/missile|rocket|כטב"ם|drone|ירי|attack|תקיפה|explosion|פיצוץ/i,w:0.30},
  {re:/warning|התרעה|מבצע|חירום|closed|closure|ביטול טיסות/i,w:0.20},
];
const scoreText=(t)=>clamp(KEYWORDS.reduce((s,k)=>s+(k.re.test(t)?k.w:0),0),0,1);

export async function getNews(){
  const feeds=(process.env.NEWS_FEEDS || DEFAULT_FEEDS.join(",")).split(",").map(s=>s.trim()).filter(Boolean);
  const items=[];
  for(const url of feeds){
    try{
      const rss=await fetchRss(url,{revalidateSec:300});
      for(const it of rss){
        const {title,desc,date}=normalizeRssItem(it);
        if(hoursAgo(date)<=WINDOW_HOURS){
          const s=scoreText(`${title} ${desc}`);
          if(s>0.15) items.push({title,s});
        }
      }
    }catch{}
  }
  items.sort((a,b)=>b.s-a.s);
  const top=items.slice(0,5);
  const score=clamp(0.05+Math.min(0.40, top.reduce((sum,x)=>sum+x.s,0)/4),0,0.55);
  return { score, evidence: top.slice(0,3).map(x=>`מבזק: ${x.title}`) };
}
