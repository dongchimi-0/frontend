"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";
import MultiImageUpload from "../../ui/MultiImageUpload";
import { Plus, Trash2 } from "lucide-react";

interface Option {
  name: string;
  stock: number;
}

// 상품 옵션을 위한 인터페이스 정의
interface ProductOption {
  optionId?: number;
  optionTitle: string;  // 옵션 제목 (예: 색상, 사이즈)
  optionValue: string;  // 옵션 값 (예: Red, Blue, S, M, L)
  sellPrice: number;    // 옵션 가격
  stock: number;        // 옵션 재고
  isShow: boolean;      // 옵션 노출 여부
}

interface Product {
  productId?: number;  
  productName: string;
  mainImg?: string;
  subImages?: string[];
  categoryCode?: string;
  consumerPrice?: number;
  sellPrice: number;
  stock: number;
  productStatus: number;  // 상품 상태 (판매 중 등)
  isShow: boolean;
  isOption: boolean;   // 옵션 여부
  selectedOption: string | null;  // 선택된 옵션 (색상, 사이즈 등)
  options: ProductOption[];  // 상품 옵션
}

interface CategoryTree {
  [bigCode: string]: {
    title: string;
    children: {
      [midCode: string]: {
        title: string;
        children: {
          [leafCode: string]: string;
        };
      };
    };
  };
}

export default function ProductNewPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;  // 백엔드 API URL
  const router = useRouter();  // 페이지 이동을 위한 라우터

  // 상품 정보를 관리할 상태 정의
   const [product, setProduct] = useState<Product>({
    productId: 0,
    productName: "",
    mainImg: "",
    subImages: [],
    categoryCode: "",
    consumerPrice: 0,
    sellPrice: 0,
    stock: 0,
    productStatus: 0,  // 판매 중
    isShow: true,
    isOption: false,
    selectedOption: null,
    options: [],
  });

  const [categoryTree, setCategoryTree] = useState<CategoryTree | null>(null);
  const [selectedBig, setSelectedBig] = useState<string>("");
  const [selectedMid, setSelectedMid] = useState<string>("");

  /** 카테고리 fetch */
  useEffect(() => {
    fetch(`${API_URL}/api/categories/tree`)
      .then((res) => res.json())
      .then((data) => setCategoryTree(data.tree))
      .catch(console.error);
  }, [API_URL]);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, { optionTitle: "", optionValue: "", sellPrice: 0, stock: 0, isShow: true }],
    }));
  };

  const updateOption = (index: number, field: keyof ProductOption, value: any) => {
    const newOptions = [...product.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setProduct((prev) => ({ ...prev, options: newOptions }));
  };
  
  const removeOption = (index: number) =>
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    if (!product.categoryCode) return alert("카테고리를 선택해주세요.");
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",  // 상품 등록
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("저장 실패");
      alert("상품이 등록되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  // 최종 가격 계산
  const calculateFinalPrice = () => {
    let finalPrice = product.sellPrice;
    // 옵션이 선택된 경우, 해당 옵션 가격을 추가
    if (product.selectedOption && product.options.length > 0) {
      const selectedOption = product.options.find(
        (option) => option.optionValue === product.selectedOption
      );
      if (selectedOption) {
        finalPrice += selectedOption.sellPrice;  // 옵션 가격 추가
      }
    }
    return finalPrice;
  };

  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 pb-2 border-b border-gray-200">
          상품 등록
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* 좌측: 이미지 업로드 */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <p className="font-semibold">대표 이미지</p>
            <ImageUpload
              image={product.mainImg}
              onChange={(val) => handleChange("mainImg", val)}
            />

            <p className="font-semibold mt-4">상세 이미지</p>
            <MultiImageUpload
              images={product.subImages || []}
              onChange={(imgs) => handleChange("subImages", imgs)}
            />
          </div>

          {/* 우측: 상품 정보 */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <Input
              label="상품명"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="상품명을 입력하세요"
            />

            {/* 카테고리 선택 */}
            {categoryTree ? (
              <div className="flex flex-col gap-2">
                <p className="font-semibold">카테고리 선택</p>

                {/* 대분류 */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryTree).map(([bigCode, bigNode]) => (
                    <button
                      key={bigCode}
                      className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                        selectedBig === bigCode
                          ? "bg-black text-white border-black"
                          : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedBig(bigCode);
                        setSelectedMid("");
                        handleChange("categoryCode", "");
                      }}
                    >
                      {bigNode.title}
                    </button>
                  ))}
                </div>

                {/* 중분류 */}
                {selectedBig && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(categoryTree[selectedBig].children).map(
                      ([midCode, midNode]) => (
                        <button
                          key={midCode}
                          className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                            selectedMid === midCode
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedMid(midCode);
                            handleChange("categoryCode", "");
                          }}
                        >
                          {midNode.title}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* 소분류 */}
                {selectedBig && selectedMid && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(
                      categoryTree[selectedBig].children[selectedMid].children
                    ).map(([leafCode, leafName]) => (
                      <button
                        key={leafCode}
                        className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                          product.categoryCode === leafCode
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => handleChange("categoryCode", leafCode)}
                      >
                        {leafName}
                      </button>
                    ))}
                  </div>
                )}

                {product.categoryCode && (
                  <p className="text-sm text-gray-500 mt-1">
                    선택된 카테고리: {product.categoryCode}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">카테고리 로드 중...</p>
            )}

            {/* 옵션 */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">옵션 추가</p>
                <button
                  type="button"
                  onClick={addOption}
                  className="w-6 h-6 flex mx-2 items-center justify-center bg-black text-white rounded-full cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {product.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <Input
                    label="옵션명"
                    value={opt.optionTitle}
                    onChange={(e) => updateOption(idx, "optionTitle", e.target.value)}placeholder="옵션명" />

                  <Input
                    label="재고"
                    type="number"
                    value={opt.stock}
                    onChange={(e) =>
                      updateOption(idx, "stock", Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* 옵션 상품 여부 선택 */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">옵션 상품 선택</h2>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={product.isOption}
                  onChange={(e) => handleChange("isOption", e.target.checked)}
                />
                <span className="ml-2">옵션 상품 여부</span>
              </div>

              {/* 옵션에 따라 색상 또는 사이즈 선택 */}
              {product.isOption && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">옵션 선택</h3>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">색상 옵션</label>
                    <div>
                      {product.options
                        .filter((option) => option.optionTitle === "색상")
                        .map((option, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={option.optionValue}
                              name="colorOption"
                              value={option.optionValue}
                              checked={product.selectedOption === option.optionValue}
                              onChange={(e) => handleChange("selectedOption", e.target.value)}
                            />
                            <label className="ml-2">{option.optionValue} (+{option.sellPrice}원)</label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">사이즈 옵션</label>
                    <div>
                      {product.options
                        .filter((option) => option.optionTitle === "사이즈")
                        .map((option, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={option.optionValue}
                              name="sizeOption"
                              value={option.optionValue}
                              checked={product.selectedOption === option.optionValue}
                              onChange={(e) => handleChange("selectedOption", e.target.value)}
                            />
                            <label className="ml-2">{option.optionValue} (+{option.sellPrice}원)</label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 최종 가격 계산 후 표시 */}
            <div className="mt-4">
              <span className="text-xl font-semibold">최종 가격: {calculateFinalPrice()}원</span>
            </div>

            {/* 등록 버튼 */}
            <Button
              className="w-full mt-6 py-3 text-lg"
              onClick={handleSave}
            >
              상품 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
