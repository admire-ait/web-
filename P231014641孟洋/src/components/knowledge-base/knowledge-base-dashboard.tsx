"use client";

import { useState } from "react";
import {
  KnowledgeBaseList,
  CreateKnowledgeBaseForm,
  FileUpload,
  DocumentList,
  FAQList,
  CreateFAQForm,
  EditFAQForm,
} from "./index";
import EditKnowledgeBaseForm from "./edit-knowledge-base-form";
import type { KnowledgeBase, FAQ } from "@/types/knowledge-base";

interface KnowledgeBaseDashboardProps {
  apiKey: string;
}

export default function KnowledgeBaseDashboard({
  apiKey,
}: KnowledgeBaseDashboardProps) {
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingKb, setEditingKb] = useState<KnowledgeBase | null>(null);
  const [activeTab, setActiveTab] = useState<"documents" | "upload" | "faqs">(
    "documents"
  );

  // FAQ相关状态
  const [showCreateFAQForm, setShowCreateFAQForm] = useState(false);
  const [showEditFAQForm, setShowEditFAQForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const handleSelectKb = (kb: KnowledgeBase) => {
    setSelectedKb(kb);
    setActiveTab("documents");
  };

  const handleCreateSuccess = (kbId: string) => {
    setShowCreateForm(false);
    // 可以选择自动选中新创建的知识库
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingKb(null);
    // 刷新会自动发生，因为 hook 中调用了 fetchKnowledgeBaseList
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setEditingKb(null);
  };

  // FAQ相关处理函数
  const handleCreateFAQSuccess = () => {
    setShowCreateFAQForm(false);
    // 创建成功后确保用户能看到新创建的FAQ
    console.log("FAQ创建成功，切换回列表视图");
  };

  const handleCreateFAQCancel = () => {
    setShowCreateFAQForm(false);
  };

  const handleEditFAQSuccess = () => {
    setShowEditFAQForm(false);
    setEditingFAQ(null);
    // 编辑成功后确保用户能看到更新后的FAQ
    console.log("FAQ编辑成功，切换回列表视图");
  };

  const handleEditFAQCancel = () => {
    setShowEditFAQForm(false);
    setEditingFAQ(null);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setShowEditFAQForm(true);
    setShowCreateFAQForm(false);
  };

  return (
    <div className="min-h-screen p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-black text-xl font-bold">📚</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">
                知识库管理中心
              </h1>
              <p className="mt-2 text-purple-600">
                智能管理您的知识库、文档和常见问题
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：知识库列表 */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl">
              {showCreateForm ? (
                <CreateKnowledgeBaseForm
                  apiKey={apiKey}
                  onSuccess={handleCreateSuccess}
                  onCancel={handleCreateCancel}
                />
              ) : showEditForm && editingKb ? (
                <EditKnowledgeBaseForm
                  apiKey={apiKey}
                  knowledgeBase={editingKb}
                  onSuccess={handleEditSuccess}
                  onCancel={handleEditCancel}
                />
              ) : (
                <KnowledgeBaseList
                  apiKey={apiKey}
                  onSelectKb={handleSelectKb}
                  onCreateKb={() => {
                    setShowCreateForm(true);
                    setShowEditForm(false); // 确保编辑表单关闭
                  }}
                  onDeleteKb={() => {
                    // 如果删除的是当前选中的知识库，清空选择
                    if (selectedKb) {
                      setSelectedKb(null);
                    }
                  }}
                  onEditKb={(kb) => {
                    setEditingKb(kb);
                    setShowEditForm(true);
                    setShowCreateForm(false); // 确保创建表单关闭
                  }}
                />
              )}
            </div>
          </div>

          {/* 右侧：知识库详情 */}
          <div className="lg:col-span-2">
            {selectedKb ? (
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* 知识库信息头部 */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedKb.kbName}
                      </h2>
                      {selectedKb.createTime && (
                        <p className="text-purple-100 text-sm">
                          📅 创建时间:{" "}
                          {new Date(selectedKb.createTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedKb(null)}
                      className="text-black hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 标签页导航 */}
                <div className="bg-white bg-opacity-50 border-b border-purple-200">
                  <nav className="flex space-x-2 px-6">
                    <button
                      onClick={() => setActiveTab("documents")}
                      className={`py-4 px-6 font-semibold text-sm transition-all duration-300 border-b-3 ${
                        activeTab === "documents"
                          ? "border-purple-500 text-purple-700 bg-white bg-opacity-80 rounded-t-lg"
                          : "border-transparent text-purple-600 hover:text-purple-800 hover:bg-white hover:bg-opacity-40 rounded-t-lg"
                      }`}
                    >
                      📄 文档管理
                    </button>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className={`py-4 px-6 font-semibold text-sm transition-all duration-300 border-b-3 ${
                        activeTab === "upload"
                          ? "border-purple-500 text-purple-700 bg-white bg-opacity-80 rounded-t-lg"
                          : "border-transparent text-purple-600 hover:text-purple-800 hover:bg-white hover:bg-opacity-40 rounded-t-lg"
                      }`}
                    >
                      ⬆️ 上传文档
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("faqs");
                        setShowCreateFAQForm(false);
                        setShowEditFAQForm(false);
                      }}
                      className={`py-4 px-6 font-semibold text-sm transition-all duration-300 border-b-3 ${
                        activeTab === "faqs"
                          ? "border-purple-500 text-purple-700 bg-white bg-opacity-80 rounded-t-lg"
                          : "border-transparent text-purple-600 hover:text-purple-800 hover:bg-white hover:bg-opacity-40 rounded-t-lg"
                      }`}
                    >
                      ❓ 问答管理
                    </button>
                  </nav>
                </div>

                {/* 标签页内容 */}
                <div className="p-8 bg-white bg-opacity-70">
                  {activeTab === "documents" && (
                    <DocumentList
                      apiKey={apiKey}
                      kbId={selectedKb.kbId}
                      onDeleteSuccess={() => {
                        // 可以添加删除成功后的处理
                      }}
                    />
                  )}

                  {activeTab === "upload" && (
                    <FileUpload
                      apiKey={apiKey}
                      kbId={selectedKb.kbId}
                      onUploadSuccess={() => {
                        // 上传成功后切换到文档列表
                        setActiveTab("documents");
                      }}
                    />
                  )}

                  {activeTab === "faqs" && (
                    <>
                      {showCreateFAQForm ? (
                        <CreateFAQForm
                          apiKey={apiKey}
                          kbId={selectedKb.kbId}
                          onSuccess={handleCreateFAQSuccess}
                          onCancel={handleCreateFAQCancel}
                        />
                      ) : showEditFAQForm && editingFAQ ? (
                        <EditFAQForm
                          apiKey={apiKey}
                          kbId={selectedKb.kbId}
                          faq={editingFAQ}
                          onSuccess={handleEditFAQSuccess}
                          onCancel={handleEditFAQCancel}
                        />
                      ) : (
                        <FAQList
                          apiKey={apiKey}
                          kbId={selectedKb.kbId}
                          onCreateFAQ={() => {
                            setShowCreateFAQForm(true);
                            setShowEditFAQForm(false);
                          }}
                          onEditFAQ={handleEditFAQ}
                          onDeleteSuccess={() => {
                            // FAQ删除成功后的处理
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card p-16 rounded-2xl text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">
                  选择知识库
                </h3>
                <p className="text-purple-600 text-lg">
                  🔍 从左侧列表中选择一个知识库开始管理
                </p>
                <p className="text-purple-500 text-sm mt-2">
                  管理文档、上传文件、配置问答...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
