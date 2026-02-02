import { fetchJson } from "@/lib/sources/json";
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

const DEFAULT_POINTS=[
  {name:"Tehran",lat:35.6892,lon:51.3890},
  {name:"Isfahan",lat:32.6546,lon:51.6680},
  {name:"Shiraz",lat:29.5918,lon:52.5837},
  {name:"Tabriz",lat:38.0962,lon:46.2738},
];

export async function getWeather(){
  const results=[];
  for(const p of DEFAULT_POINTS){
    try{
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&hourly=cloud_cover,visibility,precipitation,wind_speed_10m&forecast_days=1`;
      const data=await fetchJson(url,{revalidateSec:900});
      const i=0;
      const cloud=data?.hourly?.cloud_cover?.[i];
      const vis=data?.hourly?.visibility?.[i];
      const wind=data?.hourly?.wind_speed_10m?.[i];
      const prcp=data?.hourly?.precipitation?.[i];

      let s=0;
      if(Number.isFinite(cloud)) s += clamp(cloud/100,0,1)*0.30;
      if(Number.isFinite(vis)) s += clamp((10000-vis)/10000,0,1)*0.35;
      if(Number.isFinite(wind)) s += clamp(wind/40,0,1)*0.20;
      if(Number.isFinite(prcp)) s += clamp(prcp/10,0,1)*0.15;

      results.push({name:p.name,s,cloud,vis,wind,prcp});
    }catch{}
  }
  if(!results.length) return { score:0.10, evidence:['מז"א: לא ניתן למשוך נתונים (Open‑Meteo).'] };

  results.sort((a,b)=>b.s-a.s);
  const top=results[0];
  const score=clamp(top.s,0,0.55);
  const visKm=Number.isFinite(top.vis)?`${Math.round(top.vis/1000)} ק"מ`:"לא ידוע";
  const evidence=[`מז"א (${top.name}): ראות ${visKm}, עננות ${Number.isFinite(top.cloud)?top.cloud+'%':'?'}, רוח ${Number.isFinite(top.wind)?top.wind+' קמ"ש':'?'}.`];
  return { score, evidence };
}
