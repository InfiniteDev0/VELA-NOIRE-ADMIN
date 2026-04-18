"use client";

import { useEffect, useState } from "react";
import ModelForm from "../_components/model-form";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NewModelPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/admin/products?limit=200`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Model</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new brand ambassador profile
        </p>
      </div>
      <ModelForm allProducts={products} />
    </div>
  );
}
