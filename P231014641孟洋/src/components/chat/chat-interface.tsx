"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import {
  chatService,
  ChatMessage,
  KnowledgeBaseChatRequest,
  AgentChatRequest,
} from "@/services/chatService";
import { useToast } from "@/hooks/useToast";

interface ChatInterfaceProps {
  apiKey: string;
  mode: "knowledge-base" | "agent";
  kbIds?: string[];
  agentUuid?: string;
  model?: string;
  maxToken?: string;
  hybridSearch?: boolean;
  networking?: boolean;
  sourceNeeded?: boolean;
}

export function ChatInterface({
  apiKey,
  mode,
  kbIds = [],
  agentUuid = "",
  model = "QAnything 4o mini",
  maxToken = "1024",
  hybridSearch = false,
  networking = true,
  sourceNeeded = true,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showError } = useToast();

  useEffect(() => {
    console.log(
      "Setting API key in ChatInterface:",
      apiKey ? `${apiKey.substring(0, 10)}...` : "Missing"
    );
    chatService.setApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const question = input.trim();
    setInput("");
    setIsStreaming(true);
    setCurrentResponse("");

    const newMessage: ChatMessage = { question, response: "" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      let fullResponse = "";

      if (mode === "knowledge-base") {
        const request: KnowledgeBaseChatRequest = {
          question,
          kbIds,
          model,
          maxToken,
          hybridSearch: hybridSearch.toString(),
          networking: networking.toString(),
          sourceNeeded: sourceNeeded.toString(),
          history: messages.filter(
            (msg) => msg.response && msg.response.trim() !== ""
          ),
        };

        for await (const chunk of chatService.chatWithKnowledgeBase(request)) {
          console.log("Received chunk response:", chunk.result?.response);
          if (chunk.errorCode === "0" && chunk.result?.response) {
            const newText = chunk.result.response;

            // 检查是否是完整响应（避免重复）
            if (newText === fullResponse) {
              console.log("Skipping duplicate complete response");
              continue;
            }

            fullResponse += newText;
            console.log("Current full response:", fullResponse);

            // 使用flushSync确保立即渲染
            flushSync(() => {
              setCurrentResponse(fullResponse);
            });
          } else if (chunk.errorCode !== "0") {
            showError(`聊天失败: ${chunk.msg || "未知错误"}`);
            break;
          }
        }
      } else if (mode === "agent") {
        const request: AgentChatRequest = {
          uuid: agentUuid,
          question,
          sourceNeeded: sourceNeeded.toString(),
          history: messages.filter(
            (msg) => msg.response && msg.response.trim() !== ""
          ),
        };

        for await (const chunk of chatService.chatWithAgent(request)) {
          console.log("Received chunk response:", chunk.result?.response);
          if (chunk.errorCode === "0" && chunk.result?.response) {
            const newText = chunk.result.response;

            // 检查是否是完整响应（避免重复）
            if (newText === fullResponse) {
              console.log("Skipping duplicate complete response");
              continue;
            }

            fullResponse += newText;
            console.log("Current full response:", fullResponse);

            // 使用flushSync确保立即渲染
            flushSync(() => {
              setCurrentResponse(fullResponse);
            });
          } else if (chunk.errorCode !== "0") {
            showError(`聊天失败: ${chunk.msg || "未知错误"}`);
            break;
          }
        }
      }

      // 完成后更新消息列表
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, response: fullResponse } : msg
        )
      );
      setCurrentResponse("");
    } catch (error) {
      showError(
        `聊天出错: ${error instanceof Error ? error.message : "未知错误"}`
      );
      // 移除失败的消息
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setCurrentResponse("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "knowledge-base" ? "知识库对话" : "Agent对话"}
        </h2>
        <button
          onClick={clearHistory}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          disabled={isStreaming}
        >
          清空历史
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="space-y-2">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-black px-4 py-2 rounded-lg max-w-xs lg:max-w-md">
                {message.question}
              </div>
            </div>

            {/* AI response */}
            {message.response && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs lg:max-w-md whitespace-pre-wrap">
                  {message.response}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current streaming response */}
        {isStreaming && currentResponse && (
          <div className="space-y-2">
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs lg:max-w-md whitespace-pre-wrap">
                {currentResponse}
                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isStreaming && !currentResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
