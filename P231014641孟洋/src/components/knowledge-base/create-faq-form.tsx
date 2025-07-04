"use client";

import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";

interface CreateFAQFormProps {
  apiKey: string;
  kbId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateFAQForm({
  apiKey,
  kbId,
  onSuccess,
  onCancel,
}: CreateFAQFormProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { createFAQ } = useKnowledgeBase(apiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setLocalError("请输入问题");
      return;
    }

    if (!answer.trim()) {
      setLocalError("请输入答案");
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      await createFAQ({
        kbId,
        question: question.trim(),
        answer: answer.trim(),
      });

      // 清空表单
      setQuestion("");
      setAnswer("");

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "创建问答失败";
      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    setQuestion("");
    setAnswer("");
    setLocalError(null);
    onCancel?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">创建问答</h3>
        <button
          onClick={handleCancel}
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
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            问题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入常见问题，例如：如何使用这个功能？"
            disabled={localLoading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">输入用户可能会问的问题</p>
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            答案 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入详细的答案，帮助用户解决问题..."
            disabled={localLoading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">提供清晰、详细的答案</p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={localLoading || !question.trim() || !answer.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-black rounded-lg font-medium transition-colors"
          >
            {localLoading ? "创建中..." : "创建问答"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={localLoading}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </form>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 创建提示</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 问题应该简洁明确，使用用户常用的表达方式</li>
          <li>• 答案要准确完整，能够解决用户的实际问题</li>
          <li>• 可以在答案中包含步骤说明或相关链接</li>
        </ul>
      </div>
    </div>
  );
}
