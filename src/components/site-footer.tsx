import Link from "next/link";

const footerLinks = {
  Products: [
    { label: "Auto insurance", href: "#products" },
    { label: "Home insurance", href: "#products" },
    { label: "Life insurance", href: "#products" },
    { label: "Business insurance", href: "#products" },
  ],
  Company: [
    { label: "About us", href: "#why-us" },
    { label: "Claims", href: "#contact" },
    { label: "Careers", href: "#contact" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-amber-400"
                  aria-hidden
                >
                  <rect x="4" y="14" width="16" height="4" rx="1" fill="currentColor" opacity="0.5" />
                  <rect x="6" y="9" width="12" height="4" rx="1" fill="currentColor" opacity="0.75" />
                  <rect x="8" y="4" width="8" height="4" rx="1" fill="currentColor" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">Insurance Stack</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Layered protection for what matters most. Modern insurance built for
              families and businesses.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            This is a demo project. No real insurance is being sold.
          </p>
        </div>
      </div>
    </footer>
  );
}
