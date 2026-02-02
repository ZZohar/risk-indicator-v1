import { fetchRss, normalizeRssItem, hoursAgo } from "@/lib/sources/rss";
const WINDOW_HOURS=48;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const ISRAEL_CYBER_URL="https://t.me/s/Israel_Cyber";

const KEYWORDS=[
  {re:/ransom|malware|ddos|phishing|breach|attack|campaign/i,w:0.30},
  {re:/Iran|Israel|Iraq|Lebanon|Syria|Gulf|UAE|Qatar|Jordan/i,w:0.25},
  {re:/bank|payment|fuel|electric|power|telecom|airport|port/i,w:0.25},
];
const scoreText=(t)=>clamp(KEYWORDS.reduce((s,k)=>s+(k.re.test(t)?k.w:0),0),0,1);

async function fetchTelegramSnippets(){
  const res=await fetch(ISRAEL_CYBER_URL,{headers:{"user-agent":"risk-indicator/1.0"},next:{revalidate:600}});
  if(!res.ok) throw new Error("telegram fetch failed");
  const html=await res.text();
  const texts=[];
  const re=/<div class="tgme_widget_message_text[^"]*">([\s\S]*?)<\/div>/g;
  let m;
  while((m=re.exec(html)) && texts.length<5){
    const raw=m[1].replace(/<br\s*\/?>/g," ").replace(/<[^>]+>/g," ").replace(/&quot;/g,'"').replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
    if(raw) texts.push(raw);
  }
  return texts;
}

export async function getCyber(){
  const evidence=[];
  let score=0.05;

  try{
    const msgs=await fetchTelegramSnippets();
    const top=msgs.map(t=>({t,s:scoreText(t)})).sort((a,b)=>b.s-a.s).slice(0,2);
    if(top[0]?.s>0.15){
      score += clamp(top[0].s*0.45,0,0.35);
      evidence.push("מערך הסייבר הלאומי: קיימים עדכונים/אזהרות פומביות.");
      evidence.push(top[0].t.slice(0,160)+(top[0].t.length>160?"…":""));
    }else{
      evidence.push("מערך הסייבר הלאומי: ללא אינדיקציה חריגה בפרסומים האחרונים.");
    }
  }catch{
    evidence.push("מערך הסייבר הלאומי: לא ניתן למשוך עדכונים (חסימה/תקלה זמנית).");
  }

  const feeds=(process.env.CYBER_FEEDS || "").split(",").map(s=>s.trim()).filter(Boolean);
  const rssHits=[];
  for(const url of feeds){
    try{
      const items=await fetchRss(url,{revalidateSec:1200});
      for(const it of items){
        const {title,desc,date}=normalizeRssItem(it);
        if(hoursAgo(date)<=WINDOW_HOURS){
          const s=scoreText(`${title} ${desc}`);
          if(s>0.2) rssHits.push({title,s});
        }
      }
    }catch{}
  }
  rssHits.sort((a,b)=>b.s-a.s);
  if(rssHits[0]?.s){
    score += clamp(rssHits[0].s*0.25,0,0.20);
    evidence.push(`עדכון סייבר נוסף: ${rssHits[0].title}`);
  }

  return { score: clamp(score,0,1), evidence: evidence.slice(0,4) };
}
