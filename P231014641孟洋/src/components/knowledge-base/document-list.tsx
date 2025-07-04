"use client";

import { useEffect, useState } from "react";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import type { Document } from "@/types/knowledge-base";

interface DocumentListProps {
  apiKey: string;
  kbId: string;
  onDeleteSuccess?: () => void;
}

export default function DocumentList({
  apiKey,
  kbId,
  onDeleteSuccess,
}: DocumentListProps) {
  const { documents, loading, error, fetchFileList, deleteFiles } =
    useKnowledgeBase(apiKey);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (kbId) {
      fetchFileList(kbId);
    }
  }, [kbId, fetchFileList]);

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(documents.map((doc) => doc.fileId));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) {
      alert("请选择要删除的文件");
      return;
    }

    if (
      confirm(
        `确定要删除选中的 ${selectedFiles.length} 个文件吗？此操作不可恢复。`
      )
    ) {
      try {
        await deleteFiles({ kbId, fileIds: selectedFiles });
        setSelectedFiles([]);
        onDeleteSuccess?.();
      } catch (error) {
        console.error("删除文件失败:", error);
      }
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "未知";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "success":
        return "已完成";
      case "processing":
        return "处理中";
      case "failed":
        return "失败";
      default:
        return "未知";
    }
  };

  if (loading && documents.length === 0) {
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
          onClick={() => fetchFileList(kbId)}
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
        <h3 className="text-lg font-semibold">文档列表</h3>
        {documents.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() =>
                handleSelectAll(
                  !selectedFiles.length ||
                    selectedFiles.length < documents.length
                )
              }
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              {selectedFiles.length === documents.length ? "取消全选" : "全选"}
            </button>
            {selectedFiles.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={loading}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-black rounded text-sm"
              >
                删除选中 ({selectedFiles.length})
              </button>
            )}
          </div>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p>暂无文档</p>
          <p className="text-sm mt-1">上传文件或从URL添加文档</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.fileId}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(doc.fileId)}
                onChange={(e) => handleSelectFile(doc.fileId, e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 truncate">
                    {doc.fileName}
                  </h4>
                  {doc.status && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {getStatusText(doc.status)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span>ID: {doc.fileId}</span>
                  {doc.fileSize && (
                    <span>大小: {formatFileSize(doc.fileSize)}</span>
                  )}
                  {doc.uploadTime && (
                    <span>
                      上传时间: {new Date(doc.uploadTime).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && documents.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
