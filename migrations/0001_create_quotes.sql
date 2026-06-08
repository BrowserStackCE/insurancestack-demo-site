CREATE TABLE IF NOT EXISTS "quotes" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "form_data" jsonb NOT NULL,
  "quote_result" jsonb NOT NULL,
  "amount_cents" integer NOT NULL,
  "payment_frequency" text NOT NULL,
  "stripe_session_id" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
