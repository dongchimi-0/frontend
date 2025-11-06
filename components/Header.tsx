import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-14 bg-gray-900 text-white flex justify-between items-center px-6 shadow-md">
      <div className="text-xl font-bold">
        <Link href="/">My App</Link>
      </div>

      <nav className="flex gap-3">
        <Link
          href="/login"
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          로그인
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          회원가입
        </Link>
      </nav>
    </header>
  );
}
