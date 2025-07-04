export interface KnowledgeBaseBinding {
  kbId: string;
  kbName: string;
}

export interface Agent {
  uuid: string;
  name: string;
  description: string;
  model: string;
  maxToken: number;
  hybridSearch: boolean;
  networking: boolean;
  needSource: boolean;
  promptSetting?: string;
  welcomeMessage?: string;
  contextLength: number;
  rerankTopK: number;
  rerankScore: string;
  kbIds?: string[]; // 保留向后兼容
  kbBindList?: KnowledgeBaseBinding[]; // API实际返回的字段
}

export interface CreateAgentRequest {
  kbIds: string[];
  botName: string;
  botDescription: string;
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  needSource: string;
  botPromptSetting?: string;
  welcomeMessage?: string;
}

export interface UpdateAgentRequest {
  uuid: string;
  botName?: string;
  botDescription?: string;
  model?: string;
  maxToken?: string;
  hybridSearch?: string;
  networking?: string;
  needSource?: string;
  botPromptSetting?: string;
  welcomeMessage?: string;
}

export interface DeleteAgentRequest {
  uuid: string;
}

export interface BindKbsRequest {
  uuid: string;
  kbIds: string[];
}

export interface UnbindKbsRequest {
  uuid: string;
  kbIds: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}