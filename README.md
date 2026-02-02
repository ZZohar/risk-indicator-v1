# Risk Indicator (Civilian) – Next.js PWA

אפליקציית web/mobile שניתנת לשיתוף (WhatsApp / iPhone "Add to Home Screen") ומציגה:
- עיגול עם סיכון באחוזים (0–95%)
- מתחת: טקסט בעברית שמסביר אילו מדדים בולטים כרגע
- API מרכזי: `GET /api/indicators`

## העלאה ל-GitHub + Deploy ל-Vercel
1) צור Repo חדש ב-GitHub.
2) העלה את כל הקבצים שבחבילה הזו (commit + push).
3) ב-Vercel: Import Project → בחר את הריפו → Deploy.

## התקנה כאפליקציה (אייפון)
Safari → Share → Add to Home Screen → יופיע אייקון במסך הבית.

## מקורות ברירת-מחדל
- NetBlocks RSS: https://netblocks.org/feed
- ynet RSS (מבזקים): https://www.ynet.co.il/Integration/StoryRss1854.xml
- mako RSS: https://storage.googleapis.com/mako-sitemaps/rssHomepage.xml
- Israel Cyber (Telegram public HTML): https://t.me/s/Israel_Cyber
- Open‑Meteo: https://api.open-meteo.com

⚠️ חלק מהמקורות יכולים להיחסם זמנית (403/429). כדי לשפר אמינות — הגדירו ENV.

## ENV (מומלץ)
הגדירו ב-Vercel → Settings → Environment Variables לפי `.env.example`.
