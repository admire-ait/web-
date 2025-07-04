"use client";

import { useState, useEffect } from "react";
import { Agent } from "@/types/agent";
import { KnowledgeBase } from "@/types/knowledge-base";
import { agentService } from "@/services/agentService";
import { KnowledgeBaseClient } from "@/lib/knowledge-base-client";
import { useToast } from "@/hooks/useToast";

interface AgentKbBindingProps {
  agent: Agent;
  apiKey: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AgentKbBinding({
  agent,
  apiKey,
  onClose,
  onSuccess,
}: AgentKbBindingProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [bindLoading, setBidnLoading] = useState(false);
  // 从kbBindList或kbIds中提取当前绑定的知识库ID列表
  const getCurrentKbIds = () => {
    if (agent.kbBindList && agent.kbBindList.length > 0) {
      return agent.kbBindList.map((kb) => kb.kbId);
    }
    return agent.kbIds || [];
  };

  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(
    getCurrentKbIds()
  );
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (apiKey) {
      loadKnowledgeBases();
    }
  }, [apiKey]);

  const loadKnowledgeBases = async () => {
    setLoading(true);
    try {
      const client = new KnowledgeBaseClient(apiKey);
      const response = await client.getKnowledgeBaseList();

      if (response.errorCode === "0" && response.result) {
        const kbData = Array.isArray(response.result) ? response.result : [];
        setKnowledgeBases(kbData);
      } else {
        console.error("Failed to load knowledge bases:", response.msg);
        setKnowledgeBases([]);
        showError(`加载知识库列表失败: ${response.msg}`);
      }
    } catch (error) {
      console.error("Error loading knowledge bases:", error);
      setKnowledgeBases([]);
      showError("加载知识库列表时发生错误");
    } finally {
      setLoading(false);
    }
  };

  const handleKbToggle = (kbId: string) => {
    setSelectedKbIds((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId]
    );
  };

  const handleSave = async () => {
    setBidnLoading(true);
    try {
      const currentKbIds = getCurrentKbIds();
      const toAdd = selectedKbIds.filter((id) => !currentKbIds.includes(id));
      const toRemove = currentKbIds.filter((id) => !selectedKbIds.includes(id));

      // 检查单个Agent最多绑定100个知识库的限制
      if (selectedKbIds.length > 100) {
        showError("单个Agent最多只能绑定100个知识库");
        return;
      }

      // 解绑不需要的知识库
      if (toRemove.length > 0) {
        const unbindResponse = await agentService.unbindKnowledgeBases({
          uuid: agent.uuid,
          kbIds: toRemove,
        });

        if (!unbindResponse.success) {
          showError(`解绑知识库失败: ${unbindResponse.error}`);
          return;
        }
      }

      // 绑定新的知识库
      if (toAdd.length > 0) {
        const bindResponse = await agentService.bindKnowledgeBases({
          uuid: agent.uuid,
          kbIds: toAdd,
        });

        if (!bindResponse.success) {
          showError(`绑定知识库失败: ${bindResponse.error}`);
          return;
        }
      }

      showSuccess("知识库绑定更新成功");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating knowledge base bindings:", error);
      showError("更新知识库绑定时发生错误");
    } finally {
      setBidnLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedKbIds.length === knowledgeBases.length) {
      setSelectedKbIds([]);
    } else {
      setSelectedKbIds(knowledgeBases.map((kb) => kb.kbId));
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">知识库绑定</h2>
            <p className="text-gray-600 mt-1">为 "{agent.name}" 绑定知识库</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">加载知识库列表...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                已选择 {selectedKbIds.length} 个知识库 (最多100个)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedKbIds.length === knowledgeBases.length
                    ? "取消全选"
                    : "全选"}
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-md">
              {knowledgeBases.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  暂无可用的知识库
                </div>
              ) : (
                <div className="divide-y">
                  {knowledgeBases.map((kb) => (
                    <label
                      key={kb.kbId}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedKbIds.includes(kb.kbId)}
                        onChange={() => handleKbToggle(kb.kbId)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">
                          {kb.kbName}
                        </div>
                        <div className="text-sm text-gray-500">{kb.kbId}</div>
                        {kb.createTime && (
                          <div className="text-sm text-gray-600 mt-1">
                            创建时间: {kb.createTime}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={bindLoading}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={bindLoading || loading}
          className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
        >
          {bindLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          保存
        </button>
      </div>
    </div>
  );
}
