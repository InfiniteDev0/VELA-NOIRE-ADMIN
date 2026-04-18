"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_COLORS = {
  IN_PRODUCTION: "secondary",
  READY_TO_LAUNCH: "outline",
  LIVE: "default",
  SOLD_OUT: "destructive",
  DISCONTINUED: "destructive",
};

const STATUS_LABELS = {
  IN_PRODUCTION: "In Production",
  READY_TO_LAUNCH: "Ready to Launch",
  LIVE: "Live",
  SOLD_OUT: "Sold Out",
  DISCONTINUED: "Discontinued",
};

function totalStock(variants) {
  return (variants ?? []).reduce((s, v) => s + (v.stock ?? 0), 0);
}

function fmt(val) {
  if (val === null || val === undefined) return "—";
  return val;
}

export default function ProductViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/admin/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Product not found.");
        const data = await res.json();
        setProduct(data.product ?? data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <ProductViewSkeleton />;
  if (!product)
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="outline" asChild className="w-fit">
          <Link href="/dashboard/products">
            <ChevronLeft className="size-4 mr-1" /> Back to products
          </Link>
        </Button>
      </div>
    );

  const currentVariant = product.variants?.[activeVariant];
  // ?? does NOT catch empty arrays — use length check so we always fall back
  // to product-level images when the active variant has none.
  const variantImages = currentVariant?.images ?? [];
  const images =
    variantImages.length > 0
      ? variantImages
      : product.images?.length
        ? product.images
        : [];
  const effectivePrice = product.discount
    ? (product.basePrice * (1 - product.discount / 100)).toFixed(2)
    : product.basePrice?.toFixed(2);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="size-4 mr-1" /> Products
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/products/${id}/edit`}>
            <Pencil className="size-3.5 mr-2" /> Edit product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Image gallery ── */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-muted">
            {images[activeImage] ? (
              <img
                key={images[activeImage]}
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage(
                      (i) => (i - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`size-1.5 rounded-full transition-all ${
                        activeImage === i ? "bg-white w-4" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`size-16 rounded overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-foreground"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Variant colour selector */}
          {product.variants?.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-muted-foreground">Colors:</span>
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  title={v.colorName}
                  onClick={() => {
                    setActiveVariant(i);
                    setActiveImage(0);
                  }}
                  className={`size-6 rounded-full border-2 transition-all ${
                    activeVariant === i
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: v.colorHex ?? "#ccc" }}
                />
              ))}
              {currentVariant && (
                <span className="text-xs text-muted-foreground ml-1">
                  {currentVariant.colorName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="flex flex-col gap-5">
          {/* Name + status */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold leading-tight">
                {product.name}
              </h1>
              <Badge variant={STATUS_COLORS[product.status] ?? "outline"}>
                {STATUS_LABELS[product.status] ?? product.status}
              </Badge>
            </div>
            {product.tagline && (
              <p className="text-muted-foreground mt-1">{product.tagline}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {product.isNew && <Badge variant="outline">New</Badge>}
            {product.isLimitedEdition && (
              <Badge variant="outline">Limited Edition</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="outline">Best Seller</Badge>
            )}
            {(product.tags ?? []).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div>
            <span className="text-3xl font-medium">${effectivePrice}</span>
            {product.discount > 0 && (
              <span className="text-muted-foreground line-through ml-3 text-lg">
                ${product.basePrice?.toFixed(2)}
              </span>
            )}
            {product.discount > 0 && (
              <Badge variant="destructive" className="ml-2">
                -{product.discount}%
              </Badge>
            )}
          </div>

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Detail
              label="Type"
              value={
                product.type?.charAt(0) + product.type?.slice(1).toLowerCase()
              }
            />
            <Detail label="Total Stock" value={totalStock(product.variants)} />
            <Detail label="SKU" value={product.sku} />
            <Detail label="Season" value={product.season} />
            {product.type === "ABAYA" && (
              <>
                <Detail
                  label="Style"
                  value={product.abayaStyle?.replace(/_/g, " ")}
                />
                <Detail
                  label="Sizes"
                  value={(product.sizes ?? []).join(", ")}
                />
                <Detail
                  label="Lengths"
                  value={(product.lengths ?? []).join(", ")}
                />
                <Detail label="Fabric" value={product.fabric} />
              </>
            )}
            {product.collection && (
              <Detail label="Collection" value={product.collection.name} />
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Variants table ── */}
      {product.variants?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Variants ({product.variants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Color</th>
                    <th className="text-left py-2 pr-4 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 font-medium">Stock</th>
                    <th className="text-left py-2 pr-4 font-medium">Images</th>
                    <th className="text-left py-2 font-medium">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <span
                          className="size-5 rounded-full inline-block border border-border"
                          style={{ backgroundColor: v.colorHex ?? "#ccc" }}
                        />
                      </td>
                      <td className="py-2 pr-4">{v.colorName ?? "—"}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            v.stock === 0 ? "text-destructive font-medium" : ""
                          }
                        >
                          {v.stock}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-1">
                          {(v.images ?? []).slice(0, 4).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className="size-8 rounded object-cover"
                            />
                          ))}
                          {(v.images?.length ?? 0) > 4 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{v.images.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2">
                        {v.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}

function ProductViewSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="aspect-3/4 rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-px w-full" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
