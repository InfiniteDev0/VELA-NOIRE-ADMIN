"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, UserRound } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ModelViewPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/models/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setModel(d.model);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!model) {
    return <div className="p-6 text-muted-foreground">Model not found.</div>;
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/gala/models")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> All Models
        </button>
        <Button
          size="sm"
          onClick={() => router.push(`/dashboard/gala/models/${id}/edit`)}
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
      </div>

      {/* Profile header */}
      <div className="flex items-center gap-6">
        {model.profileImage ? (
          <img
            src={model.profileImage}
            alt={model.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <UserRound className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-semibold">{model.name}</h1>
          {model.nationality && (
            <p className="text-muted-foreground">{model.nationality}</p>
          )}
          <Badge
            className="mt-2"
            variant={model.isActive ? "default" : "secondary"}
          >
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Bio */}
      {model.bio && (
        <section className="space-y-1">
          <h2 className="font-medium">Bio</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {model.bio}
          </p>
        </section>
      )}

      {/* Campaign images */}
      {model.images?.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-medium">Campaign Images</h2>
          <div className="grid grid-cols-4 gap-3">
            {model.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="aspect-[3/4] w-full object-cover rounded"
              />
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {model.videos?.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-medium">Campaign Videos</h2>
          <div className="grid grid-cols-2 gap-3">
            {model.videos.map((url, i) => (
              <video key={i} src={url} controls className="w-full rounded" />
            ))}
          </div>
        </section>
      )}

      {/* Linked products */}
      <section className="space-y-3">
        <h2 className="font-medium">{model.name} is wearing…</h2>
        {model.products?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products linked yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {model.products.map((lp) => {
              const p = lp.product;
              const img =
                p.variants?.find((v) => v.isDefault)?.images?.[0] ??
                p.images?.[0];
              return (
                <div
                  key={lp.id}
                  className="cursor-pointer group"
                  onClick={() => router.push(`/dashboard/products/${p.id}`)}
                >
                  <div className="aspect-[3/4] bg-muted rounded overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-100" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{p.name}</p>
                  {lp.caption && (
                    <p className="text-xs text-muted-foreground">
                      {lp.caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
