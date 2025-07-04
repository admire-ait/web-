import type {
  ApiResponse,
  CreateKbRequest,
  CreateKbResponse,
  DeleteKbRequest,
  UploadFileRequest,
  UploadUrlRequest,
  DeleteFileRequest,
  UpdateKbNameRequest,
  CreateFAQRequest,
  UpdateFAQRequest,
  DeleteFAQRequest,
  GetFAQDetailRequest,
  KbListResponse,
  FileListResponse,
  FAQListResponse,
  FAQDetailResponse,
} from '@/types/knowledge-base';

export class KnowledgeBaseClient {
  private baseUrl = 'https://openapi.youdao.com/q_anything/api';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(contentType?: string) {
    const headers: Record<string, string> = {
      'Authorization': this.apiKey,
    };
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    return response.json();
  }

  // 创建知识库
  async createKnowledgeBase(request: CreateKbRequest): Promise<ApiResponse<CreateKbResponse>> {
    const response = await fetch(`${this.baseUrl}/create_kb`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse<CreateKbResponse>(response);
  }

  // 删除知识库
  async deleteKnowledgeBase(request: DeleteKbRequest): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/delete_kb`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // 上传文件
  async uploadFile(request: UploadFileRequest): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('kbId', request.kbId);

    const response = await fetch(`${this.baseUrl}/upload_file`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        // 注意：FormData时不要设置Content-Type，让浏览器自动设置multipart/form-data
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  // 上传URL文档
  async uploadUrl(request: UploadUrlRequest): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/upload_url`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // 删除文档
  async deleteFiles(request: DeleteFileRequest): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/delete_file`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // 获取知识库列表
  async getKnowledgeBaseList(): Promise<ApiResponse<KbListResponse>> {
    const response = await fetch(`${this.baseUrl}/kb_list`, {
      method: 'GET',
      headers: this.getHeaders(), // 不传Content-Type
    });
    return this.handleResponse<KbListResponse>(response);
  }

  // 获取知识库文档列表
  async getFileList(kbId: string): Promise<ApiResponse<FileListResponse>> {
    const response = await fetch(`${this.baseUrl}/file_list?kbId=${encodeURIComponent(kbId)}`, {
      method: 'GET',
      headers: this.getHeaders(), // 不传Content-Type
    });
    return this.handleResponse<FileListResponse>(response);
  }

  // 修改知识库名称
  async updateKnowledgeBaseName(request: UpdateKbNameRequest): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/kb_config`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // 创建FAQ (问答集)
  async createFAQ(request: CreateFAQRequest): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('kbId', request.kbId);
    formData.append('question', request.question);
    formData.append('answer', request.answer);

    const response = await fetch(`${this.baseUrl}/upload_faq`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        // 注意：FormData时不要设置Content-Type，让浏览器自动设置
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  // 更新FAQ (问答集)
  async updateFAQ(request: UpdateFAQRequest): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('kbId', request.kbId);
    formData.append('faqId', request.faqId);
    formData.append('question', request.question);
    formData.append('answer', request.answer);

    const response = await fetch(`${this.baseUrl}/update_faq`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        // 注意：FormData时不要设置Content-Type，让浏览器自动设置
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  // 删除FAQ
  async deleteFAQs(request: DeleteFAQRequest): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/delete_faq`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // 获取FAQ列表
  async getFAQList(kbId: string): Promise<ApiResponse<FAQListResponse>> {
    const response = await fetch(`${this.baseUrl}/faq_list?kbId=${encodeURIComponent(kbId)}`, {
      method: 'GET',
      headers: this.getHeaders(), // 不传Content-Type
    });
    return this.handleResponse<FAQListResponse>(response);
  }

  // 获取FAQ详情
  async getFAQDetail(request: GetFAQDetailRequest): Promise<ApiResponse<FAQDetailResponse>> {
    const response = await fetch(`${this.baseUrl}/faqDetail`, {
      method: 'POST',
      headers: this.getHeaders('application/json'),
      body: JSON.stringify(request),
    });
    return this.handleResponse<FAQDetailResponse>(response);
  }
}

// 创建默认实例的工厂函数
export function createKnowledgeBaseClient(apiKey: string): KnowledgeBaseClient {
  return new KnowledgeBaseClient(apiKey);
}