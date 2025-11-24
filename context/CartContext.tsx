"use client";

import { useUser } from "./UserContext";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  thumbnail: string;
  quantity: number;
  price: number;
  stock: number;
  soldOut: boolean;
  option?: {
    optionId: number;
    optionType: string;
    optionTitle: string | null;
    optionValue: string | null;
  } | null;
}

interface CartContextType {
  cart: CartItem[];
  loadCart: () => void;
  addToCart: (productId: number, optionId: number | null, quantity: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  changeOption: (cartId: number, newOptionId: number) => void;
  deleteItem: (cartId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();

<<<<<<< HEAD
  /** 관리자면 즉시 차단 (장바구니 기능 전부 비활성화) */
  const isAdmin = user?.role === "ADMIN";

  /** -------------------------
   *  장바구니 조회
   --------------------------*/
  function loadCart() {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .get("http://localhost:8080/api/cart")
      .then((res) => {
        setCart(res.data.items || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setCart([]);
          return;
        }
        console.error("장바구니 조회 실패:", err);
      });
  }

  /** -------------------------
   *  장바구니 담기
   --------------------------*/
  function addToCart(productId: number, optionId: number | null, quantity: number) {
    if (isAdmin) return; // 🔥 관리자 차단
=======
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  function loadCart() {
    // 로그아웃 상태면 즉시 장바구니 비움
    if (!user) {
      setCart([]);
      return;
    }

    if (isAdmin) return;

    axios
      .get("http://localhost:8080/api/cart")
      .then((res) => setCart(res.data.items || []))
      .catch(() => setCart([]));
  }

  function addToCart(productId: number, optionId: number | null, quantity: number) {
    if (isAdmin) return;
>>>>>>> main

    axios
      .post("http://localhost:8080/api/cart", { productId, optionId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("장바구니 담기 실패:", err));
  }

<<<<<<< HEAD
  /** -------------------------
   *  수량 변경
   --------------------------*/
  function updateQuantity(cartId: number, quantity: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .put("http://localhost:8080/api/cart/quantity", { cartId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("수량 변경 실패:", err));
  }

  /** -------------------------
   *  옵션 변경
   --------------------------*/
  function changeOption(cartId: number, newOptionId: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .put("http://localhost:8080/api/cart/option", { cartId, newOptionId })
      .then(() => loadCart())
      .catch((err) => console.error("옵션 변경 실패:", err));
  }

  /** -------------------------
   *  항목 삭제
   --------------------------*/
  function deleteItem(cartId: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .delete(`http://localhost:8080/api/cart/${cartId}`)
      .then(() => loadCart())
      .catch((err) => console.error("장바구니 삭제 실패:", err));
  }

  /** 로그인하면 장바구니 자동 로드 */
  useEffect(() => {
    if (!user) return;
    if (isAdmin) return; 
=======
  function updateQuantity(cartId: number, quantity: number) {
    if (isAdmin) return;

    axios
      .put("http://localhost:8080/api/cart/quantity", { cartId, quantity })
      .then(() => loadCart());
  }

  function changeOption(cartId: number, newOptionId: number) {
    if (isAdmin) return;

    axios
      .put("http://localhost:8080/api/cart/option", { cartId, newOptionId })
      .then(() => loadCart());
  }

  function deleteItem(cartId: number) {
    if (isAdmin) return;

    axios
      .delete(`http://localhost:8080/api/cart/${cartId}`)
      .then(() => loadCart());
  }

  /** (로그아웃 시 장바구니 비우기) */
  useEffect(() => {
    if (!user) {
      setCart([]);      // 로그아웃 시 장바구니 즉시 초기화
      return;
    }

    if (isAdmin) {
      setCart([]);      // 관리자 로그인 시에도 장바구니 비우기
      return;
    }
>>>>>>> main

    loadCart();
  }, [user]);

  return (
    <CartContext.Provider
<<<<<<< HEAD
      value={{
        cart,
        loadCart,
        addToCart,
        updateQuantity,
        changeOption,
        deleteItem,
      }}
=======
      value={{ cart, loadCart, addToCart, updateQuantity, changeOption, deleteItem }}
>>>>>>> main
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
