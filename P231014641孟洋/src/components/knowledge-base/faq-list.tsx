"use client";

import { useEffect, useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import type { FAQ } from "@/types/knowledge-base";

interface FAQListProps {
  apiKey: string;
  kbId: string;
  onCreateFAQ?: () => void;
  onEditFAQ?: (faq: FAQ) => void;
  onDeleteSuccess?: () => void;
}

export default function FAQList({
  apiKey,
  kbId,
  onCreateFAQ,
  onEditFAQ,
  onDeleteSuccess,
}: FAQListProps) {
  const { faqs, loading, error, fetchFAQList, deleteFAQs } =
    useKnowledgeBase(apiKey);

  const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);
  const [deletingFAQId, setDeletingFAQId] = useState<string | null>(null);

  useEffect(() => {
    if (kbId) {
      console.log("FAQList: 开始获取FAQ列表, kbId:", kbId);
      fetchFAQList(kbId);
    }
  }, [kbId, fetchFAQList]);

  const handleSelectFAQ = (faqId: string, checked: boolean) => {
    if (checked) {
      setSelectedFAQs((prev) => [...prev, faqId]);
    } else {
      setSelectedFAQs((prev) => prev.filter((id) => id !== faqId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFAQs(faqs.map((faq) => faq.faqId));
    } else {
      setSelectedFAQs([]);
    }
  };

  const handleDeleteFAQ = async (faqId: string, question: string) => {
    if (confirm(`确定要删除问答"${question}"吗？此操作不可恢复。`)) {
      setDeletingFAQId(faqId);
      try {
        await deleteFAQs({ kbId, faqIds: [faqId] });
        onDeleteSuccess?.();
      } catch (error) {
        console.error("删除FAQ失败:", error);
      } finally {
        setDeletingFAQId(null);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFAQs.length === 0) return;

    if (
      confirm(
        `确定要删除选中的 ${selectedFAQs.length} 个问答吗？此操作不可恢复。`
      )
    ) {
      try {
        await deleteFAQs({ kbId, faqIds: selectedFAQs });
        setSelectedFAQs([]);
        onDeleteSuccess?.();
      } catch (error) {
        console.error("批量删除FAQ失败:", error);
      }
    }
  };

  console.log(
    "FAQList render: loading=",
    loading,
    "faqs.length=",
    faqs.length,
    "error=",
    error
  );

  if (loading && faqs.length === 0) {
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
          onClick={() => fetchFAQList(kbId)}
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
        <h3 className="text-lg font-semibold">问答集 ({faqs.length})</h3>
        <div className="flex space-x-2">
          {selectedFAQs.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={loading}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-black rounded text-sm font-medium"
            >
              删除选中 ({selectedFAQs.length})
            </button>
          )}
          <button
            onClick={onCreateFAQ}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-lg text-sm font-medium"
          >
            创建问答
          </button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无问答</h3>
          <p className="text-gray-500 mb-4">
            创建问答集来为用户提供常见问题的快速答案
          </p>
          <button
            onClick={onCreateFAQ}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-lg text-sm"
          >
            创建第一个问答
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 全选控制 */}
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedFAQs.length === faqs.length && faqs.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              全选 ({selectedFAQs.length}/{faqs.length})
            </label>
          </div>

          {/* FAQ列表 */}
          {faqs.map((faq) => (
            <div
              key={faq.faqId}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedFAQs.includes(faq.faqId)}
                  onChange={(e) => handleSelectFAQ(faq.faqId, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        问: {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        答: {faq.answer}
                      </p>
                      {(faq.createTime || faq.updateTime) && (
                        <div className="flex space-x-4 text-xs text-gray-400">
                          {faq.createTime && (
                            <span>
                              创建: {new Date(faq.createTime).toLocaleString()}
                            </span>
                          )}
                          {faq.updateTime && (
                            <span>
                              更新: {new Date(faq.updateTime).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onEditFAQ?.(faq)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.faqId, faq.question)}
                        disabled={loading || deletingFAQId === faq.faqId}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-100 rounded disabled:opacity-50"
                      >
                        {deletingFAQId === faq.faqId ? "删除中..." : "删除"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && faqs.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
