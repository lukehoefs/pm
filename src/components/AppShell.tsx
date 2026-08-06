import Link from "next/link";

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
      <header className="border-b border-[var(--line)] bg-[var(--panel)]/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white shadow-sm">
                UC
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  Upshore PM
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Civil project management
                </div>
              </div>
            </Link>
            {title ? (
              <>
                <span className="hidden text-[var(--line)] sm:inline">/</span>
                <div className="min-w-0 hidden sm:block">
                  <div className="truncate text-sm font-medium">{title}</div>
                  {subtitle ? (
                    <div className="truncate text-[11px] text-[var(--muted)]">
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
                  className="rounded-lg px-2.5 py-1.5 text-[var(--muted)] transition hover:bg-slate-100 hover:text-[var(--ink)]"
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
