import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arc Raiders LC",
  description: "Calculator for Arc Raiders loadouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2M7TH1PWZD"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2M7TH1PWZD', {
              anonymize_ip: true,
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
<div
  className="fixed bottom-6 right-6 z-50 w-[260px] rounded-xl px-4 py-3 shadow-lg transition hover:scale-[1.02]"
  style={{
    backgroundColor: "#1C1F26",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <a
    href="https://paypal.me/tleanderbowman"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full rounded-full px-4 py-2 text-center text-sm font-semibold transition hover:opacity-90"
    style={{
      backgroundColor: "#C9B400",
      color: "#0E0F12",
    }}
  >
    ☕ Buy me a coffee
  </a>

  <p className="mt-2 text-center text-[11px] leading-snug text-[#A0A4AA]">
    This tool is free to use.  
    If you find it useful, a small tip is appreciated ❤️
  </p>
</div>



      </body>
    </html>
  );
}
