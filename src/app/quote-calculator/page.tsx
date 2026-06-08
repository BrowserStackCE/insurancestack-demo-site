import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuoteForm } from "@/components/quote-calculator/quote-form";
import { hexclaveServerApp } from "@/stack/server";

export const metadata: Metadata = {
  title: "Quote Calculator — Insurance Stack",
  description:
    "Get an instant personalized insurance quote for auto, home, life, and business coverage. Bundle policies and save up to 15%.",
};

export default async function QuoteCalculatorPage() {
  await hexclaveServerApp.getUser({or:'redirect'})
  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-slate-50">
        <section className="border-b border-slate-200 bg-slate-900 py-14 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-medium text-amber-400">Free · No obligation</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Quote calculator
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Answer a few questions about yourself and your coverage needs. We&apos;ll
              calculate a personalized estimate in under two minutes — bundle multiple
              policies to unlock stack savings.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <QuoteForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
