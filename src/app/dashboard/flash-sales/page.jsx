import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Plus } from "lucide-react";

const SALE_TYPES = [
  {
    name: "Eid Sales",
    slug: "eid-sales",
    description: "Seasonal Eid Al-Fitr & Eid Al-Adha flash promotions.",
    status: "Inactive",
  },
  {
    name: "Seasonal Offers",
    slug: "seasonal-offers",
    description: "Summer, Winter, Autumn, Spring collection discounts.",
    status: "Inactive",
  },
  {
    name: "Bridal Offers",
    slug: "bridal-offers",
    description: "Special deals on Infinity Bride collection pieces.",
    status: "Inactive",
  },
  {
    name: "24-Hour Deals",
    slug: "24-hour-deals",
    description: "Lightning deals with countdown timers — high urgency drops.",
    status: "Inactive",
  },
];

export default function FlashSalesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Flash Sales</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all active and upcoming promotions.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-2" />
          New Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SALE_TYPES.map((sale) => (
          <Link
            key={sale.slug}
            href={`/dashboard/flash-sales/${sale.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-white/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg border border-border">
                <Zap className="size-4 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {sale.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold group-hover:text-white transition-colors">
                {sale.name}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sale.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                0 active deals
              </span>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
