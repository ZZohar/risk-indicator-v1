export default function About(){
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass rounded-3xl p-5">
        <div className="text-xl font-semibold mb-2">מקורות ברירת-מחדל</div>
        <p className="text-sm muted leading-6">
          האפליקציה משתמשת בברירת-מחדל במקורות ציבוריים/רשמיים בלבד לצורך מדד אזרחי.
          ניתן לשנות/להרחיב מקורות דרך משתני סביבה ב-Vercel (מומלץ).
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-2xl border border-white/15 p-3 bg-white/5"><div className="font-semibold mb-1">Connectivity / שיבושי תקשורת</div><div className="muted">NetBlocks RSS + דיווחים ציבוריים</div></div>
          <div className="rounded-2xl border border-white/15 p-3 bg-white/5"><div className="font-semibold mb-1">סייבר</div><div className="muted">ערוץ טלגרם רשמי (Israel Cyber) + RSS אופציונלי</div></div>
          <div className="rounded-2xl border border-white/15 p-3 bg-white/5"><div className="font-semibold mb-1">חדשות (קצב מבזקים)</div><div className="muted">ynet RSS + mako RSS</div></div>
          <div className="rounded-2xl border border-white/15 p-3 bg-white/5"><div className="font-semibold mb-1">תעופה אזרחית</div><div className="muted">EASA RSS (Conflict Zones / advisories)</div></div>
          <div className="rounded-2xl border border-white/15 p-3 bg-white/5"><div className="font-semibold mb-1">מזג אוויר וראות</div><div className="muted">Open‑Meteo ECMWF API (ללא מפתח)</div></div>
        </div>

        <a href="/" className="inline-block mt-5 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">חזרה</a>
      </div>
    </main>
  );
}
