import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[var(--surface)] text-[var(--ink)]">
      <header className="border-b border-black/20 bg-[var(--header)] sticky top-0 z-20 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pps-logo-white.png"
                alt={`${BRAND.name} logo`}
                className="h-10 w-10 shrink-0"
              />
              <div className="leading-tight">
                <div className="display text-lg leading-none tracking-wide text-white">
                  {BRAND.name}
                </div>
                <div className="text-[11px] text-white/60">
                  Waterworks distribution · Est. {BRAND.established}
                </div>
              </div>
            </Link>
            {title ? (
              <>
                <span className="hidden text-white/25 sm:inline">/</span>
                <div className="min-w-0 hidden sm:block">
                  <div className="truncate text-sm font-medium text-white">
                    {title}
                  </div>
                  {subtitle ? (
                    <div className="truncate text-[11px] text-white/60">
                      {subtitle}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <nav className="flex items-center gap-1 text-sm font-medium">
              {[
                { href: "/", label: "Projects" },
                { href: "/submittals", label: "Submittals" },
                { href: "/products", label: "Products" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2.5 py-1.5 text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {actions}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
