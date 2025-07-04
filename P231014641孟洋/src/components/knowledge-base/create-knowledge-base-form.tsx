"use client";

import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";

interface CreateKnowledgeBaseFormProps {
  apiKey: string;
  onSuccess?: (kbId: string) => void;
  onCancel?: () => void;
}

export default function CreateKnowledgeBaseForm({
  apiKey,
  onSuccess,
  onCancel,
}: CreateKnowledgeBaseFormProps) {
  const [kbName, setKbName] = useState("");
  const { createKnowledgeBase, loading, error } = useKnowledgeBase(apiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kbName.trim()) {
      alert("请输入知识库名称");
      return;
    }

    try {
      const result = await createKnowledgeBase({ kbName: kbName.trim() });
      if (result?.kbId) {
        onSuccess?.(result.kbId);
        setKbName("");
      }
    } catch (error) {
      console.error("创建知识库失败:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">创建知识库</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="kbName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            知识库名称 *
          </label>
          <input
            type="text"
            id="kbName"
            value={kbName}
            onChange={(e) => setKbName(e.target.value)}
            placeholder="请输入知识库名称"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            maxLength={100}
          />
          <p className="mt-1 text-xs text-gray-500">{kbName.length}/100 字符</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading || !kbName.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-black rounded-lg text-sm font-medium flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "创建中..." : "创建"}
          </button>
        </div>
      </form>
    </div>
  );
}
