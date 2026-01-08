"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [calculatorInView, setCalculatorInView] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const el = document.getElementById("calculator");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCalculatorInView(entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.01,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [isHome]);

  // ⭐️ AFGØRENDE: vi afleder aktiv state – vi sætter den ikke manuelt
  const isCalculatorActive = isHome && calculatorInView;
  const isHomeActive = isHome && !isCalculatorActive;


  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0E0F12]/90 backdrop-blur border-b border-white/5">
      <nav className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-white">
          ARC<span className="text-[#C9B400]">LC</span>
        </Link>

        {/* Links */}
<div className="flex gap-6 text-sm">

  {/* Home */}
  <Link
    href="/"
    className={
  isHomeActive
    ? "text-[#C9B400]"
    : "text-[#A0A4AA] hover:text-white"
}

  >
    Home
  </Link>

  {/* Calculator (kun aktiv ved scroll) */}
  <Link
    href="/#calculator"
    className={
      isCalculatorActive
        ? "text-[#C9B400]"
        : "text-[#A0A4AA] hover:text-white"
    }
  >
    Calculator
  </Link>

  {/* Recycle Lab */}
  <Link
    href="/recycle-lab"
    className={
      pathname.startsWith("/recycle-lab")
        ? "text-[#C9B400]"
        : "text-[#A0A4AA] hover:text-white"
    }
  >
    Recycle Lab
  </Link>

</div>

      </nav>
    </header>
  );
}
