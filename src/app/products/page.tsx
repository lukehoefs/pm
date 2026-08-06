import { AppShell } from "@/components/AppShell";
import { ProductLibrary } from "@/components/ProductLibrary";
import { listProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <AppShell title="Product Library" subtitle="Cut sheets for submittals">
      <ProductLibrary initialProducts={products} />
    </AppShell>
  );
}
