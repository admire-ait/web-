'use client';

import { Agent } from '@/types/agent';
import { AgentCard } from './agent-card';

interface AgentListProps {
  agents: Agent[];
  loading?: boolean;
  onEdit: (agent: Agent) => void;
  onDelete: (uuid: string) => void;
  onViewDetail: (uuid: string) => void;
}

export function AgentList({ agents, loading, onEdit, onDelete, onViewDetail }: AgentListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    );
  }

  // 确保 agents 是数组
  const agentsList = Array.isArray(agents) ? agents : [];

  if (agentsList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">暂无Agent</div>
        <p className="text-gray-400 mt-2">点击"创建Agent"开始创建您的第一个Agent</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agentsList.map((agent) => (
        <AgentCard
          key={agent.uuid}
          agent={agent}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}