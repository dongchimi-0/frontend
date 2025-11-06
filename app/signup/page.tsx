"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pwCheck, setPwCheck] = useState<string>("");

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("▶ 회원가입 요청");
    console.log("이메일:", email);
    console.log("비밀번호:", pw);

    // TODO: API 연동 예정

    // 회원가입 성공 → 로그인 화면으로 이동
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          회원가입
        </h2>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-600 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">비밀번호 확인</label>
            <input
              type="password"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 duration-150"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
