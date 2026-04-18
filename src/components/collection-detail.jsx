"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/components/ui/media-uploader";
import { ArrowLeft, Pencil, Plus, ExternalLink } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Convert a plain Cloudinary URL string → { url, publicId } for MediaUploader
function urlToMedia(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return { url, publicId: match ? match[1] : url };
}

// Status color map
const STATUS_COLORS = {
  LIVE: "text-emerald-400",
  READY_TO_LAUNCH: "text-blue-400",
  IN_PRODUCTION: "text-yellow-400",
  SOLD_OUT: "text-orange-400",
  DISCONTINUED: "text-red-400",
};

function StatusDot({ status }) {
  return (
    <span
      className={`text-xs font-medium ${STATUS_COLORS[status] ?? "text-muted-foreground"}`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-md" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-lg" />
    </div>
  );
}

/**
 * Shared dynamic collection detail page.
 *
 * Props:
 *   slug         — e.g. "traditions-reimagined"
 *   badge        — optional badge text (e.g. "Limited Edition")
 *   badgeVariant — shadcn badge variant
 */
export function CollectionDetailPage({ slug, badge, badgeVariant }) {
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    tagline: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // Media — initialised from DB when collection loads
  const [heroImages, setHeroImages] = useState([]);
  const [heroVideo, setHeroVideo] = useState([]);

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [colRes, prodRes] = await Promise.all([
          fetch(`${API}/api/admin/collections/${slug}`, {
            credentials: "include",
          }),
          fetch(`${API}/api/admin/products?collection=${slug}&limit=100`, {
            credentials: "include",
          }),
        ]);

        if (colRes.ok) {
          const { collection: col } = await colRes.json();
          setCollection(col);
          setEditForm({
            name: col.name ?? "",
            tagline: col.tagline ?? "",
            description: col.description ?? "",
          });
          if (col.heroImage)
            setHeroImages([urlToMedia(col.heroImage)].filter(Boolean));
          if (col.heroVideo)
            setHeroVideo([urlToMedia(col.heroVideo)].filter(Boolean));
        } else {
          toast.error("Failed to load collection.");
        }

        if (prodRes.ok) {
          const { products: prods } = await prodRes.json();
          setProducts(prods ?? []);
        }
      } catch {
        toast.error("Failed to load collection.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // ── Save media immediately when changed ──────────────────────────────────
  async function persistMedia(field, url) {
    if (!collection?.id) return;
    try {
      const res = await fetch(`${API}/api/admin/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [field]: url }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Failed to save.");
      } else {
        toast.success(
          field === "heroImage" ? "Hero image saved." : "Hero video saved.",
        );
      }
    } catch {
      toast.error("Failed to save media.");
    }
  }

  function handleImageChange(newImages) {
    setHeroImages(newImages);
    persistMedia("heroImage", newImages[0]?.url ?? null);
  }

  function handleVideoChange(newVideo) {
    setHeroVideo(newVideo);
    persistMedia("heroVideo", newVideo[0]?.url ?? null);
  }

  // ── Edit collection ──────────────────────────────────────────────────────
  async function handleEditSave() {
    if (!collection?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");
      setCollection((prev) => ({ ...prev, ...data.collection }));
      setEditOpen(false);
      toast.success("Collection updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((s, v) => s + (v.stock ?? 0), 0),
    0,
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/collections">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              {collection?.name ?? slug}
            </h1>
            {badge && (
              <Badge variant={badgeVariant ?? "secondary"}>{badge}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {collection?.tagline ?? ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4 mr-2" />
          Edit Collection
        </Button>
      </div>

      {/* Media upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Hero Image
          </p>
          <MediaUploader
            folder="collections"
            type="image"
            multiple
            maxFiles={3}
            label="Upload hero image(s)"
            value={heroImages}
            onChange={handleImageChange}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Hero Video
          </p>
          <MediaUploader
            folder="videos"
            type="video"
            label="Upload hero video"
            value={heroVideo}
            onChange={handleVideoChange}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Products
          </p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Total Stock
          </p>
          <p
            className={`text-2xl font-bold ${totalStock === 0 ? "text-destructive" : ""}`}
          >
            {totalStock}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Description
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {collection?.description || "No description set."}
          </p>
        </div>
      </div>

      {/* Products table */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Products in this Collection</h2>
        <Button size="sm" asChild>
          <Link href="/dashboard/products/new">
            <Plus className="size-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-border h-40 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No products yet. Add the first one.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Stock
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">
                  Price
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const stock = p.variants.reduce(
                  (s, v) => s + (v.stock ?? 0),
                  0,
                );
                const salePrice =
                  p.discount > 0
                    ? (p.basePrice * (1 - p.discount / 100)).toFixed(2)
                    : null;
                const thumb =
                  p.variants.find((v) => v.images?.[0])?.images?.[0] ??
                  p.images?.[0];

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={p.name}
                            className="size-9 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-9 rounded bg-muted shrink-0" />
                        )}
                        <span className="font-medium line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                      {p.type}
                    </td>
                    <td className="px-4 py-3">
                      <StatusDot status={p.status} />
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums ${stock === 0 ? "text-destructive" : ""}`}
                    >
                      {stock}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                      {salePrice ? (
                        <span>
                          <span className="line-through text-muted-foreground mr-1">
                            ${p.basePrice.toFixed(2)}
                          </span>
                          ${salePrice}
                        </span>
                      ) : (
                        `$${p.basePrice.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit collection dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input
                placeholder="Short headline shown on the hero"
                value={editForm.tagline}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tagline: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                className="min-h-24 resize-y"
                placeholder="What this collection is about..."
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
