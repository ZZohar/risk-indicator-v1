"use client";
import React, { useEffect, useMemo, useState } from "react";

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function riskColor(p){ if(p<25) return "text-emerald-300"; if(p<50) return "text-yellow-300"; if(p<70) return "text-orange-300"; return "text-red-300"; }
function formatTime(iso){ try{ return new Date(iso).toLocaleString("he-IL",{hour12:false}); }catch{ return iso||""; } }
function getGaugeStroke(p){ const frac=clamp(p/95,0,1); const circ=2*Math.PI*92; return {dasharray:circ,dashoffset:circ*(1-frac)}; }

export default function Page(){
  const [autoMode,setAutoMode]=useState(true);
  const [loading,setLoading]=useState(false);
  const [riskPercent,setRiskPercent]=useState(0);
  const [summaryHe,setSummaryHe]=useState("");
  const [lastUpdated,setLastUpdated]=useState(null);
  const [evidence,setEvidence]=useState({});

  async function refresh(){
    setLoading(true);
    try{
      const res = await fetch("/api/indicators",{cache:"no-store"});
      const data = await res.json();
      if(data?.ok){
        setRiskPercent(Math.round(data.riskPercent));
        setSummaryHe(data.summaryHe||"");
        setLastUpdated(data.ts||null);
        setEvidence(data.evidence||{});
      }
    }finally{ setLoading(false); }
  }

  useEffect(()=>{ if(!autoMode) return; refresh(); const id=setInterval(refresh,10*60*1000); return ()=>clearInterval(id); },[autoMode]);
  const gauge = useMemo(()=>getGaugeStroke(riskPercent),[riskPercent]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass rounded-3xl p-5 shadow-xl">
        <header className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xl font-semibold">מדד סיכון אזרחי</div>
            <div className="text-sm muted">מבוסס מקורות רשמיים + OSINT ציבורי בלבד</div>
          </div>
          <button onClick={()=>setAutoMode(v=>!v)} className="px-3 py-2 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition">
            {autoMode ? "אוטומטי" : "ידני"}
          </button>
        </header>

        <section className="flex flex-col items-center gap-4">
          <div className="relative w-[240px] h-[240px]">
            <svg viewBox="0 0 220 220" className="w-full h-full">
              <circle cx="110" cy="110" r="92" stroke="rgba(255,255,255,0.12)" strokeWidth="18" fill="none" />
              <circle cx="110" cy="110" r="92" stroke="rgba(94,234,212,0.9)" strokeWidth="18" fill="none"
                strokeLinecap="round" strokeDasharray={gauge.dasharray} strokeDashoffset={gauge.dashoffset}
                transform="rotate(-90 110 110)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-bold ${riskColor(riskPercent)}`}>{riskPercent}%</div>
              <div className="text-xs muted mt-1">מקס׳ 95%</div>
            </div>
          </div>

          <div className="w-full">
            <div className="text-sm font-semibold mb-1">פירוש קצר</div>
            <div className="text-sm leading-6 muted">{summaryHe || "טוען ניתוח..."}</div>
            <div className="text-xs muted mt-2">
              {lastUpdated ? `עודכן: ${formatTime(lastUpdated)}` : ""}{loading ? " · טוען..." : ""}
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button onClick={refresh} className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/15">רענון</button>
            <a href="/about" className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition text-center">מקורות</a>
          </div>

          <details className="w-full mt-2">
            <summary className="cursor-pointer text-sm font-semibold">פירוט אינדיקציות (תקציר)</summary>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {Object.keys(evidence||{}).length===0 ? (
                <div className="text-sm muted">אין פירוט זמין עדיין.</div>
              ) : (
                Object.entries(evidence).map(([k,arr])=>(
                  <div key={k} className="rounded-2xl border border-white/15 p-3 bg-white/5">
                    <div className="text-sm font-semibold mb-1">{k}</div>
                    <ul className="list-disc pr-5 space-y-1 text-sm muted">
                      {(arr||[]).slice(0,4).map((t,idx)=><li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </details>

          <div className="text-xs muted mt-3">האפליקציה אינה מהווה ייעוץ/התרעה רשמית. תמיד הסתמכו על הנחיות הרשויות.</div>
        </section>
      </div>
    </main>
  );
}
