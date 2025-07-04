import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  DeleteAgentRequest,
  BindKbsRequest,
  UnbindKbsRequest,
  ApiResponse
} from '@/types/agent';

const BASE_URL = 'https://openapi.youdao.com/q_anything/api/bot';

class AgentService {
  private apikey: string = '';

  setApiKey(apikey: string) {
    this.apikey = apikey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': this.apikey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // API返回格式为 {result: [...]}，提取result字段
      const result = data.result || data;
      
      
      return { success: true, data: result };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createAgent(agentData: CreateAgentRequest): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('/create', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentData: UpdateAgentRequest): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('/update', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(deleteData: DeleteAgentRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/delete', {
      method: 'POST',
      body: JSON.stringify(deleteData),
    });
  }

  async getAgentList(): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>('/list', {
      method: 'GET',
    });
  }

  async getAgentDetail(uuid: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/detail?uuid=${uuid}`, {
      method: 'GET',
    });
  }

  async bindKnowledgeBases(bindData: BindKbsRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/bindKbs', {
      method: 'POST',
      body: JSON.stringify(bindData),
    });
  }

  async unbindKnowledgeBases(unbindData: UnbindKbsRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/unbindKbs', {
      method: 'POST',
      body: JSON.stringify(unbindData),
    });
  }
}

export const agentService = new AgentService();