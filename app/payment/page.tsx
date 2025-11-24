"use client";

import { useCart } from "../../context/CartContext";
import { useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (!cart.length) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/payment",
        { items: cart },
        { withCredentials: true }
      );

      alert(`결제 완료! 결제 ID: ${res.data.paymentId}`);
      // TODO: 결제 완료 후 페이지 이동/장바구니 초기화
    } catch (err: any) {
      console.error(err);
      setError("결제 실패: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">장바구니가 비어있습니다.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">결제하기</h1>

        {/* 주문 요약 */}
        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.cartId} className="flex justify-between">
              <span>{item.productName} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
            <span>총 결제 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
        >
          {loading ? "결제 진행중..." : `${totalPrice.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </div>
  );
}
