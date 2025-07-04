"use client";

import { useState } from "react";
import { Agent, CreateAgentRequest, UpdateAgentRequest } from "@/types/agent";

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function AgentForm({
  agent,
  onSubmit,
  onCancel,
  isEditing = false,
}: AgentFormProps) {
  const [formData, setFormData] = useState({
    botName: agent?.name || "",
    botDescription: agent?.description || "",
    model: agent?.model || "QAnything 4o mini",
    maxToken: agent?.maxToken?.toString() || "1024",
    hybridSearch: agent?.hybridSearch?.toString() || "false",
    networking: agent?.networking?.toString() || "true",
    needSource: agent?.needSource?.toString() || "true",
    botPromptSetting: agent?.promptSetting || "",
    welcomeMessage: agent?.welcomeMessage || "",
    kbIds: agent?.kbIds?.join(",") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const kbIdsArray = formData.kbIds
      .split(",")
      .filter((id) => id.trim())
      .map((id) => id.trim());

    if (isEditing && agent?.uuid) {
      // 只发送有变更的字段
      const updateData: UpdateAgentRequest = {
        uuid: agent.uuid,
      };

      // 比较并添加变更的字段
      if (formData.botName !== agent.name) {
        updateData.botName = formData.botName;
      }
      if (formData.botDescription !== agent.description) {
        updateData.botDescription = formData.botDescription;
      }
      if (formData.model !== agent.model) {
        updateData.model = formData.model;
      }
      if (formData.maxToken !== agent.maxToken.toString()) {
        updateData.maxToken = formData.maxToken;
      }
      if (formData.hybridSearch !== agent.hybridSearch.toString()) {
        updateData.hybridSearch = formData.hybridSearch;
      }
      if (formData.networking !== agent.networking.toString()) {
        updateData.networking = formData.networking;
      }
      if (formData.needSource !== agent.needSource.toString()) {
        updateData.needSource = formData.needSource;
      }
      if (formData.botPromptSetting !== (agent.promptSetting || "")) {
        updateData.botPromptSetting = formData.botPromptSetting;
      }
      if (formData.welcomeMessage !== (agent.welcomeMessage || "")) {
        updateData.welcomeMessage = formData.welcomeMessage;
      }

      onSubmit(updateData);
    } else {
      const createData: CreateAgentRequest = {
        kbIds: kbIdsArray,
        botName: formData.botName,
        botDescription: formData.botDescription,
        model: formData.model,
        maxToken: formData.maxToken,
        hybridSearch: formData.hybridSearch,
        networking: formData.networking,
        needSource: formData.needSource,
        botPromptSetting: formData.botPromptSetting,
        welcomeMessage: formData.welcomeMessage,
      };
      onSubmit(createData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "编辑Agent" : "创建Agent"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agent名称 *
          </label>
          <input
            type="text"
            name="botName"
            value={formData.botName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agent描述 *
          </label>
          <textarea
            name="botDescription"
            value={formData.botDescription}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              知识库ID (用逗号分隔) *
            </label>
            <input
              type="text"
              name="kbIds"
              value={formData.kbIds}
              onChange={handleInputChange}
              required
              placeholder="KB248e8e079642491383596f63c2ab069a_240430,KB..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型 *
            </label>
            <select
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="QAnything 4o mini">QAnything 4o mini</option>
              <option value="QAnything 16k">QAnything 16k</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大Token *
            </label>
            <select
              name="maxToken"
              value={formData.maxToken}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1024">1024</option>
              <option value="2048">2048</option>
              <option value="4096">4096</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              混合搜索
            </label>
            <select
              name="hybridSearch"
              value={formData.hybridSearch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">禁用</option>
              <option value="true">启用</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              网络搜索
            </label>
            <select
              name="networking"
              value={formData.networking}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">禁用</option>
              <option value="true">启用</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              需要来源
            </label>
            <select
              name="needSource"
              value={formData.needSource}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">不需要</option>
              <option value="true">需要</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            提示设置
          </label>
          <textarea
            name="botPromptSetting"
            value={formData.botPromptSetting}
            onChange={handleInputChange}
            rows={3}
            placeholder="你是一个XXX专家。"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            欢迎消息
          </label>
          <textarea
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={handleInputChange}
            rows={4}
            placeholder="您好，我是您的专属机器人，请问有什么可以帮您呢？"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "更新Agent" : "创建Agent"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
