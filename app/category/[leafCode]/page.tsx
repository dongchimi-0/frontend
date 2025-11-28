"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { toFullUrl } from "@/lib/utils/toFullUrl";

export default function CategoryPage({ params }: { params: Promise<{ leafCode: string }> }) {
  const { leafCode } = use(params);
  const router = useRouter();

  const { products, loading } = useCategoryProducts(leafCode);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-bold mb-4">
        카테고리: <span className="font-normal">{leafCode}</span>
      </h1>

      {loading ? (
        <p>상품 불러오는 중...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">해당 카테고리에 상품이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <li
              key={p.productId}
              className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/product/${p.productId}`)}
            >
              {p.mainImg && (
                <img
                  src={toFullUrl(p.mainImg)}
                  alt={p.productName}
                  className="w-full h-40 object-contain mb-3"
                />
              )}

              <p className="font-semibold line-clamp-1">{p.productName}</p>
              <p className="text-blue-600 font-bold">
                {p.sellPrice.toLocaleString()}원
              </p>
              <p className="text-xs text-gray-500">재고: {p.stock}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
