export const MAX_RISK = 95;
export const WEIGHTS = { homeFront:0.30, airspace:0.20, diplomacy:0.15, connectivity:0.10, cyber:0.10, news:0.05, weather:0.10 };
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export function computeRiskPercent(inputs){
  const raw = Object.keys(inputs).reduce((sum,k)=> sum + inputs[k]*(WEIGHTS[k]??0), 0);
  const spread = Object.values(inputs).slice().sort((a,b)=>b-a);
  const top2 = (spread[0]??0)+(spread[1]??0);
  const convergenceBoost = clamp((top2-0.7)*0.20,0,0.08);
  return clamp((raw+convergenceBoost)*MAX_RISK,0,MAX_RISK);
}

export function buildHebrewSummary(inputs){
  const labels = { homeFront:"הנחיות/עדכונים רשמיים", airspace:"תעופה אזרחית/אזהרות מרחב", diplomacy:"אזהרות מסע/דיפלומטיה",
    connectivity:"שיבושי תקשורת/אינטרנט", cyber:"סייבר אזורי (ישראל+אזור)", news:"קצב מבזקים (ישראל/עולם)", weather:"מזג אוויר/ראות" };
  const top = Object.entries(inputs).map(([k,v])=>({k,v})).sort((a,b)=>b.v-a.v).filter(x=>x.v>0.18).slice(0,3);
  if(!top.length) return "נכון לעכשיו המדדים הפומביים לא מצביעים על התכנסות חריגה. ייתכנו תנודות עקב חדשות/מז״א/שיבושים נקודתיים.";
  return `המדדים הבולטים כרגע: ${top.map(t=>`${labels[t.k]} (${Math.round(t.v*100)}/100)`).join(" · ")}.`;
}
