import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const products = [
  {
    title: "Auto",
    description:
      "Comprehensive coverage for every mile — from liability to full replacement.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M3 13h1.5l1.2-3.6A2 2 0 0 1 7.6 8h8.8a2 2 0 0 1 1.9 1.4L19.5 13H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1a2.5 2.5 0 1 1-5 0H9a2.5 2.5 0 1 1-5 0H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Home",
    description:
      "Protect your home, belongings, and peace of mind against the unexpected.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Life",
    description:
      "Secure your family's future with flexible term and whole life options.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Business",
    description:
      "Tailored policies for liability, property, workers' comp, and more.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <rect x="4" y="8" width="16" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 13h16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const stats = [
  { value: "50K+", label: "Customers protected" },
  { value: "$2B+", label: "Claims paid" },
  { value: "4.9", label: "Customer rating" },
  { value: "24/7", label: "Claims support" },
];

const benefits = [
  {
    title: "Stacked coverage",
    description:
      "Bundle auto, home, and life policies for layered protection and meaningful savings.",
  },
  {
    title: "Claims in days, not weeks",
    description:
      "Our digital claims process gets you answers fast — most auto claims resolved within 48 hours.",
  },
  {
    title: "Transparent pricing",
    description:
      "No hidden fees. See exactly what you're paying for before you commit to a policy.",
  },
  {
    title: "Dedicated advisors",
    description:
      "Licensed agents available by phone, chat, or video whenever you need guidance.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us about you",
    description: "Answer a few quick questions about your coverage needs and lifestyle.",
  },
  {
    step: "02",
    title: "Compare tailored options",
    description: "Review personalized quotes across our full product stack side by side.",
  },
  {
    step: "03",
    title: "Get covered instantly",
    description: "Choose your plan, sign digitally, and receive your policy documents immediately.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.4) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Trusted by 50,000+ policyholders
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Coverage that{" "}
                <span className="text-amber-400">stacks</span> in your favor
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-300">
                Insurance Stack brings together auto, home, life, and business
                protection in one place — so you spend less time worrying and more
                time living.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  id="quote"
                  href="/quote-calculator"
                  className="inline-flex items-center rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
                >
                  Get your free quote
                </a>
                <a
                  href="#products"
                  className="inline-flex items-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-800"
                >
                  Explore products
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Protection for every layer of life
              </h2>
              <p className="mt-4 text-slate-600">
                From your daily commute to your family's future — build a coverage
                stack that fits your life.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                    {product.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {product.description}
                  </p>
                  <a
                    href="/quote-calculator"
                    className="mt-4 inline-flex items-center text-sm font-medium text-slate-900 transition-colors group-hover:text-amber-600"
                  >
                    Get a quote
                    <svg viewBox="0 0 16 16" fill="none" className="ml-1 h-4 w-4" aria-hidden>
                      <path
                        d="M6 12l4-4-4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section id="why-us" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Why Insurance Stack
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                We built insurance the way it should be — simple, honest, and
                designed around you.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
                      <path
                        d="M3 8.5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Covered in three simple steps
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Getting protected shouldn&apos;t be complicated. Most customers are
                fully covered in under ten minutes.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="relative rounded-2xl border border-slate-700 bg-slate-800/50 p-8">
                  <span className="text-4xl font-bold text-amber-400/30">{item.step}</span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-14 text-center text-white sm:px-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to build your stack?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-300">
                Join thousands of families and businesses who trust Insurance Stack
                for smarter, simpler protection.
              </p>
              <a
                href="/auth/sign-in"
                className="mt-8 inline-flex items-center rounded-lg bg-amber-400 px-8 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
              >
                Start your free quote
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
