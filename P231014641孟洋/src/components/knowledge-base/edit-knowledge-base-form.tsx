"use client";

import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import type { KnowledgeBase } from "@/types/knowledge-base";

interface EditKnowledgeBaseFormProps {
  apiKey: string;
  knowledgeBase: KnowledgeBase;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditKnowledgeBaseForm({
  apiKey,
  knowledgeBase,
  onSuccess,
  onCancel,
}: EditKnowledgeBaseFormProps) {
  const [kbName, setKbName] = useState(knowledgeBase.kbName);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { updateKnowledgeBaseName } = useKnowledgeBase(apiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kbName.trim()) {
      setLocalError("请输入知识库名称");
      return;
    }

    if (kbName.trim() === knowledgeBase.kbName) {
      // 名称没有变化，直接取消
      onCancel?.();
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      await updateKnowledgeBaseName({
        kbId: knowledgeBase.kbId,
        kbName: kbName.trim(),
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "更新失败";
      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">编辑知识库</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          disabled={localLoading}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {localError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="kbName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            知识库名称
          </label>
          <input
            type="text"
            id="kbName"
            value={kbName}
            onChange={(e) => setKbName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入知识库名称"
            disabled={localLoading}
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={localLoading || !kbName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-black rounded-lg font-medium transition-colors"
          >
            {localLoading ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={localLoading}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
