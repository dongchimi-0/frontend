"use client";

import { useState } from "react";

interface CategoryTreeProps {
  data: any; // CATEGORY_TREE 전체 객체
  onSelect?: (id: string) => void; // leaf 클릭 시 부모가 받는 값
  mode?: "compact" | "admin"; // compact: 사이드바, admin: 관리자 페이지
}

export default function CategoryTree({
  data,
  onSelect,
  mode = "admin",
}: CategoryTreeProps) {
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  // 💡 스타일 프리셋
  const isCompact = mode === "compact";

  const style = {
    main: isCompact
      ? "px-4 py-2 font-semibold hover:bg-gray-100 text-sm"
      : "px-4 py-3 font-bold hover:bg-gray-100 text-base",
    sub: isCompact
      ? "px-5 py-1 text-sm hover:bg-gray-100"
      : "px-6 py-2 text-sm hover:bg-gray-100",
    leaf: isCompact
      ? "ml-6 px-5 py-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100 block"
      : "ml-8 px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer text-sm",
  };

  return (
    <div
      className={
        isCompact
          ? "w-full h-full overflow-y-auto"
          : "w-full bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto shadow"
      }
    >
      {Object.entries(data).map(([mainCode, mainData]: any) => (
        <div key={mainCode}>
          {/* 대분류 */}
          <button
            onClick={() => setOpenMain(openMain === mainCode ? null : mainCode)}
            className={`${style.main} w-full text-left rounded-md ${
              openMain === mainCode ? "bg-gray-100" : ""
            }`}
          >
            {mainData.title}
          </button>

          {/* 중분류 */}
          {openMain === mainCode &&
            Object.entries(mainData.children).map(
              ([subCode, subData]: any) => (
                <div key={subCode} className="ml-2">
                  <button
                    onClick={() =>
                      setOpenSub(openSub === subCode ? null : subCode)
                    }
                    className={`${style.sub} w-full text-left ${
                      openSub === subCode ? "bg-gray-100" : ""
                    }`}
                  >
                    {subData.title}
                  </button>

                  {/* 소분류 */}
                  {openSub === subCode &&
                    Object.entries(subData.children).map(
                      ([leafCode, leafName]: any) => (
                        <div
                          key={leafCode}
                          onClick={() => onSelect && onSelect(leafCode)}
                          className={style.leaf}
                        >
                          {leafName}
                        </div>
                      )
                    )}
                </div>
              )
            )}
        </div>
      ))}
    </div>
  );
}
