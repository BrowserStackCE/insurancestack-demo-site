import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/db";
import { quotesTable } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment Complete — Insurance Stack",
  description: "Your insurance premium payment was processed successfully.",
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 bg-slate-50">
          <div className="mx-auto max-w-lg px-6 py-24 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Session not found</h1>
            <p className="mt-3 text-slate-600">
              No payment session was provided. If you completed a payment, check your
              email for a receipt.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Return home
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  let quoteId: number | null = null;
  let amountCents = 0;
  let customerName = "";

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.metadata?.quoteId) {
      quoteId = parseInt(session.metadata.quoteId, 10);

      await db
        .update(quotesTable)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(quotesTable.id, quoteId));

      const [quote] = await db
        .select()
        .from(quotesTable)
        .where(eq(quotesTable.id, quoteId))
        .limit(1);

      if (quote) {
        amountCents = quote.amountCents;
        customerName = `${quote.firstName} ${quote.lastName}`;
      }
    }
  } catch (error) {
    console.error("Failed to verify checkout session:", error);
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-emerald-600"
              aria-hidden
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">Payment successful</h1>

          {customerName && (
            <p className="mt-3 text-slate-600">
              Thank you, {customerName}. Your payment of{" "}
              <span className="font-semibold text-slate-900">
                {formatCurrency(amountCents)}
              </span>{" "}
              has been received.
            </p>
          )}

          {quoteId && (
            <p className="mt-2 text-sm text-slate-500">Quote reference #{quoteId}</p>
          )}

          <p className="mt-4 text-sm text-slate-500">
            This is a demo transaction. No real insurance policy has been issued.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Return home
            </Link>
            <Link
              href="/quote-calculator"
              className="inline-flex rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Get another quote
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
