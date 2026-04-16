import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AllProductsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 h-full w-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg">All Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">Add a Product</Link>
        </Button>
      </div>
      {/* this is where the products shadcn   table will be and its filter  by products, */}
      <div></div>
    </div>
  );
}
