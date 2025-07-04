"use client";

import { useState, useEffect } from "react";
import { Agent, CreateAgentRequest, UpdateAgentRequest } from "@/types/agent";
import { agentService } from "@/services/agentService";
import { AgentList } from "./agent-list";
import { AgentForm } from "./agent-form";
import { AgentDetail } from "./agent-detail";
import { AgentKbBinding } from "./agent-kb-binding";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

type ViewMode = "list" | "create" | "edit" | "detail" | "kb-binding";

interface AgentDashboardProps {
  apiKey: string;
}

export function AgentDashboard({ apiKey }: AgentDashboardProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    if (apiKey) {
      agentService.setApiKey(apiKey);
      loadAgents();
    }
  }, [apiKey]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const response = await agentService.getAgentList();
      if (response.success && response.data) {
        // 确保 response.data 是数组
        const agentsData = Array.isArray(response.data) ? response.data : [];
        setAgents(agentsData);
      } else {
        console.error("Failed to load agents:", response.error);
        setAgents([]); // 设置为空数组
        showError(`加载Agent列表失败: ${response.error}`);
      }
    } catch (error) {
      console.error("Error loading agents:", error);
      setAgents([]); // 设置为空数组
      showError("加载Agent列表时发生错误");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (agentData: CreateAgentRequest) => {
    try {
      const response = await agentService.createAgent(agentData);
      if (response.success) {
        showSuccess("Agent创建成功");
        setViewMode("list");
        loadAgents();
      } else {
        showError(`创建Agent失败: ${response.error}`);
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      showError("创建Agent时发生错误");
    }
  };

  const handleUpdateAgent = async (agentData: UpdateAgentRequest) => {
    try {
      const response = await agentService.updateAgent(agentData);
      if (response.success) {
        showSuccess("Agent更新成功");
        setViewMode("list");
        setSelectedAgent(null);
        loadAgents();
      } else {
        showError(`更新Agent失败: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      showError("更新Agent时发生错误");
    }
  };

  const handleDeleteAgent = async (uuid: string) => {
    if (!confirm("确定要删除这个Agent吗？")) {
      return;
    }

    try {
      const response = await agentService.deleteAgent({ uuid });
      if (response.success) {
        showSuccess("Agent删除成功");
        loadAgents();
      } else {
        showError(`删除Agent失败: ${response.error}`);
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      showError("删除Agent时发生错误");
    }
  };

  const handleViewDetail = async (uuid: string) => {
    try {
      const response = await agentService.getAgentDetail(uuid);
      if (response.success && response.data) {
        setSelectedAgent(response.data);
        setViewMode("detail");
      } else {
        showError(`获取Agent详情失败: ${response.error}`);
      }
    } catch (error) {
      console.error("Error getting agent detail:", error);
      showError("获取Agent详情时发生错误");
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setViewMode("edit");
  };

  const handleManageKnowledgeBases = (agent: Agent) => {
    setSelectedAgent(agent);
    setViewMode("kb-binding");
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen p-6 pt-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              API Key未配置
            </h2>
            <p className="text-purple-600">
              请在环境变量中配置 NEXT_PUBLIC_QANYTHING_API_KEY
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className="min-h-screen p-6 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-black text-xl font-bold">🤖</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-purple-900">
                    Agent智能助手
                  </h1>
                  <p className="text-purple-600 mt-1">
                    管理您的AI助手，配置知识库绑定
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {viewMode !== "list" && (
                  <button
                    onClick={() => {
                      setViewMode("list");
                      setSelectedAgent(null);
                    }}
                    className="btn-secondary"
                  >
                    ← 返回列表
                  </button>
                )}
                {viewMode === "list" && (
                  <button
                    onClick={() => setViewMode("create")}
                    className="btn-primary"
                  >
                    ✨ 创建Agent
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {viewMode === "list" && (
              <div className="glass-card p-6 rounded-2xl">
                <AgentList
                  agents={agents}
                  loading={loading}
                  onEdit={handleEditAgent}
                  onDelete={handleDeleteAgent}
                  onViewDetail={handleViewDetail}
                />
              </div>
            )}

            {viewMode === "create" && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    创建新的Agent
                  </h2>
                  <p className="text-purple-600">配置您的AI助手参数</p>
                </div>
                <AgentForm
                  onSubmit={handleCreateAgent}
                  onCancel={() => setViewMode("list")}
                />
              </div>
            )}

            {viewMode === "edit" && selectedAgent && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    编辑Agent
                  </h2>
                  <p className="text-purple-600">
                    修改 {selectedAgent.name} 的配置
                  </p>
                </div>
                <AgentForm
                  agent={selectedAgent}
                  onSubmit={handleUpdateAgent}
                  onCancel={() => {
                    setViewMode("list");
                    setSelectedAgent(null);
                  }}
                  isEditing={true}
                />
              </div>
            )}

            {viewMode === "detail" && selectedAgent && (
              <div className="glass-card p-8 rounded-2xl">
                <AgentDetail
                  agent={selectedAgent}
                  onClose={() => {
                    setViewMode("list");
                    setSelectedAgent(null);
                  }}
                  onEdit={handleEditAgent}
                  onManageKnowledgeBases={handleManageKnowledgeBases}
                />
              </div>
            )}

            {viewMode === "kb-binding" && selectedAgent && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    知识库绑定
                  </h2>
                  <p className="text-purple-600">
                    为 {selectedAgent.name} 配置知识库
                  </p>
                </div>
                <AgentKbBinding
                  agent={selectedAgent}
                  apiKey={apiKey}
                  onClose={() => {
                    setViewMode("detail");
                  }}
                  onSuccess={async () => {
                    await loadAgents();
                    if (selectedAgent) {
                      try {
                        const response = await agentService.getAgentDetail(
                          selectedAgent.uuid
                        );
                        if (response.success && response.data) {
                          setSelectedAgent(response.data);
                          setViewMode("detail");
                        }
                      } catch (error) {
                        console.error("Error refreshing agent detail:", error);
                        setViewMode("detail");
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
