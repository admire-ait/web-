"use client";

import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import type { FAQ } from "@/types/knowledge-base";

interface EditFAQFormProps {
  apiKey: string;
  kbId: string;
  faq: FAQ;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditFAQForm({
  apiKey,
  kbId,
  faq,
  onSuccess,
  onCancel,
}: EditFAQFormProps) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { updateFAQ } = useKnowledgeBase(apiKey);

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

    // 检查是否有变化
    if (question.trim() === faq.question && answer.trim() === faq.answer) {
      // 没有变化，直接取消
      onCancel?.();
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      await updateFAQ({
        kbId,
        faqId: faq.faqId,
        question: question.trim(),
        answer: answer.trim(),
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "更新问答失败";
      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    // 恢复原始值
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setLocalError(null);
    onCancel?.();
  };

  // 检查是否有变化
  const hasChanges =
    question.trim() !== faq.question || answer.trim() !== faq.answer;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">编辑问答</h3>
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
        </div>

        {hasChanges && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ 您有未保存的修改</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={localLoading || !question.trim() || !answer.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-black rounded-lg font-medium transition-colors"
          >
            {localLoading ? "保存中..." : "保存修改"}
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

      {/* 原始内容对比 */}
      {hasChanges && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">原始内容</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">问题：</span>
              <span className="ml-1">{faq.question}</span>
            </div>
            <div>
              <span className="font-medium">答案：</span>
              <span className="ml-1">{faq.answer}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 编辑提示</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 修改问题时，确保新问题更准确地反映用户需求</li>
          <li>• 更新答案时，可以添加更多详细信息或修正错误</li>
          <li>• 保存后修改会立即生效</li>
        </ul>
      </div>
    </div>
  );
}
