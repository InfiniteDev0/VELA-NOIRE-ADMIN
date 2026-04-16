"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const NOTIFICATION_SETTINGS = [
  {
    id: "new_order",
    label: "New Order",
    description: "Get notified when a customer places an order.",
  },
  {
    id: "order_cancelled",
    label: "Order Cancelled",
    description: "Alert when a customer cancels an order.",
  },
  {
    id: "low_stock",
    label: "Low Stock Warning",
    description: "Notify when a variant stock drops below 5.",
  },
  {
    id: "new_user",
    label: "New Customer Registration",
    description: "Alert for every new account created.",
  },
  {
    id: "flash_sale",
    label: "Flash Sale Start/End",
    description: "Reminders when a flash sale is about to start or expire.",
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure which events trigger admin notifications.
        </p>
      </div>
      <section className="space-y-4">
        {NOTIFICATION_SETTINGS.map((n, i) => (
          <div key={n.id}>
            <div className="flex items-center justify-between py-3">
              <div>
                <Label htmlFor={n.id} className="font-medium">
                  {n.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.description}
                </p>
              </div>
              <Switch id={n.id} />
            </div>
            {i < NOTIFICATION_SETTINGS.length - 1 && <Separator />}
          </div>
        ))}
      </section>
      <Button size="sm" className="w-fit">
        Save Preferences
      </Button>
    </div>
  );
}
