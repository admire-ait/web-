import { ApiResponse } from '@/types/agent';

export interface ChatMessage {
  question: string;
  response: string;
}

export interface KnowledgeBaseChatRequest {
  question: string;
  kbIds: string[];
  prompt?: string;
  history?: ChatMessage[];
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  sourceNeeded: string;
}

export interface AgentChatRequest {
  uuid: string;
  question: string;
  sourceNeeded: string;
  history?: ChatMessage[];
}

export interface ChatStreamChunk {
  success?: boolean;
  errorCode: string;
  msg: string;
  requestId?: string;
  result?: {
    qaId: number;
    singleQAId: number | null;
    question: string;
    response: string;
    history: any[];
    source: any[];
    picList: any[];
    rollbackLength: number;
  };
}

const BASE_URL = 'https://openapi.youdao.com/q_anything/api';

class ChatService {
  private apikey: string = '';

  setApiKey(apikey: string) {
    this.apikey = apikey;
  }

  private async *streamRequest(
    endpoint: string,
    requestData: any
  ): AsyncGenerator<ChatStreamChunk, void, unknown> {
    try {
      console.log('API Request URL:', `${BASE_URL}${endpoint}`);
      console.log('API Request Data:', JSON.stringify(requestData, null, 2));
      console.log('API Key:', this.apikey ? `${this.apikey.substring(0, 10)}...` : 'Missing');

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': this.apikey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // 处理可能的多个事件在同一chunk中
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留可能不完整的最后一行
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            
            // 处理 "event:data" 行，跳过
            if (line.startsWith('event:')) {
              continue;
            }
            
            // 处理 "data:{...}" 行
            if (line.startsWith('data:')) {
              const jsonStr = line.slice(5); // 移除 'data:' 前缀
              
              if (jsonStr.trim() === '[DONE]') {
                return;
              }
              
              try {
                const data = JSON.parse(jsonStr);
                yield data;
              } catch (e) {
                console.error('Error parsing JSON:', e, 'Raw data:', jsonStr);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Stream request failed:', error);
      yield {
        success: false,
        errorCode: 'STREAM_ERROR',
        msg: error instanceof Error ? error.message : 'Unknown stream error'
      };
    }
  }

  async *chatWithKnowledgeBase(
    request: KnowledgeBaseChatRequest
  ): AsyncGenerator<ChatStreamChunk, void, unknown> {
    yield* this.streamRequest('/chat_stream', request);
  }

  async *chatWithAgent(
    request: AgentChatRequest
  ): AsyncGenerator<ChatStreamChunk, void, unknown> {
    yield* this.streamRequest('/bot/chat_stream', request);
  }

  // 非流式聊天方法，用于兼容
  async chatWithKnowledgeBaseSync(
    request: KnowledgeBaseChatRequest
  ): Promise<ApiResponse<{ response: string; source?: any[] }>> {
    try {
      let fullResponse = '';
      let source: any[] = [];

      for await (const chunk of this.chatWithKnowledgeBase(request)) {
        if (chunk.success && chunk.result) {
          fullResponse += chunk.result.response || '';
          if (chunk.result.source) {
            source = chunk.result.source;
          }
        } else if (!chunk.success) {
          return {
            success: false,
            error: chunk.msg || 'Chat request failed'
          };
        }
      }

      return {
        success: true,
        data: { response: fullResponse, source }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async chatWithAgentSync(
    request: AgentChatRequest
  ): Promise<ApiResponse<{ response: string; source?: any[] }>> {
    try {
      let fullResponse = '';
      let source: any[] = [];

      for await (const chunk of this.chatWithAgent(request)) {
        if (chunk.success && chunk.result) {
          fullResponse += chunk.result.response || '';
          if (chunk.result.source) {
            source = chunk.result.source;
          }
        } else if (!chunk.success) {
          return {
            success: false,
            error: chunk.msg || 'Chat request failed'
          };
        }
      }

      return {
        success: true,
        data: { response: fullResponse, source }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const chatService = new ChatService();