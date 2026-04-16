"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, X, Trash2 } from "lucide-react";
import { MediaUploader } from "@/components/ui/media-uploader";

// ── constants ────────────────────────────────────────────────────────────────

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "Custom"];
const LENGTHS = [
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
];
const ABAYA_STYLES = [
  { value: "OPEN_FRONT", label: "Open Front (As Seen On Model)" },
  { value: "CLOSED_FRONT", label: "Closed Front (With Buttons)" },
  { value: "HALF_CLOSED", label: "Half Closed (3–4 Buttons)" },
  { value: "COMPLETELY_CLOSED", label: "Completely Closed (Wear From Top)" },
];
const PRODUCT_TYPES = [
  "ABAYA",
  "PERFUME",
  "BRACELET",
  "HANDBAG",
  "SHAYLA",
  "SHOES",
  "ACCESSORY",
];
const STATUSES = [
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "READY_TO_LAUNCH", label: "Ready to Launch" },
  { value: "LIVE", label: "Live" },
  { value: "SOLD_OUT", label: "Sold Out" },
  { value: "DISCONTINUED", label: "Discontinued" },
];
const SEASONS = ["SUMMER", "WINTER", "AUTUMN", "SPRING"];
const PRESET_TAGS = [
  "EID_SALE",
  "ONGOING_DISCOUNT",
  "RAMADAN",
  "NEW_IN",
  "BESTSELLER",
  "LIMITED",
];

// ── sub-components ────────────────────────────────────────────────────────────

function ToggleChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
        selected
          ? "bg-white text-black border-white"
          : "bg-transparent text-muted-foreground border-border hover:border-white/40"
      }`}
    >
      {label}
    </button>
  );
}

function ColorVariantCard({ variant, index, onChange, onRemove }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Color {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Color Name</Label>
          <Input
            placeholder="e.g. Premium Blue"
            value={variant.colorName}
            onChange={(e) => onChange(index, "colorName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Hex</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={variant.colorHex || "#000000"}
              onChange={(e) => onChange(index, "colorHex", e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-1"
            />
            <Input
              placeholder="#000000"
              value={variant.colorHex}
              onChange={(e) => onChange(index, "colorHex", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">SKU</Label>
          <Input
            placeholder="e.g. VN-ABY-001-BLUE"
            value={variant.sku}
            onChange={(e) => onChange(index, "sku", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Stock</Label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={variant.stock}
            onChange={(e) => onChange(index, "stock", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label className="text-xs">
            Price Override (leave blank to use base price)
          </Label>
          <Input
            type="number"
            placeholder="Optional"
            value={variant.priceOverride}
            onChange={(e) => onChange(index, "priceOverride", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Images for this color</Label>
        <MediaUploader
          folder="variants"
          type="image"
          multiple
          maxFiles={8}
          label="Upload color images"
          value={variant.images || []}
          onChange={(v) => onChange(index, "images", v)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={variant.isDefault}
          onCheckedChange={(v) => onChange(index, "isDefault", v)}
          id={`default-${index}`}
        />
        <Label htmlFor={`default-${index}`} className="text-xs">
          Show this color first on product page
        </Label>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();

  // ── remote data for dropdowns ──────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    Promise.all([
      fetch(`${API}/api/admin/categories`, { credentials: "include" }).then(
        (r) => r.json(),
      ),
      fetch(`${API}/api/admin/collections`, { credentials: "include" }).then(
        (r) => r.json(),
      ),
    ])
      .then(([catData, colData]) => {
        setCategories(catData.categories ?? []);
        setCollections(colData.collections ?? []);
      })
      .catch(console.error);
  }, []);

  // ── form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    description: "",
    story: "",
    caption: "",
    designer: "",
    basePrice: "",
    discount: "",
    type: "ABAYA",
    status: "IN_PRODUCTION",
    collectionId: "",
    categoryId: "",
    season: "",
    fabric: "",
    shaylaIncluded: false,
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    launchDate: "",
    releaseDate: "",
    tags: [],
    availableSizes: [],
    availableLengths: [],
    availableStyles: [],
    images: [],
    variants: [
      {
        colorName: "",
        colorHex: "#000000",
        sku: "",
        stock: 0,
        priceOverride: "",
        isDefault: true,
        images: [],
      },
    ],
  });

  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleMulti(field, value) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  function addTag(tag) {
    const t = tag.trim().toUpperCase().replace(/\s+/g, "_");
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(tag) {
    set(
      "tags",
      form.tags.filter((t) => t !== tag),
    );
  }

  function addVariant() {
    set("variants", [
      ...form.variants,
      {
        colorName: "",
        colorHex: "#000000",
        sku: "",
        stock: 0,
        priceOverride: "",
        isDefault: false,
        images: [],
      },
    ]);
  }

  function updateVariant(index, field, value) {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [field]: value };
    set("variants", updated);
  }

  function removeVariant(index) {
    set(
      "variants",
      form.variants.filter((_, i) => i !== index),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!form.name.trim()) return setSubmitError("Product name is required.");
    if (!form.basePrice) return setSubmitError("Base price is required.");
    if (!form.categoryId) return setSubmitError("Please select a category.");
    if (form.images.length === 0)
      return setSubmitError("At least one product image is required.");

    const payload = {
      name: form.name.trim(),
      description: form.description,
      story: form.story,
      caption: form.caption,
      designer: form.designer,
      basePrice: parseFloat(form.basePrice),
      discount: form.discount ? parseFloat(form.discount) : 0,
      type: form.type,
      status: form.status,
      categoryId: form.categoryId || null,
      collectionId: form.collectionId || null,
      season: form.season || null,
      fabric: form.fabric,
      shaylaIncluded: form.shaylaIncluded,
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isLimitedEdition: form.isLimitedEdition,
      launchDate: form.launchDate || null,
      releaseDate: form.releaseDate || null,
      tags: form.tags,
      availableSizes: form.availableSizes,
      availableLengths: form.availableLengths.map(Number),
      availableStyles: form.availableStyles,
      // MediaUploader gives { url, publicId } — backend expects url strings
      images: form.images.map((img) => img.url),
      variants: form.variants.map((v) => ({
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stock: parseInt(v.stock, 10) || 0,
        priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
        isDefault: v.isDefault,
        images: (v.images || []).map((img) => img.url),
      })),
    };

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product.");
      router.push("/dashboard/products");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isAbaya = form.type === "ABAYA";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* ── header ── */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new product.
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">Discard</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </div>

      {submitError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6"
      >
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Product Name</Label>
                <Input
                  placeholder="e.g. Midnight Voile Abaya"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the product — fabric feel, drape, occasion..."
                  className="min-h-32 resize-y"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUploader
                folder="products"
                type="image"
                multiple
                maxFiles={10}
                label="Upload product images (shown when no variant is selected)"
                value={form.images}
                onChange={(v) => set("images", v)}
              />
            </CardContent>
          </Card>

          {/* Abaya Details */}
          {isAbaya && (
            <Card>
              <CardHeader>
                <CardTitle>Abaya Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1.5">
                  <Label>Fabric / Material</Label>
                  <Input
                    placeholder="e.g. Nidha, Crepe, Chiffon Silk, Velvet"
                    value={form.fabric}
                    onChange={(e) => set("fabric", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <ToggleChip
                        key={s}
                        label={s}
                        selected={form.availableSizes.includes(s)}
                        onClick={() => toggleMulti("availableSizes", s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Lengths (inches)</Label>
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map((l) => (
                      <ToggleChip
                        key={l}
                        label={l}
                        selected={form.availableLengths.includes(l)}
                        onClick={() => toggleMulti("availableLengths", l)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Front-Opening Styles</Label>
                  <div className="space-y-2">
                    {ABAYA_STYLES.map((s) => (
                      <div key={s.value} className="flex items-center gap-2">
                        <Checkbox
                          id={s.value}
                          checked={form.availableStyles.includes(s.value)}
                          onCheckedChange={() =>
                            toggleMulti("availableStyles", s.value)
                          }
                        />
                        <Label
                          htmlFor={s.value}
                          className="font-normal cursor-pointer"
                        >
                          {s.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="shayla"
                    checked={form.shaylaIncluded}
                    onCheckedChange={(v) => set("shaylaIncluded", v)}
                  />
                  <Label htmlFor="shayla">
                    Shayla (headscarf) included with this abaya
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Color Variants</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus className="size-4 mr-1" /> Add Color
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.variants.map((v, i) => (
                <ColorVariantCard
                  key={i}
                  variant={v}
                  index={i}
                  onChange={updateVariant}
                  onRemove={() => removeVariant(i)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Story & Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Story & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>The Story</Label>
                <Textarea
                  placeholder="The inspiration or reason behind this piece..."
                  className="min-h-24 resize-y"
                  value={form.story}
                  onChange={(e) => set("story", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Caption</Label>
                <Input
                  placeholder="Short social-style caption shown on product page"
                  value={form.caption}
                  onChange={(e) => set("caption", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designer / Maker</Label>
                <Input
                  placeholder="Name of the designer or maker"
                  value={form.designer}
                  onChange={(e) => set("designer", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Organisation */}
          <Card>
            <CardHeader>
              <CardTitle>Organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Product Type</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => set("categoryId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Collection</Label>
                <Select
                  value={form.collectionId}
                  onValueChange={(v) => set("collectionId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {collections.find((c) => c.id === form.collectionId)?.slug ===
                "seasonal" && (
                <div className="space-y-1.5">
                  <Label>Season</Label>
                  <Select
                    value={form.season}
                    onValueChange={(v) => set("season", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEASONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Base Price (USD)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={form.basePrice}
                  onChange={(e) => set("basePrice", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0"
                  value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                />
              </div>
              {form.basePrice && form.discount ? (
                <p className="text-sm text-muted-foreground">
                  Sale price:{" "}
                  <span className="text-white font-medium">
                    ${(form.basePrice * (1 - form.discount / 100)).toFixed(2)}
                  </span>
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Labels */}
          <Card>
            <CardHeader>
              <CardTitle>Labels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { field: "isNew", label: "Mark as New Arrival" },
                  { field: "isBestSeller", label: "Mark as Best Seller" },
                  { field: "isLimitedEdition", label: "Limited Edition" },
                ].map(({ field, label }) => (
                  <div
                    key={field}
                    className="flex items-center justify-between"
                  >
                    <Label
                      htmlFor={field}
                      className="font-normal cursor-pointer"
                    >
                      {label}
                    </Label>
                    <Switch
                      id={field}
                      checked={form[field]}
                      onCheckedChange={(v) => set(field, v)}
                    />
                  </div>
                ))}
              </div>

              {form.isLimitedEdition && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Launch Date (announced — visible but not buyable)
                      </Label>
                      <Input
                        type="datetime-local"
                        value={form.launchDate}
                        onChange={(e) => set("launchDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Release Date (goes live for purchase)
                      </Label>
                      <Input
                        type="datetime-local"
                        value={form.releaseDate}
                        onChange={(e) => set("releaseDate", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      form.tags.includes(t)
                        ? "border-white bg-white text-black"
                        : "border-border text-muted-foreground hover:border-white/40"
                    }`}
                  >
                    {t.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Custom tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addTag(tagInput)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1">
                      {t}
                      <button type="button" onClick={() => removeTag(t)}>
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save */}
          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
