import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ImageIcon } from "lucide-react";

const COLLECTIONS = [
  {
    name: "Rare Collectibles",
    slug: "rare-collectibles",
    tagline: "Drop once a year. Never restocked.",
    description:
      "Exclusive luxury sets — 1 Abaya, 1 Perfume, 1 Accessory. Limited to 30–50 sets per drop.",
    badge: "Limited Edition",
    badgeVariant: "destructive",
  },
  {
    name: "Infinity Bride",
    slug: "infinity-bride",
    tagline: "For the queen on her most sacred day.",
    description:
      "White, cream, and pearl beige abayas with embroidered gold/silver thread for brides.",
    badge: "Bridal",
    badgeVariant: "secondary",
  },
  {
    name: "Modern Muse",
    slug: "modern-muse",
    tagline: "Urban. Professional. Unmistakably elegant.",
    description:
      "Tailored cuts, muted colors, lightweight fabrics for the contemporary Muslimah.",
    badge: null,
  },
  {
    name: "Lux Infinity",
    slug: "lux-infinity",
    tagline: "Velvet, silk, and jewel tones — for the bold.",
    description:
      "Premium abayas in royal blue, emerald, maroon with gold trim and crystals.",
    badge: "Premium",
    badgeVariant: "outline",
  },
  {
    name: "Traditions Reimagined",
    slug: "traditions-reimagined",
    tagline: "Heritage, reborn with modern stitching.",
    description:
      "Classic Saudi/Emirati cuts with geometric Islamic embroidery.",
    badge: null,
  },
  {
    name: "Simplicity Speaks",
    slug: "simplicity-speaks",
    tagline: "Clean lines. Zero noise. Total elegance.",
    description:
      "Straight-cut cotton-linen abayas in sand, ivory, charcoal, and soft sage.",
    badge: null,
  },
  {
    name: "Seasonal",
    slug: "seasonal",
    tagline: "Summer · Winter · Autumn · Spring",
    description:
      "Four seasonal drops — Desert Bloom, Velvet Moon, Amber Luxe, Floral Grace.",
    badge: "4 Seasons",
    badgeVariant: "secondary",
  },
];

export default function CollectionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your 7 Vela Noire collections.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {COLLECTIONS.map((col) => (
          <Link
            key={col.slug}
            href={`/dashboard/collections/${col.slug}`}
            className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-white/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg border border-border">
                <ImageIcon className="size-4 text-muted-foreground" />
              </div>
              {col.badge && (
                <Badge
                  variant={col.badgeVariant || "secondary"}
                  className="text-xs shrink-0"
                >
                  {col.badge}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold group-hover:text-white transition-colors">
                {col.name}
              </h2>
              <p className="text-xs text-muted-foreground italic">
                {col.tagline}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {col.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">0 products</span>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
