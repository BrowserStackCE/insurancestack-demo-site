import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EmbeddedCheckoutForm } from "@/components/checkout/embedded-checkout-form";
import { getCheckoutClientSecret } from "@/app/actions/quote-checkout";
import { db } from "@/db";
import { quotesTable } from "@/db/schema";
import type { QuoteFormData, QuoteResult } from "@/lib/quote-calculator";

export const metadata: Metadata = {
  title: "Checkout — Insurance Stack",
  description: "Complete your insurance premium payment securely with Stripe.",
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const { quoteId: quoteIdParam } = await params;
  const quoteId = parseInt(quoteIdParam, 10);

  if (Number.isNaN(quoteId)) {
    notFound();
  }

  const [quote] = await db
    .select()
    .from(quotesTable)
    .where(eq(quotesTable.id, quoteId))
    .limit(1);

  if (!quote) {
    notFound();
  }

  const checkout = await getCheckoutClientSecret(quoteId);

  if ("error" in checkout) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 bg-slate-50">
          <div className="mx-auto max-w-lg px-6 py-24 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Checkout unavailable</h1>
            <p className="mt-3 text-slate-600">{checkout.error}</p>
            <Link
              href="/quote-calculator"
              className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to quote calculator
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const formData = quote.formData as QuoteFormData;
  const quoteResult = quote.quoteResult as QuoteResult;

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-slate-50">
        <section className="border-b border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-medium text-amber-600">Secure checkout</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Complete your payment
            </h1>
            <p className="mt-2 text-slate-600">
              Quote #{quote.id} for {quote.firstName} {quote.lastName}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
                <div>
                  <p className="text-sm text-slate-500">Amount due today</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {formatCurrency(quote.amountCents)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formData.paymentFrequency === "annual"
                      ? "Annual premium (5% pay-in-full discount applied)"
                      : "First month premium"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h2 className="text-sm font-semibold text-slate-900">Coverage</h2>
                  <ul className="mt-3 space-y-2">
                    {quoteResult.lineItems.map((item) => (
                      <li
                        key={item.type}
                        className="flex justify-between text-sm text-slate-600"
                      >
                        <span>{item.label}</span>
                        <span className="font-medium text-slate-900">
                          ${item.monthlyPremium.toFixed(2)}/mo
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-5 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Deductible</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(formData.deductible * 100)}
                    </span>
                  </div>
                  {quoteResult.bundleDiscountPercent > 0 && (
                    <div className="mt-2 flex justify-between text-emerald-700">
                      <span>Bundle discount</span>
                      <span>{quoteResult.bundleDiscountPercent}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                  <p className="text-center text-sm text-red-600">
                    Stripe publishable key is not configured. Add
                    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment.
                  </p>
                ) : (
                  <EmbeddedCheckoutForm clientSecret={checkout.clientSecret} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
