"use client";

import { useState } from "react";
import {
  calculateQuote,
  defaultFormData,
  validateStep,
  type CoverageType,
  type QuoteFormData,
  type QuoteResult,
} from "@/lib/quote-calculator";

const STEPS = [
  "About you",
  "Coverage",
  "Details",
  "Preferences",
  "Your quote",
];

const COVERAGE_OPTIONS: {
  type: CoverageType;
  title: string;
  description: string;
}[] = [
  {
    type: "auto",
    title: "Auto",
    description: "Liability, collision, and comprehensive options",
  },
  {
    type: "home",
    title: "Home",
    description: "Dwelling, personal property, and liability",
  },
  {
    type: "life",
    title: "Life",
    description: "Term life with flexible coverage amounts",
  },
  {
    type: "business",
    title: "Business",
    description: "General liability and property protection",
  },
];

const VEHICLE_MAKES = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Tesla",
  "BMW",
  "Mercedes-Benz",
  "Other",
];

const INDUSTRIES = [
  { value: "professional-services", label: "Professional Services" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technology", label: "Technology" },
  { value: "hospitality", label: "Hospitality" },
];

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {children}
      {required && <span className="text-amber-600"> *</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${className}`}
      {...props}
    />
  );
}

function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-slate-600">{description}</span>
        )}
      </span>
    </label>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function QuoteSummary({ result, data }: { result: QuoteResult; data: QuoteFormData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
        <p className="text-sm font-medium text-slate-400">Estimated premium</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-amber-400">
            {formatCurrency(
              data.paymentFrequency === "monthly"
                ? result.totalMonthly
                : result.totalAnnual / 12,
            )}
          </span>
          <span className="text-lg text-slate-400">/ month</span>
        </div>
        {data.paymentFrequency === "annual" && (
          <p className="mt-2 text-sm text-slate-400">
            {formatCurrency(result.totalAnnual)} billed annually (5% pay-in-full discount
            applied)
          </p>
        )}
        {result.bundleDiscountPercent > 0 && (
          <p className="mt-3 inline-flex items-center rounded-full bg-amber-400/20 px-3 py-1 text-sm font-medium text-amber-300">
            {result.bundleDiscountPercent}% bundle discount applied
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Coverage breakdown</h3>
        {result.lineItems.map((item) => (
          <div
            key={item.type}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">{item.label}</h4>
              <span className="text-lg font-semibold text-slate-900">
                {formatCurrency(item.monthlyPremium)}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              {item.factors.map((factor) => (
                <li
                  key={factor.label}
                  className="flex justify-between text-sm text-slate-600"
                >
                  <span>{factor.label}</span>
                  <span className="font-medium text-slate-700">{factor.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="font-semibold text-slate-900">Price summary</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Subtotal</dt>
            <dd className="font-medium text-slate-900">
              {formatCurrency(result.subtotalMonthly)}/mo
            </dd>
          </div>
          {result.bundleDiscountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <dt>Bundle discount ({result.bundleDiscountPercent}%)</dt>
              <dd>-{formatCurrency(result.bundleDiscountAmount)}/mo</dd>
            </div>
          )}
          {result.deductibleAdjustment !== 0 && (
            <div
              className={`flex justify-between ${result.deductibleAdjustment > 0 ? "text-emerald-700" : "text-amber-700"}`}
            >
              <dt>Deductible adjustment</dt>
              <dd>
                {result.deductibleAdjustment > 0 ? "-" : "+"}
                {formatCurrency(Math.abs(result.deductibleAdjustment))}/mo
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
            <dt className="text-slate-900">Total</dt>
            <dd className="text-slate-900">
              {formatCurrency(result.totalMonthly)}/mo ·{" "}
              {formatCurrency(result.totalAnnual)}/yr
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        This is an estimated quote for demonstration purposes only. Final premiums
        may vary based on underwriting review, credit-based insurance scores, and
        state-specific regulations. No coverage is bound until you complete an
        application and receive policy documents.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="/auth/sign-up"
          className="inline-flex items-center rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
        >
          Continue to apply
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Print quote
        </button>
      </div>
    </div>
  );
}

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuoteFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quote, setQuote] = useState<QuoteResult | null>(null);

  function update<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function toggleCoverage(type: CoverageType) {
    const types = data.coverageTypes.includes(type)
      ? data.coverageTypes.filter((t) => t !== type)
      : [...data.coverageTypes, type];
    update("coverageTypes", types);
  }

  function handleNext() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (step === 3) {
      const result = calculateQuote(data);
      setQuote(result);
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleRecalculate() {
    setQuote(calculateQuote(data));
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <nav aria-label="Quote progress" className="mb-10">
        <ol className="flex items-center justify-between gap-1">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step
                    ? "bg-amber-400 text-slate-900"
                    : i === step
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {i < step ? (
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M3 8.5l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-2 hidden text-center text-xs sm:block ${
                  i === step ? "font-semibold text-slate-900" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Step 0: Personal info */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Tell us about yourself</h2>
              <p className="mt-1 text-sm text-slate-600">
                We use this information to personalize your quote and check availability
                in your area.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="firstName" required>
                  First name
                </FieldLabel>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Jane"
                />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <FieldLabel htmlFor="lastName" required>
                  Last name
                </FieldLabel>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Smith"
                />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="age" required>
                  Age
                </FieldLabel>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={100}
                  value={data.age}
                  onChange={(e) => update("age", parseInt(e.target.value, 10) || 0)}
                />
                <FieldError message={errors.age} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="zipCode" required>
                  ZIP code
                </FieldLabel>
                <Input
                  id="zipCode"
                  value={data.zipCode}
                  onChange={(e) => update("zipCode", e.target.value)}
                  placeholder="90210"
                  maxLength={10}
                />
                <FieldError message={errors.zipCode} />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="maritalStatus">Marital status</FieldLabel>
              <Select
                id="maritalStatus"
                value={data.maritalStatus}
                onChange={(e) =>
                  update("maritalStatus", e.target.value as QuoteFormData["maritalStatus"])
                }
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </Select>
            </div>
          </div>
        )}

        {/* Step 1: Coverage selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                What do you want to protect?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Select one or more coverage types. Bundle multiple policies to save up
                to 15%.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {COVERAGE_OPTIONS.map((option) => {
                const selected = data.coverageTypes.includes(option.type);
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => toggleCoverage(option.type)}
                    className={`rounded-xl border p-5 text-left transition-all ${
                      selected
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/30"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{option.title}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected
                            ? "border-amber-500 bg-amber-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 text-white" aria-hidden>
                            <path
                              d="M3 8.5l3 3 7-7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.coverageTypes} />
          </div>
        )}

        {/* Step 2: Product details */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Coverage details</h2>
              <p className="mt-1 text-sm text-slate-600">
                Provide details for each policy type you selected.
              </p>
            </div>

            {data.coverageTypes.includes("auto") && (
              <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">Auto insurance</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="vehicleYear" required>
                      Vehicle year
                    </FieldLabel>
                    <Input
                      id="vehicleYear"
                      type="number"
                      min={1990}
                      max={new Date().getFullYear() + 1}
                      value={data.vehicleYear}
                      onChange={(e) =>
                        update("vehicleYear", parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <FieldError message={errors.vehicleYear} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="vehicleMake" required>
                      Vehicle make
                    </FieldLabel>
                    <Select
                      id="vehicleMake"
                      value={data.vehicleMake}
                      onChange={(e) => update("vehicleMake", e.target.value)}
                    >
                      {VEHICLE_MAKES.map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </Select>
                    <FieldError message={errors.vehicleMake} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="annualMileage">Annual mileage</FieldLabel>
                    <Input
                      id="annualMileage"
                      type="number"
                      min={0}
                      step={1000}
                      value={data.annualMileage}
                      onChange={(e) =>
                        update("annualMileage", parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="drivingRecord">Driving record</FieldLabel>
                    <Select
                      id="drivingRecord"
                      value={data.drivingRecord}
                      onChange={(e) =>
                        update("drivingRecord", e.target.value as QuoteFormData["drivingRecord"])
                      }
                    >
                      <option value="clean">Clean — no violations</option>
                      <option value="minor">Minor violations (1–2)</option>
                      <option value="major">Major violations or accidents</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="autoCoverageLevel">Coverage level</FieldLabel>
                    <Select
                      id="autoCoverageLevel"
                      value={data.autoCoverageLevel}
                      onChange={(e) =>
                        update(
                          "autoCoverageLevel",
                          e.target.value as QuoteFormData["autoCoverageLevel"],
                        )
                      }
                    >
                      <option value="liability">Liability only</option>
                      <option value="standard">Standard (collision + comprehensive)</option>
                      <option value="comprehensive">Comprehensive (higher limits)</option>
                    </Select>
                  </div>
                </div>
              </section>
            )}

            {data.coverageTypes.includes("home") && (
              <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">Home insurance</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="homeValue" required>
                      Estimated home value
                    </FieldLabel>
                    <Input
                      id="homeValue"
                      type="number"
                      min={50000}
                      step={10000}
                      value={data.homeValue}
                      onChange={(e) =>
                        update("homeValue", parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <FieldError message={errors.homeValue} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="yearBuilt">Year built</FieldLabel>
                    <Input
                      id="yearBuilt"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={data.yearBuilt}
                      onChange={(e) =>
                        update("yearBuilt", parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="squareFootage" required>
                      Square footage
                    </FieldLabel>
                    <Input
                      id="squareFootage"
                      type="number"
                      min={200}
                      value={data.squareFootage}
                      onChange={(e) =>
                        update("squareFootage", parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <FieldError message={errors.squareFootage} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="homeCoverageLevel">Coverage level</FieldLabel>
                    <Select
                      id="homeCoverageLevel"
                      value={data.homeCoverageLevel}
                      onChange={(e) =>
                        update(
                          "homeCoverageLevel",
                          e.target.value as QuoteFormData["homeCoverageLevel"],
                        )
                      }
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Checkbox
                      checked={data.hasSecuritySystem}
                      onChange={(v) => update("hasSecuritySystem", v)}
                      label="Security system installed"
                      description="Monitored alarm or smart security system"
                    />
                  </div>
                </div>
              </section>
            )}

            {data.coverageTypes.includes("life") && (
              <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">Life insurance</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="lifeCoverageAmount" required>
                      Coverage amount
                    </FieldLabel>
                    <Select
                      id="lifeCoverageAmount"
                      value={data.lifeCoverageAmount}
                      onChange={(e) =>
                        update("lifeCoverageAmount", parseInt(e.target.value, 10))
                      }
                    >
                      <option value={250000}>$250,000</option>
                      <option value={500000}>$500,000</option>
                      <option value={750000}>$750,000</option>
                      <option value={1000000}>$1,000,000</option>
                      <option value={2000000}>$2,000,000</option>
                    </Select>
                    <FieldError message={errors.lifeCoverageAmount} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="termYears">Term length</FieldLabel>
                    <Select
                      id="termYears"
                      value={data.termYears}
                      onChange={(e) =>
                        update("termYears", parseInt(e.target.value, 10))
                      }
                    >
                      <option value={10}>10 years</option>
                      <option value={15}>15 years</option>
                      <option value={20}>20 years</option>
                      <option value={30}>30 years</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Checkbox
                      checked={data.isSmoker}
                      onChange={(v) => update("isSmoker", v)}
                      label="I use tobacco products"
                      description="Includes cigarettes, vaping, and other tobacco use"
                    />
                  </div>
                </div>
              </section>
            )}

            {data.coverageTypes.includes("business") && (
              <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">Business insurance</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="industry">Industry</FieldLabel>
                    <Select
                      id="industry"
                      value={data.industry}
                      onChange={(e) => update("industry", e.target.value)}
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind.value} value={ind.value}>
                          {ind.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="employeeCount" required>
                      Number of employees
                    </FieldLabel>
                    <Input
                      id="employeeCount"
                      type="number"
                      min={1}
                      value={data.employeeCount}
                      onChange={(e) =>
                        update("employeeCount", parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <FieldError message={errors.employeeCount} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="annualRevenue" required>
                      Annual revenue
                    </FieldLabel>
                    <Input
                      id="annualRevenue"
                      type="number"
                      min={10000}
                      step={10000}
                      value={data.annualRevenue}
                      onChange={(e) =>
                        update("annualRevenue", parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <FieldError message={errors.annualRevenue} />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="liabilityLimit">General liability limit</FieldLabel>
                    <Select
                      id="liabilityLimit"
                      value={data.liabilityLimit}
                      onChange={(e) =>
                        update("liabilityLimit", parseInt(e.target.value, 10))
                      }
                    >
                      <option value={500000}>$500,000</option>
                      <option value={1000000}>$1,000,000</option>
                      <option value={2000000}>$2,000,000</option>
                      <option value={5000000}>$5,000,000</option>
                    </Select>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Deductible & payment preferences
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Higher deductibles lower your premium. Pay annually for an additional
                5% discount.
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="deductible">Deductible amount</FieldLabel>
              <Select
                id="deductible"
                value={data.deductible}
                onChange={(e) => update("deductible", parseInt(e.target.value, 10))}
              >
                <option value={500}>$500 (higher premium)</option>
                <option value={1000}>$1,000 (standard)</option>
                <option value={1500}>$1,500 (5% savings)</option>
                <option value={2500}>$2,500 (8% savings)</option>
              </Select>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-slate-700">
                Payment frequency
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      value: "monthly" as const,
                      label: "Monthly",
                      description: "Pay each month, cancel anytime",
                    },
                    {
                      value: "annual" as const,
                      label: "Annual",
                      description: "Pay once per year, save 5%",
                    },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      data.paymentFrequency === option.value
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentFrequency"
                      value={option.value}
                      checked={data.paymentFrequency === option.value}
                      onChange={() => update("paymentFrequency", option.value)}
                      className="sr-only"
                    />
                    <span className="block font-semibold text-slate-900">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Quote summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Applicant</dt>
                  <dd className="font-medium text-slate-900">
                    {data.firstName} {data.lastName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Location</dt>
                  <dd className="font-medium text-slate-900">{data.zipCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Coverage types</dt>
                  <dd className="font-medium capitalize text-slate-900">
                    {data.coverageTypes.join(", ")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Deductible</dt>
                  <dd className="font-medium text-slate-900">
                    {formatCurrency(data.deductible)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && quote && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Your personalized quote
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Hi {data.firstName}, here&apos;s your estimated premium based on the
                information you provided.
              </p>
            </div>
            <QuoteSummary result={quote} data={data} />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          {step > 0 && step < 4 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Back
            </button>
          ) : step === 4 ? (
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setQuote(null);
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Start over
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {step === 3 ? "Calculate quote" : "Continue"}
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={handleRecalculate}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Recalculate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
