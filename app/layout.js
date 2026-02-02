import "./globals.css";

export const metadata = {
  title: "מדד סיכון אזרחי",
  description: "מדד משוקלל ממקורות רשמיים ו-OSINT ציבורי בלבד",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b1220",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
