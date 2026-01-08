import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KSSPZSN4');
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSSPZSN4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/*<Navbar /> */}

        <div className="pt-0">{children}</div>
        {/* set pt-18 on navbar init */}

        {/* Donation / Tip box */}
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
            This tool is free to use. If you find it useful, a small tip is
            appreciated ❤️
          </p>
        </div>
      </body>
    </html>
  );
}
