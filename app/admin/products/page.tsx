"use client";

import { useEffect, useState } from "react";
import CategoryTree from "@/components/category/categoryTree";
import SimpleProductList from "@/components/admin/SimpleProductList";
import FabAddButton from "@/components/admin/FabAddButton";
import { useRouter } from "next/navigation";
import { CATEGORY_TREE } from "@/app/lib/categories";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export default function AdminProductMainPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // CATEGORY_TREE → 3단계 구조로 admin용 categories state에 변환
  useEffect(() => {
    const formatted = Object.entries(CATEGORY_TREE).map(
      ([mainCode, main]: [string, any]) => ({
        id: mainCode,
        name: main.title,
        children: Object.entries(main.children).map(
          ([subCode, sub]: [string, any]) => ({
            id: subCode,
            name: sub.title,
            children: Object.entries(sub.children).map(
              ([leafCode, leaf]: [string, any]) => ({
                id: leafCode,
                name: leaf,
              })
            ),
          })
        ),
      })
    );

    setCategories(formatted);
  }, []);

  // 카테고리 클릭 시 해당 상품 로딩 (샘플)
  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);
    setError(false);

    setTimeout(() => {
      setProducts([
        { id: 1, name: "샘플 상품 A" },
        { id: 2, name: "샘플 상품 B" },
      ]);
      setLoading(false);
    }, 500);
  }, [selectedCategory]);

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">관리자 페이지</h1>

      <div className="grid grid-cols-3 gap-8 w-full">

        {/* 왼쪽 카테고리 */}
        <div className="col-span-1">
          <CategoryTree
            data={categories}
            mode="admin"
            onSelect={(id) => setSelectedCategory(id)}
          />
        </div>

        {/* 오른쪽 상품 리스트 */}
        <div className="col-span-2">
          <SimpleProductList
            products={products}
            loading={loading}
            error={error}
            onSelect={(id) => router.push(`/admin/products/edit/${id}`)}
          />
        </div>

      </div>

      {/* 플로팅 버튼 */}
      <FabAddButton />

    </div>
  );
}
