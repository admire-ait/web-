'use client';

import { useState, useEffect } from 'react';
import { KnowledgeBase } from '@/types/knowledge-base';
import { Agent } from '@/types/agent';
import { KnowledgeBaseClient } from '@/lib/knowledge-base-client';
import { agentService } from '@/services/agentService';

interface ChatConfigProps {
  apiKey: string;
  onConfigChange: (config: ChatConfig) => void;
}

export interface ChatConfig {
  mode: 'knowledge-base' | 'agent';
  kbIds: string[];
  agentUuid: string;
  model: string;
  maxToken: string;
  hybridSearch: boolean;
  networking: boolean;
  sourceNeeded: boolean;
}

export function ChatConfig({ apiKey, onConfigChange }: ChatConfigProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [config, setConfig] = useState<ChatConfig>({
    mode: 'knowledge-base',
    kbIds: [],
    agentUuid: '',
    model: 'QAnything 4o mini',
    maxToken: '1024',
    hybridSearch: false,
    networking: true,
    sourceNeeded: true,
  });
  const [loading, setLoading] = useState(true);
  const [knowledgeBaseClient, setKnowledgeBaseClient] = useState<KnowledgeBaseClient | null>(null);

  useEffect(() => {
    const initData = async () => {
      if (!apiKey) return;

      try {
        setLoading(true);
        const client = new KnowledgeBaseClient(apiKey);
        setKnowledgeBaseClient(client);
        agentService.setApiKey(apiKey);

        const [kbResponse, agentResponse] = await Promise.all([
          client.getKnowledgeBaseList(),
          agentService.getAgentList()
        ]);

        if (kbResponse.result) {
          setKnowledgeBases(kbResponse.result || []);
        }

        if (agentResponse.success) {
          setAgents(agentResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [apiKey]);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const handleConfigChange = (updates: Partial<ChatConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleKbToggle = (kbId: string) => {
    setConfig(prev => ({
      ...prev,
      kbIds: prev.kbIds.includes(kbId)
        ? prev.kbIds.filter(id => id !== kbId)
        : [...prev.kbIds, kbId]
    }));
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">加载配置中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold">聊天配置</h3>

      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          对话模式
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="knowledge-base"
              checked={config.mode === 'knowledge-base'}
              onChange={(e) => handleConfigChange({ mode: e.target.value as 'knowledge-base' })}
              className="mr-2"
            />
            知识库对话
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="agent"
              checked={config.mode === 'agent'}
              onChange={(e) => handleConfigChange({ mode: e.target.value as 'agent' })}
              className="mr-2"
            />
            Agent对话
          </label>
        </div>
      </div>

      {/* Knowledge Base Selection */}
      {config.mode === 'knowledge-base' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择知识库 ({config.kbIds.length} 个已选择)
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {knowledgeBases.map((kb) => (
              <label key={kb.kbId} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.kbIds.includes(kb.kbId)}
                  onChange={() => handleKbToggle(kb.kbId)}
                  className="mr-2"
                />
                <span className="text-sm">{kb.kbName}</span>
              </label>
            ))}
          </div>
          {knowledgeBases.length === 0 && (
            <p className="text-sm text-gray-500">暂无知识库</p>
          )}
        </div>
      )}

      {/* Agent Selection */}
      {config.mode === 'agent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择Agent
          </label>
          <select
            value={config.agentUuid}
            onChange={(e) => handleConfigChange({ agentUuid: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择Agent</option>
            {agents.map((agent) => (
              <option key={agent.uuid} value={agent.uuid}>
                {agent.name}
              </option>
            ))}
          </select>
          {agents.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">暂无Agent</p>
          )}
        </div>
      )}

      {/* Knowledge Base Settings */}
      {config.mode === 'knowledge-base' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              模型
            </label>
            <select
              value={config.model}
              onChange={(e) => handleConfigChange({ model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="QAnything 4o mini">QAnything 4o mini</option>
              <option value="deepseek-lite">DeepSeek Lite</option>
              <option value="deepseek-pro">DeepSeek Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大Token数
            </label>
            <input
              type="number"
              value={config.maxToken}
              onChange={(e) => handleConfigChange({ maxToken: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="4096"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.hybridSearch}
                onChange={(e) => handleConfigChange({ hybridSearch: e.target.checked })}
                className="mr-2"
              />
              启用混合搜索
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.networking}
                onChange={(e) => handleConfigChange({ networking: e.target.checked })}
                className="mr-2"
              />
              启用网络搜索
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.sourceNeeded}
                onChange={(e) => handleConfigChange({ sourceNeeded: e.target.checked })}
                className="mr-2"
              />
              显示来源信息
            </label>
          </div>
        </>
      )}

      {/* Agent Settings */}
      {config.mode === 'agent' && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sourceNeeded}
              onChange={(e) => handleConfigChange({ sourceNeeded: e.target.checked })}
              className="mr-2"
            />
            显示来源信息
          </label>
        </div>
      )}
    </div>
  );
}