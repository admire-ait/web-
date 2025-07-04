"use client";

import { useState, useRef } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";

interface FileUploadProps {
  apiKey: string;
  kbId: string;
  onUploadSuccess?: () => void;
}

export default function FileUpload({
  apiKey,
  kbId,
  onUploadSuccess,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, uploadUrl, loading, error } = useKnowledgeBase(apiKey);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadFile({ kbId, file });
      onUploadSuccess?.();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("文件上传失败:", error);
    }
  };

  const handleUrlUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("请输入URL");
      return;
    }

    try {
      await uploadUrl({ kbId, url: url.trim() });
      onUploadSuccess?.();
      setUrl("");
    } catch (error) {
      console.error("URL上传失败:", error);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">上传文档</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* 文件上传区域 */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">上传文件</h4>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
            accept=".pdf,.doc,.docx,.txt,.md,.html,.htm"
          />

          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600">
                {loading ? "上传中..." : "点击选择文件或拖拽文件到此处"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                支持 PDF, DOC, DOCX, TXT, MD, HTML 等格式
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* URL上传 */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">从URL上传</h4>
        <form onSubmit={handleUrlUpload} className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入文档URL (如: https://example.com/document.pdf)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-black rounded-lg text-sm font-medium flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "上传中..." : "从URL上传"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">处理中，请稍候...</span>
        </div>
      )}
    </div>
  );
}
