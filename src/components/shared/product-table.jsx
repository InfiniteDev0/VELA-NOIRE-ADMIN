"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function totalStock(variants) {
  return (variants ?? []).reduce((s, v) => s + (v.stock ?? 0), 0);
}

function effectivePrice(basePrice, discount) {
  if (!basePrice) return "—";
  return discount > 0
    ? (basePrice * (1 - discount / 100)).toFixed(2)
    : basePrice.toFixed(2);
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function ProductRowSkeleton() {
  return (
    <TableRow>
      {[...Array(8)].map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
//
// Props:
//   products    — Product[]   — array of products from the API
//   loading     — boolean     — show skeleton rows while fetching
//   hasFilters  — boolean     — controls the empty-state message
//   onDelete    — ({ id, name }) => void — called when Delete is clicked
//                               (parent owns the confirm dialog)
//
// Navigation (View / Edit) is handled internally via useRouter so the
// parent doesn't need to pass route strings.
// ─────────────────────────────────────────────────────────────────────────────

export function ProductTable({
  products = [],
  loading = false,
  hasFilters = false,
  onDelete,
}) {
  const router = useRouter();

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* ── Loading skeleton ── */}
          {loading ? (
            [...Array(5)].map((_, i) => <ProductRowSkeleton key={i} />)
          ) : products.length === 0 ? (
            /* ── Empty state ── */
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-16 text-muted-foreground"
              >
                {hasFilters
                  ? "No products match your filters."
                  : "No products yet. Add your first product to get started."}
              </TableCell>
            </TableRow>
          ) : (
            /* ── Product rows ── */
            products.map((p) => {
              const defaultVariant =
                p.variants?.find((v) => v.isDefault) ?? p.variants?.[0];
              const thumb = defaultVariant?.images?.[0] ?? p.images?.[0];
              const stock = totalStock(p.variants);
              const price = effectivePrice(p.basePrice, p.discount);

              return (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/products/${p.id}`)}
                >
                  {/* Thumbnail */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.name}
                        className="size-10 rounded object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-[10px]">
                        N/A
                      </div>
                    )}
                  </TableCell>

                  {/* Name + tags */}
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {p.isNew && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          New
                        </Badge>
                      )}
                      {p.isLimitedEdition && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          Limited
                        </Badge>
                      )}
                      {p.isBestSeller && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="text-sm text-muted-foreground">
                    {p.type
                      ? p.type.charAt(0) + p.type.slice(1).toLowerCase()
                      : "—"}
                  </TableCell>

                  {/* Collection */}
                  <TableCell className="text-sm text-muted-foreground">
                    {p.collection?.name ?? (
                      <span className="italic opacity-50">None</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={STATUS_COLORS[p.status] ?? "outline"}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </Badge>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-sm">
                    <div>${price}</div>
                    {p.discount > 0 && (
                      <div className="text-[10px] text-muted-foreground line-through">
                        ${p.basePrice.toFixed(2)}
                      </div>
                    )}
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span
                      className={
                        stock === 0 ? "text-destructive font-medium" : "text-sm"
                      }
                    >
                      {stock}
                    </span>
                  </TableCell>

                  {/* Colour swatches */}
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(p.variants ?? []).slice(0, 5).map((v) => (
                        <span
                          key={v.id}
                          title={v.colorName}
                          className="size-4 rounded-full border border-border inline-block shrink-0"
                          style={{ backgroundColor: v.colorHex ?? "#ccc" }}
                        />
                      ))}
                      {(p.variants?.length ?? 0) > 5 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{p.variants.length - 5}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions — stop row click propagation */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/products/${p.id}`)
                          }
                        >
                          <Eye className="size-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/products/${p.id}/edit`)
                          }
                        >
                          <Pencil className="size-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete?.({ id: p.id, name: p.name })}
                        >
                          <Trash2 className="size-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
