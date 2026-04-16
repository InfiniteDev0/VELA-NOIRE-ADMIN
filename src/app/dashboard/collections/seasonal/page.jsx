import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, ArrowLeft, Pencil } from "lucide-react";

export default function SeasonalCollectionPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/collections">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Seasonal</h1>
            <Badge variant="secondary">4 Seasons</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Summer · Winter · Autumn · Spring
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Pencil className="size-4 mr-2" />
          Edit Collection
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="size-8" />
          <p className="text-sm">Hero image / video — upload coming soon.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Products
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Total Stock
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Revenue
          </p>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Products in this Collection</h2>
        <Button size="sm" asChild>
          <Link href="/dashboard/products/new">
            <Plus className="size-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      <div className="rounded-lg border border-border h-40 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No products yet. Add the first one.
        </p>
      </div>
    </div>
  );
}
