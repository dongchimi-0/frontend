"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* 타입스크립트 버전 */
type Product = {
  id: number;
  name: string;
  price: number;
};

export default function Page() {
  // 명확한 타입 지정
  const [products, setProducts] = useState<Product[]>([]);


  /* useEffect
  상품 목록을 가져오는 API 호출 부분
  - axios로 백엔드(Spring Boot)와 통신
  - 결과를 products state에 저장
  */
  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("API 요청 에러:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-sky-400 mb-6 text-center">
        📦 상품 목록
      </h1>
      <ul>
        {products.map((p) => (
          <li key={p.id} className="border-b border-gray-700 py-3">
            {p.name} — {p.price.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 리액트 버전
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [products, setProducts] = useState<any[]>([]); // 타입 명시

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("API 요청 에러:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-sky-400 mb-6 text-center">
        📦 상품 목록
      </h1>
      <ul>
        {products.map((p) => (
          <li key={p.id} className="border-b border-gray-700 py-3">
            {p.name} — {p.price.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
}
*/