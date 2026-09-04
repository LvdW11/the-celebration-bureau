import type { PricedProduct } from "@/lib/plan";
import { money } from "@/lib/plan";

function Shell({ product, children }: { product: PricedProduct; children: React.ReactNode }) {
  if (!product.affiliateUrl) {
    return <div className="surface flex overflow-hidden">{children}</div>;
  }
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="surface flex overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      {children}
    </a>
  );
}

export function ProductCard({ product, note }: { product: PricedProduct; note?: string }) {
  return (
    <Shell product={product}>
      <img
        src={product.image}
        alt={product.name}
        width={640}
        height={640}
        loading="lazy"
        className="size-24 shrink-0 object-cover sm:size-28"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <p className="text-[0.95rem] leading-snug">{product.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {note ?? product.needLabel} · {product.retailer}
          </p>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="font-display text-xl">{money(product.lineTotal)}</span>
          <span className="text-xs tracking-wide text-gold">
            {product.affiliateUrl ? "Shop →" : product.estimatedDelivery}
          </span>
        </div>
      </div>
    </Shell>
  );
}

export function ProductGrid({ products, className }: { products: PricedProduct[]; className?: string }) {
  if (products.length === 0) return null;
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className ?? ""}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

/** Compact tiles for overview pages: image, name, price, retailer. */
export function ProductStrip({ products, className }: { products: PricedProduct[]; className?: string }) {
  if (products.length === 0) return null;
  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className ?? ""}`}>
      {products.map((p) => {
        const inner = (
          <>
            <img
              src={p.image}
              alt={p.name}
              width={640}
              height={640}
              loading="lazy"
              className="h-28 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm leading-snug">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.retailer}</p>
              <p className="mt-2 font-display text-lg">{money(p.lineTotal)}</p>
            </div>
          </>
        );
        return p.affiliateUrl ? (
          <a
            key={p.id}
            href={p.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="surface overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            {inner}
          </a>
        ) : (
          <div key={p.id} className="surface overflow-hidden">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
