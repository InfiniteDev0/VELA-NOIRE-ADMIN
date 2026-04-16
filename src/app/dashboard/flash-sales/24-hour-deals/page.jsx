import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Timer, Plus } from "lucide-react";

export default function TwentyFourHourDealsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">24-Hour Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lightning deals with countdown timers — high urgency drops.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-2" />
          Add Deal
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Time Left</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Timer className="size-8" />
                  <p className="text-sm">No 24-hour deals running.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
