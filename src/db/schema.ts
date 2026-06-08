import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  formData: jsonb("form_data").notNull(),
  quoteResult: jsonb("quote_result").notNull(),
  amountCents: integer("amount_cents").notNull(),
  paymentFrequency: text("payment_frequency").notNull(),
  stripeSessionId: text("stripe_session_id"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
