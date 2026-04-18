"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MediaUploader } from "@/components/ui/media-uploader";
import { X, Plus, Link2, ImageIcon } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Convert plain URL strings from DB â†’ { url, publicId } for MediaUploader */
function toMediaItems(urls = []) {
  return urls.map((url) => ({ url, publicId: url.split("/").pop() }));
}
/** Convert MediaUploader value â†’ plain URL strings for DB */
function toUrlStrings(items = []) {
  return items.map((i) => i.url);
}

export default function ModelForm({ initial = null, allProducts = [] }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [nationality, setNationality] = useState(initial?.nationality ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  // MediaUploader uses { url, publicId } format
  const [profileImage, setProfileImage] = useState(
    initial?.profileImage ? [{ url: initial.profileImage, publicId: initial.profileImage.split("/").pop() }] : [],
  );
  const [images, setImages] = useState(toMediaItems(initial?.images));
  const [videos, setVideos] = useState(toMediaItems(initial?.videos));

  // Linked products â€” each entry has productId, name, caption, linkImage ({ url, publicId } | null)
  const [linkedProducts, setLinkedProducts] = useState(
    initial?.products?.map((lp) => ({
      productId: lp.product.id,
      name: lp.product.name,
      caption: lp.caption ?? "",
      linkImage: lp.linkImage ? [{ url: lp.linkImage, publicId: lp.linkImage.split("/").pop() }] : [],
    })) ?? [],
  );
  const [newProductId, setNewProductId] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function addLinkedProduct() {
    if (!newProductId) return;
    const product = allProducts.find((p) => p.id === newProductId);
    if (!product) return;
    if (linkedProducts.find((lp) => lp.productId === newProductId)) return;
    setLinkedProducts([
      ...linkedProducts,
      { productId: newProductId, name: product.name, caption: newCaption, linkImage: [] },
    ]);
    setNewProductId("");
    setNewCaption("");
  }

  function updateLink(i, patch) {
    const updated = [...linkedProducts];
    updated[i] = { ...updated[i], ...patch };
    setLinkedProducts(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name,
        slug,
        bio,
        nationality,
        profileImage: profileImage[0]?.url ?? null,
        images: toUrlStrings(images),
        videos: toUrlStrings(videos),
        isActive,
      };

      const url = isEdit
        ? `${API}/api/admin/models/${initial.id}`
        : `${API}/api/admin/models`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      const modelId = data.model.id;

      // Remove old links, then re-add current ones
      if (isEdit) {
        for (const lp of initial.products ?? []) {
          await fetch(`${API}/api/admin/models/${modelId}/products/${lp.product.id}`, {
            method: "DELETE",
            credentials: "include",
          });
        }
      }
      for (const lp of linkedProducts) {
        await fetch(`${API}/api/admin/models/${modelId}/products`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: lp.productId,
            caption: lp.caption,
            linkImage: lp.linkImage[0]?.url ?? null,
          }),
        });
      }

      router.push(`/dashboard/gala/models/${modelId}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded">{error}</p>
      )}

      {/*  Basic info  */}
      <section className="space-y-4">
        <div className="space-y-1">
          <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!isEdit) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Fatima Al Rashid"
            required
          />
        </div>
        <div className="space-y-1">
          <Label>Slug *</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="e.g. fatima-al-rashid"
            required
          />
        </div>
        <div className="space-y-1">
          <Label>Nationality</Label>
          <Input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="e.g. Saudi Arabia"
          />
        </div>
        <div className="space-y-1">
          <Label>Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Short personal story or introâ€¦"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
          <Label htmlFor="isActive">Active (visible on storefront)</Label>
        </div>
      </section>

      {/*  Profile portrait  */}
      <section className="space-y-2">
        <Label className="text-base font-medium">Profile Portrait</Label>
        <p className="text-xs text-muted-foreground">Single editorial photo used as the model's main avatar</p>
        <MediaUploader
          folder="models"
          type="image"
          multiple={false}
          value={profileImage}
          onChange={setProfileImage}
          label="Upload portrait"
        />
      </section>

      {/*  Campaign images  */}
      <section className="space-y-2">
        <Label className="text-base font-medium">Campaign / Editorial Images</Label>
        <p className="text-xs text-muted-foreground">Photos shown on the model's page” shoots, lookbooks, editorials</p>
        <MediaUploader
          folder="models"
          type="image"
          multiple
          maxFiles={20}
          value={images}
          onChange={setImages}
          label="Upload campaign photos"
        />
      </section>

      {/*  Campaign videos  */}
      <section className="space-y-2">
        <Label className="text-base font-medium">Campaign Videos</Label>
        <p className="text-xs text-muted-foreground">Commercials, behind-the-scenes, or brand introductions</p>
        <MediaUploader
          folder="modelVideos"
          type="video"
          multiple
          maxFiles={5}
          value={videos}
          onChange={setVideos}
          label="Upload campaign videos"
        />
      </section>

      {/*  Linked products  */}
      <section className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Products She's Wearing
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Link products to this model and upload the photo of her wearing it
          </p>
        </div>

        {/* Existing links */}
        {linkedProducts.map((lp, i) => (
          <div key={lp.productId} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{lp.name}</span>
              <button
                type="button"
                onClick={() => setLinkedProducts(linkedProducts.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Caption</Label>
              <Input
                value={lp.caption}
                onChange={(e) => updateLink(i, { caption: e.target.value })}
                className="h-8 text-xs"
                placeholder='e.g. "Wearing the Midnight Bloom in Steel Ash"'
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Photo of her wearing this product
              </Label>
              <MediaUploader
                folder="models"
                type="image"
                multiple={false}
                value={lp.linkImage}
                onChange={(val) => updateLink(i, { linkImage: val })}
                label="Upload wearing photo"
                className="min-h-[80px]"
              />
            </div>
          </div>
        ))}

        {/* Add new link */}
        <div className="border border-dashed rounded-lg p-4 space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Add product</p>
          <div className="flex gap-2">
            <select
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select a product</option>
              {allProducts
                .filter((p) => !linkedProducts.find((lp) => lp.productId === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <Input
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon" onClick={addLinkedProduct}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving" : isEdit ? "Save Changes" : "Create Model"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
