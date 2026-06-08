"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { quotesTable } from "@/db/schema";
import type { QuoteFormData, QuoteResult } from "@/lib/quote-calculator";
import { getStripe } from "@/lib/stripe";

export type CreateQuoteCheckoutResult =
  | { success: true; quoteId: number }
  | { success: false; error: string };

function getChargeAmountCents(formData: QuoteFormData, quoteResult: QuoteResult): number {
  const amount =
    formData.paymentFrequency === "annual"
      ? quoteResult.totalAnnual
      : quoteResult.totalMonthly;
  return Math.max(50, Math.round(amount * 100));
}

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export async function createQuoteCheckout(
  formData: QuoteFormData,
  quoteResult: QuoteResult,
): Promise<CreateQuoteCheckoutResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      success: false,
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.",
    };
  }

  if (!process.env.DATABASE_URL) {
    return {
      success: false,
      error: "Database is not configured. Add DATABASE_URL to your environment.",
    };
  }

  try {
    const amountCents = getChargeAmountCents(formData, quoteResult);
    const origin = await getOrigin();

    const [quote] = await db
      .insert(quotesTable)
      .values({
        firstName: formData.firstName,
        lastName: formData.lastName,
        formData,
        quoteResult,
        amountCents,
        paymentFrequency: formData.paymentFrequency,
        status: "pending",
      })
      .returning({ id: quotesTable.id });

    const coverageLabel = formData.coverageTypes
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(", ");

    const session = await getStripe().checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      return_url: `${origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Insurance Stack Premium",
              description: `${coverageLabel} — ${formData.paymentFrequency === "annual" ? "Annual" : "First month"} payment`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: String(quote.id),
      },
    });

    await db
      .update(quotesTable)
      .set({
        stripeSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(quotesTable.id, quote.id));

    return { success: true, quoteId: quote.id };
  } catch (error) {
    console.error("Failed to create quote checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create checkout. Please try again.",
    };
  }
}

export async function getCheckoutClientSecret(
  quoteId: number,
): Promise<{ clientSecret: string } | { error: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe is not configured." };
  }

  try {
    const [quote] = await db
      .select()
      .from(quotesTable)
      .where(eq(quotesTable.id, quoteId))
      .limit(1);

    if (!quote) {
      return { error: "Quote not found." };
    }

    if (!quote.stripeSessionId) {
      return { error: "Checkout session not found for this quote." };
    }

    const session = await getStripe().checkout.sessions.retrieve(
      quote.stripeSessionId,
    );

    if (!session.client_secret) {
      return { error: "Checkout session is no longer valid." };
    }

    if (session.status === "complete") {
      return { error: "This quote has already been paid." };
    }

    return { clientSecret: session.client_secret };
  } catch (error) {
    console.error("Failed to get checkout client secret:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to load checkout session.",
    };
  }
}
