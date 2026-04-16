import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Revenue", value: "$0.00", sub: "All time", icon: DollarSign },
  { label: "Total Orders", value: "0", sub: "All time", icon: ShoppingBag },
  {
    label: "Avg. Order Value",
    value: "$0.00",
    sub: "All time",
    icon: TrendingUp,
  },
  { label: "Total Customers", value: "0", sub: "Unique buyers", icon: Users },
];

export default function ProfitAnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Profit Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue, orders, and performance overview.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <TrendingUp className="size-8" />
          <p className="text-sm">
            Revenue chart — coming once orders are live.
          </p>
        </div>
      </Card>
    </div>
  );
}
