"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductTable } from "@/components/shared/product-table";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TYPES = [
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

export default function AllProductsPage() {
  // -- Data state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // -- Filter / pagination state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  // -- Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // -- Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // -- Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filterType !== "ALL") params.set("type", filterType);
      if (filterStatus !== "ALL") params.set("status", filterStatus);

      const res = await fetch(`${API}/api/admin/products?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load products.");
      const data = await res.json();
      setProducts(data.products ?? []);
      setPagination(data.pagination ?? { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterType, filterStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // -- Delete
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Delete failed.");
      }
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters = !!(search || filterType !== "ALL" || filterStatus !== "ALL");

  function resetFilters() {
    setSearch("");
    setFilterType("ALL");
    setFilterStatus("ALL");
    setPage(1);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">All Products</h1>
          <p className="text-sm text-muted-foreground">
            {pagination.total} product{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">Add a Product</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={filterType}
          onValueChange={(v) => { setFilterType(v); setPage(1); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(v) => { setFilterStatus(v); setPage(1); }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {STATUSES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        loading={loading}
        hasFilters={hasFilters}
        onDelete={setDeleteTarget}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.pages} -- {pagination.total} products
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> and all its variants and Cloudinary images. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
