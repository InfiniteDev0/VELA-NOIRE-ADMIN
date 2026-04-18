"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Plus, UserRound } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchModels() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/models`, {
        credentials: "include",
      });
      const data = await res.json();
      setModels(data.models ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchModels();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/admin/models/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setModels((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Brand Models</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Women who represent Vela Noire — linked to their featured products
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/gala/models/new")}>
          <Plus className="w-4 h-4 mr-2" /> Add Model
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : models.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-20 text-muted-foreground"
              >
                <UserRound className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No models yet — add your first brand ambassador
              </TableCell>
            </TableRow>
          ) : (
            models.map((m) => (
              <TableRow
                key={m.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/gala/models/${m.id}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {m.profileImage ? (
                    <img
                      src={m.profileImage}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <UserRound className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {m.nationality ?? "—"}
                </TableCell>
                <TableCell>{m.products?.length ?? 0} products</TableCell>
                <TableCell>
                  <Badge variant={m.isActive ? "default" : "secondary"}>
                    {m.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/gala/models/${m.id}`)
                        }
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/gala/models/${m.id}/edit`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(m)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
            <DialogDescription>
              This will remove the model and all their product links. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
