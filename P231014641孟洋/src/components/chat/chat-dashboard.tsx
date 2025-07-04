"use client";

import { useState, useCallback } from "react";
import { ChatInterface } from "./chat-interface";
import { ChatConfig, ChatConfig as ChatConfigType } from "./chat-config";

interface ChatDashboardProps {
  apiKey: string;
}

export function ChatDashboard({ apiKey }: ChatDashboardProps) {
  const [config, setConfig] = useState<ChatConfigType>({
    mode: "knowledge-base",
    kbIds: [],
    agentUuid: "",
    model: "QAnything 4o mini",
    maxToken: "1024",
    hybridSearch: false,
    networking: true,
    sourceNeeded: true,
  });

  const handleConfigChange = useCallback((newConfig: ChatConfigType) => {
    setConfig(newConfig);
  }, []);

  const isConfigValid = () => {
    if (config.mode === "knowledge-base") {
      return config.kbIds.length > 0;
    } else if (config.mode === "agent") {
      return config.agentUuid !== "";
    }
    return false;
  };

  return (
    <div className="min-h-screen p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-black text-xl font-bold">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">
                智能对话中心
              </h1>
              <p className="mt-2 text-purple-600">
                与AI助手实时对话，获取智能回复
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-220px)]">
          {/* Configuration Panel */}
          <div className="xl:w-1/3 2xl:w-1/4">
            <div className="glass-card p-6 rounded-2xl h-full">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-purple-900 mb-2">
                  🔧 配置中心
                </h2>
                <p className="text-purple-600 text-sm">选择对话模式和参数</p>
              </div>
              <ChatConfig apiKey={apiKey} onConfigChange={handleConfigChange} />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col min-h-0">
            {isConfigValid() ? (
              <div className="glass-card p-6 rounded-2xl h-full">
                <ChatInterface
                  apiKey={apiKey}
                  mode={config.mode}
                  kbIds={config.kbIds}
                  agentUuid={config.agentUuid}
                  model={config.model}
                  maxToken={config.maxToken}
                  hybridSearch={config.hybridSearch}
                  networking={config.networking}
                  sourceNeeded={config.sourceNeeded}
                />
              </div>
            ) : (
              <div className="glass-card p-16 rounded-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">
                    准备开始对话
                  </h3>
                  <p className="text-purple-600 text-lg mb-2">
                    {config.mode === "knowledge-base"
                      ? "📚 请选择至少一个知识库"
                      : "🤖 请选择一个Agent"}
                  </p>
                  <p className="text-purple-500 text-sm">
                    完成配置后即可开始智能对话
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
