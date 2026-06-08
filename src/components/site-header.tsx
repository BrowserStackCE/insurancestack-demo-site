"use client";

import Link from "next/link";
import { UserButton } from "@hexclave/next";

const navLinks = [
  { href: "#products", label: "Products" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-us", label: "Why us" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="bg-red-400 p-2 text-center text-white dark:text-black">
        <p className="text-sm">This is a demo project. No real insurance is being sold.</p>
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-amber-400"
              aria-hidden
            >
              <rect x="4" y="14" width="16" height="4" rx="1" fill="currentColor" opacity="0.5" />
              <rect x="6" y="9" width="12" height="4" rx="1" fill="currentColor" opacity="0.75" />
              <rect x="8" y="4" width="8" height="4" rx="1" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Insurance Stack
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/quote-calculator"
            className="hidden rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:inline-block"
          >
            Get a quote
          </a>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
