// 知识库组件的统一导出

// 知识库管理组件
export { default as KnowledgeBaseList } from './knowledge-base-list';
export { default as CreateKnowledgeBaseForm } from './create-knowledge-base-form';
export { default as EditKnowledgeBaseForm } from './edit-knowledge-base-form';

// 文档管理组件
export { default as FileUpload } from './file-upload';
export { default as DocumentList } from './document-list';

// FAQ管理组件
export { default as FAQList } from './faq-list';
export { default as CreateFAQForm } from './create-faq-form';
export { default as EditFAQForm } from './edit-faq-form';

// 主要Dashboard组件
export { default as KnowledgeBaseDashboard } from './knowledge-base-dashboard';

// 类型导出
export type { KnowledgeBase, Document, FAQ } from '@/types/knowledge-base';