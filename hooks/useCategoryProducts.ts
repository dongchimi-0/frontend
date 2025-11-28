"use client";

import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "@/lib/api/product";
import { Product } from "@/types/product";

export function useCategoryProducts(leafCode: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leafCode) return;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchProductsByCategory(leafCode);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [leafCode]);

  return { products, loading };
}
