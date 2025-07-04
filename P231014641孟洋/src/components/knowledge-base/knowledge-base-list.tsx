"use client";

import { useEffect, useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import type { KnowledgeBase } from "@/types/knowledge-base";

interface KnowledgeBaseListProps {
  apiKey: string;
  onSelectKb?: (kb: KnowledgeBase) => void;
  onCreateKb?: () => void;
  onDeleteKb?: (kbId: string) => void;
  onEditKb?: (kb: KnowledgeBase) => void;
}

export default function KnowledgeBaseList({
  apiKey,
  onSelectKb,
  onCreateKb,
  onDeleteKb,
  onEditKb,
}: KnowledgeBaseListProps) {
  const {
    knowledgeBases,
    loading,
    error,
    fetchKnowledgeBaseList,
    deleteKnowledgeBase,
  } = useKnowledgeBase(apiKey);

  const [selectedKbId, setSelectedKbId] = useState<string | null>(null);

  useEffect(() => {
    fetchKnowledgeBaseList();
  }, [fetchKnowledgeBaseList]);

  const handleSelectKb = (kb: KnowledgeBase) => {
    setSelectedKbId(kb.kbId);
    onSelectKb?.(kb);
  };

  const handleDeleteKb = async (kbId: string, kbName: string) => {
    if (confirm(`确定要删除知识库"${kbName}"吗？此操作不可恢复。`)) {
      try {
        await deleteKnowledgeBase(kbId);
        onDeleteKb?.(kbId);
        if (selectedKbId === kbId) {
          setSelectedKbId(null);
        }
      } catch (error) {
        console.error("删除知识库失败:", error);
      }
    }
  };

  if (loading && knowledgeBases.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">错误: {error}</p>
        <button
          onClick={() => fetchKnowledgeBaseList()}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">知识库列表</h3>
        <button
          onClick={onCreateKb}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-lg text-sm font-medium"
        >
          创建知识库
        </button>
      </div>

      {knowledgeBases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>暂无知识库</p>
          <button
            onClick={onCreateKb}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-lg text-sm"
          >
            创建第一个知识库
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {knowledgeBases.map((kb) => (
            <div
              key={kb.kbId}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedKbId === kb.kbId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => handleSelectKb(kb)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{kb.kbName}</h4>
                  {kb.createTime && (
                    <p className="text-xs text-gray-400 mt-1">
                      创建时间: {new Date(kb.createTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditKb?.(kb);
                    }}
                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                  >
                    编辑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteKb(kb.kbId, kb.kbName);
                    }}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    disabled={loading}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && knowledgeBases.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
