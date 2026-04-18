"use client";

import { useEffect, useState, use } from "react";
import ModelForm from "../../_components/model-form";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function EditModelPage({ params }) {
  const { id } = use(params);
  const [model, setModel] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/admin/models/${id}`, { credentials: "include" }).then(
        (r) => r.json(),
      ),
      fetch(`${API}/api/admin/products?limit=200`, {
        credentials: "include",
      }).then((r) => r.json()),
    ]).then(([modelData, productData]) => {
      setModel(modelData.model ?? null);
      setProducts(productData.products ?? []);
      setLoading(false);
    });
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Model — {model.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update this ambassador's profile and linked products
        </p>
      </div>
      <ModelForm initial={model} allProducts={products} />
    </div>
  );
}
