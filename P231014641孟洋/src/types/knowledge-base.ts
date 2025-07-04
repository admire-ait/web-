// 知识库相关的类型定义

// QAnything API 的实际响应格式
export interface ApiResponse<T = any> {
  errorCode: string;
  msg: string;
  requestId: string;
  result?: T;
}

// 兼容旧格式的类型定义
export interface LegacyApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface KnowledgeBase {
  kbId: string;
  kbName: string;
  createTime?: string;
  updateTime?: string;
}

export interface Document {
  fileId: string;
  fileName: string;
  fileSize?: number;
  uploadTime?: string;
  status?: 'processing' | 'success' | 'failed';
}

export interface FAQ {
  faqId: string;
  question: string;
  answer: string;
  createTime?: string;
  updateTime?: string;
}

// API 请求参数类型
export interface CreateKbRequest {
  kbName: string;
}

export interface DeleteKbRequest {
  kbId: string;
}

export interface UploadFileRequest {
  kbId: string;
  file: File;
}

export interface UploadUrlRequest {
  kbId: string;
  url: string;
}

export interface DeleteFileRequest {
  kbId: string;
  fileIds: string[];
}

export interface UpdateKbNameRequest {
  kbId: string;
  kbName: string;
}

export interface CreateFAQRequest {
  kbId: string;
  question: string;
  answer: string;
}

export interface UpdateFAQRequest {
  kbId: string;
  faqId: string;
  question: string;
  answer: string;
}

export interface DeleteFAQRequest {
  kbId: string;
  faqIds: string[];
}

export interface GetFAQDetailRequest {
  kbId: string;
  faqId: string;
}

// API 响应数据类型
export interface CreateKbResponse {
  kbId: string;
}

// QAnything API 中，知识库列表直接作为数组返回在 result 字段中
export interface KbListResponse extends Array<KnowledgeBase> {}

// QAnything API 中，文件列表和FAQ列表都直接作为数组返回在 result 字段中
export interface FileListResponse extends Array<Document> {}

export interface FAQListResponse {
  faqList: FAQ[];
  total: number;
}

// FAQ详情直接返回FAQ对象在 result 字段中
export interface FAQDetailResponse extends FAQ {}