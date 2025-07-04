"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-72 purple-gradient shadow-2xl z-50">
      <div className="flex flex-col h-full p-6">
        {/* Logo区域 */}
        <div className="mb-12">
          <Link href="/" className="flex items-center space-x-3 text-black">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-black font-bold text-xl">Q</span>
            </div>
            <div>
              <div className="text-2xl font-bold">QAnything</div>
              <div className="text-sm text-purple-200">智能知识管理</div>
            </div>
          </Link>
        </div>

        {/* 导航菜单 */}
        <div className="flex-1 space-y-3">
          <Link
            href="/"
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${
              isActive("/") && pathname === "/"
                ? "bg-white bg-opacity-25 text-black shadow-lg backdrop-blur-sm border border-white border-opacity-30 transform scale-105"
                : "text-black text-opacity-80 hover:text-black hover:bg-white hover:bg-opacity-15 hover:backdrop-blur-sm hover:transform hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <div className="text-base">知识库管理</div>
              <div className="text-xs text-purple-200 opacity-75">
                管理文档和FAQ
              </div>
            </div>
          </Link>

          <Link
            href="/agents"
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${
              isActive("/agents")
                ? "bg-white bg-opacity-25 text-black shadow-lg backdrop-blur-sm border border-white border-opacity-30 transform scale-105"
                : "text-black text-opacity-80 hover:text-black hover:bg-white hover:bg-opacity-15 hover:backdrop-blur-sm hover:transform hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <div className="text-base">Agent管理</div>
              <div className="text-xs text-purple-200 opacity-75">
                配置AI助手
              </div>
            </div>
          </Link>

          <Link
            href="/chat"
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${
              isActive("/chat")
                ? "bg-white bg-opacity-25 text-black shadow-lg backdrop-blur-sm border border-white border-opacity-30 transform scale-105"
                : "text-black text-opacity-80 hover:text-black hover:bg-white hover:bg-opacity-15 hover:backdrop-blur-sm hover:transform hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <div className="text-base">智能对话</div>
              <div className="text-xs text-purple-200 opacity-75">
                Stream实时对话
              </div>
            </div>
          </Link>

          <Link
            href="/homework"
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${
              isActive("/homework")
                ? "bg-white bg-opacity-25 text-black shadow-lg backdrop-blur-sm border border-white border-opacity-30 transform scale-105"
                : "text-black text-opacity-80 hover:text-black hover:bg-white hover:bg-opacity-15 hover:backdrop-blur-sm hover:transform hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <div className="text-base">过往作业</div>
              <div className="text-xs text-purple-200 opacity-75">
                查看历史作业
              </div>
            </div>
          </Link>
        </div>

        {/* 底部用户区域 */}
        <div className="mt-auto">
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-black">
                <div className="font-semibold text-sm">用户中心</div>
                <div className="text-xs text-purple-200">系统管理</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
