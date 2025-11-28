import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProductsByCategory(leafCode: string): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products/category/${leafCode}`);

  if (!res.ok) {
    throw new Error("상품 조회 실패");
  }

  return res.json();
}
