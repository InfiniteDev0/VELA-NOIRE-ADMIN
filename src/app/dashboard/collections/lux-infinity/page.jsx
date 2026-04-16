"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/ui/media-uploader";
import { Plus, ArrowLeft, Pencil } from "lucide-react";

export default function LuxInfinityPage() {
  const [heroImages, setHeroImages] = useState([]);
  const [heroVideo, setHeroVideo] = useState([]);
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
            <h1 className="text-xl font-semibold">Lux Infinity</h1>
            <Badge variant="outline">Premium</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Velvet, silk, and jewel tones — for the bold.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Pencil className="size-4 mr-2" />
          Edit Collection
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Hero Image</p>
          <MediaUploader folder="collections" type="image" multiple maxFiles={3} label="Upload hero image(s)" value={heroImages} onChange={setHeroImages} />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Hero Video</p>
          <MediaUploader folder="videos" type="video" label="Upload hero video" value={heroVideo} onChange={setHeroVideo} />
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
