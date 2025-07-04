"use client";

import { Agent } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (uuid: string) => void;
  onViewDetail: (uuid: string) => void;
}

export function AgentCard({
  agent,
  onEdit,
  onDelete,
  onViewDetail,
}: AgentCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetail(agent.uuid)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            详情
          </button>
          <button
            onClick={() => onEdit(agent)}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(agent.uuid)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            删除
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm">{agent.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>模型: {agent.model}</div>
        <div>最大Token: {agent.maxToken}</div>
        <div>混合搜索: {agent.hybridSearch ? "启用" : "禁用"}</div>
        <div>网络搜索: {agent.networking ? "启用" : "禁用"}</div>
      </div>

      {agent.uuid && (
        <div className="text-xs text-gray-400 font-mono">
          UUID: {agent.uuid}
        </div>
      )}
    </div>
  );
}
