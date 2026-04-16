import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Package } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and payment methods.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Free</span>
            <Badge variant="secondary">Active</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            You&#39;re on the free developer plan.
          </p>
          <Button size="sm">Upgrade Plan</Button>
        </CardContent>
      </Card>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Payment Method
        </h2>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <CreditCard className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No payment method on file.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Add Payment Method
        </Button>
      </section>
    </div>
  );
}
