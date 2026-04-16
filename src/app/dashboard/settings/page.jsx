"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">General Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your store information and preferences.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Store Info
        </h2>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Store Name</Label>
            <Input defaultValue="Vela Noire" />
          </div>
          <div className="grid gap-1.5">
            <Label>Support Email</Label>
            <Input type="email" placeholder="support@velanoire.com" />
          </div>
          <div className="grid gap-1.5">
            <Label>Currency</Label>
            <Input defaultValue="USD" />
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Shipping
        </h2>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Default Shipping Origin</Label>
            <Input placeholder="City, Country" />
          </div>
          <div className="grid gap-1.5">
            <Label>Free Shipping Threshold (USD)</Label>
            <Input type="number" placeholder="150" />
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </section>
    </div>
  );
}
