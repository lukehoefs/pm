import { AppShell } from "@/components/AppShell";
import { ProductLibrary } from "@/components/ProductLibrary";
import { listProducts } from "@/lib/store";
import { VENDOR_CATALOG } from "@/lib/vendor-catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <AppShell title="Product Library" subtitle="Cut sheets for submittals">
      <div className="space-y-10">
        <ProductLibrary initialProducts={products} />
        <section>
          <h2 className="display text-2xl text-[var(--header)]">
            Vendor Line Card
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
            Submittal literature for the manufacturers we distribute. Use these
            when a product needs a cut sheet that isn&apos;t in the library yet.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VENDOR_CATALOG.map((vendor) => (
              <div
                key={vendor.name}
                className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 shadow-sm"
              >
                <div className="text-sm font-semibold">{vendor.name}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">
                  {vendor.products.length} product
                  {vendor.products.length === 1 ? "" : "s"} in library
                </div>
                <div className="mt-2 flex gap-3 text-xs font-medium">
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    Website
                  </a>
                  <a
                    href={vendor.literatureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    Submittal literature
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
