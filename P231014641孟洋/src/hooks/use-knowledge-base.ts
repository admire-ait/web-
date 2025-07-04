'use client';

import { useState, useCallback, useMemo } from 'react';
import { KnowledgeBaseClient } from '@/lib/knowledge-base-client';
import type {
  KnowledgeBase,
  Document,
  FAQ,
  CreateKbRequest,
  UploadFileRequest,
  UploadUrlRequest,
  DeleteFileRequest,
  UpdateKbNameRequest,
  CreateFAQRequest,
  UpdateFAQRequest,
  DeleteFAQRequest,
  GetFAQDetailRequest,
} from '@/types/knowledge-base';

interface UseKnowledgeBaseState {
  loading: boolean;
  error: string | null;
  knowledgeBases: KnowledgeBase[];
  documents: Document[];
  faqs: FAQ[];
}

export function useKnowledgeBase(apiKey: string) {
  const [state, setState] = useState<UseKnowledgeBaseState>({
    loading: false,
    error: null,
    knowledgeBases: [],
    documents: [],
    faqs: [],
  });

  const client = useMemo(() => new KnowledgeBaseClient(apiKey), [apiKey]);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // 创建知识库
  const createKnowledgeBase = useCallback(async (request: CreateKbRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.createKnowledgeBase(request);
      if (response.errorCode === '0') {
        await fetchKnowledgeBaseList(); // 刷新列表
        return response.result;
      } else {
        throw new Error(response.msg || '创建知识库失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建知识库失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除知识库
  const deleteKnowledgeBase = useCallback(async (kbId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteKnowledgeBase({ kbId });
      if (response.errorCode === '0') {
        await fetchKnowledgeBaseList(); // 刷新列表
        return true;
      } else {
        throw new Error(response.msg || '删除知识库失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除知识库失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取知识库列表
  const fetchKnowledgeBaseList = useCallback(async () => {
    if (!apiKey) {
      setError('请先配置 API Key');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await client.getKnowledgeBaseList();
      
      // 检查响应是否为有效对象
      if (!response || typeof response !== 'object') {
        throw new Error(`无效的API响应格式: ${JSON.stringify(response)}`);
      }
      
      // QAnything API 的实际响应格式
      // 检查是否有错误码 (errorCode 为字符串 "0" 表示成功)
      if (response.errorCode !== undefined && response.errorCode !== '0') {
        throw new Error(`API错误 (errorCode: ${response.errorCode}): ${response.msg || '未知错误'}`);
      }
      
      // 检查是否有数据 (数据在 result 字段中)
      if (response.errorCode === '0' && response.result) {
        const kbList = Array.isArray(response.result) ? response.result : [];
        setState(prev => ({
          ...prev,
          knowledgeBases: kbList,
        }));
        return kbList;
      } else {
        // 成功但没有数据，返回空列表
        setState(prev => ({
          ...prev,
          knowledgeBases: [],
        }));
        return [];
      }
    } catch (error) {
      console.error('Knowledge base fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : '获取知识库列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client, apiKey]);

  // 上传文件
  const uploadFile = useCallback(async (request: UploadFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.uploadFile(request);
      if (response.errorCode === '0') {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.msg || '上传文件失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传文件失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 上传URL
  const uploadUrl = useCallback(async (request: UploadUrlRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.uploadUrl(request);
      if (response.errorCode === '0') {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.msg || '上传URL失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传URL失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除文件
  const deleteFiles = useCallback(async (request: DeleteFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteFiles(request);
      if (response.errorCode === '0') {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.msg || '删除文件失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除文件失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取文件列表
  const fetchFileList = useCallback(async (kbId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFileList(kbId);
      if (response.errorCode === '0' && response.result) {
        const fileList = Array.isArray(response.result) ? response.result : [];
        setState(prev => ({
          ...prev,
          documents: fileList,
        }));
        return fileList;
      } else {
        // 成功但没有数据，返回空列表
        setState(prev => ({
          ...prev,
          documents: [],
        }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取文件列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 更新知识库名称
  const updateKnowledgeBaseName = useCallback(async (request: UpdateKbNameRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.updateKnowledgeBaseName(request);
      if (response.errorCode === '0') {
        await fetchKnowledgeBaseList(); // 刷新列表
        return true;
      } else {
        throw new Error(response.msg || '更新知识库名称失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新知识库名称失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取FAQ列表
  const fetchFAQList = useCallback(async (kbId: string) => {
    console.log('fetchFAQList: 开始获取FAQ列表, kbId:', kbId);
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFAQList(kbId);
      console.log('fetchFAQList: API响应:', response);
      if (response.errorCode === '0') {
        const faqList = Array.isArray(response.result?.faqList) ? response.result.faqList : [];
        console.log('fetchFAQList: 成功获取FAQ列表, 数量:', faqList.length);
        setState(prev => ({
          ...prev,
          faqs: faqList,
        }));
        return faqList;
      } else if (response.errorCode === '303') {
        // 服务器错误，可能是知识库没有FAQ，返回空列表
        console.warn('FAQ列表API返回服务器错误，可能此知识库还没有FAQ');
        setState(prev => ({
          ...prev,
          faqs: [],
        }));
        return [];
      } else {
        throw new Error(response.msg || '获取FAQ列表失败');
      }
    } catch (error) {
      console.error('获取FAQ列表错误:', error);
      // 如果是500错误，可能是知识库没有FAQ，不显示错误，只显示空列表
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('FAQ API返回500错误，可能知识库没有FAQ，显示空列表');
        setState(prev => ({
          ...prev,
          faqs: [],
        }));
        return [];
      }
      const errorMessage = error instanceof Error ? error.message : '获取FAQ列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);


  // 创建FAQ
  const createFAQ = useCallback(async (request: CreateFAQRequest) => {
    console.log('开始创建FAQ:', request);
    setLoading(true);
    setError(null);
    try {
      const response = await client.createFAQ(request);
      console.log('创建FAQ响应:', response);
      if (response.errorCode === '0') {
        console.log('FAQ创建成功，开始刷新列表');
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        console.log('FAQ列表刷新完成');
        return true;
      } else {
        console.error('FAQ创建失败:', response);
        throw new Error(response.msg || '创建FAQ失败');
      }
    } catch (error) {
      console.error('创建FAQ过程中出错:', error);
      const errorMessage = error instanceof Error ? error.message : '创建FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client, fetchFAQList]);

  // 更新FAQ
  const updateFAQ = useCallback(async (request: UpdateFAQRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.updateFAQ(request);
      if (response.errorCode === '0') {
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        return true;
      } else {
        throw new Error(response.msg || '更新FAQ失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除FAQ
  const deleteFAQs = useCallback(async (request: DeleteFAQRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteFAQs(request);
      if (response.errorCode === '0') {
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        return true;
      } else {
        throw new Error(response.msg || '删除FAQ失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);


  // 获取FAQ详情
  const fetchFAQDetail = useCallback(async (request: GetFAQDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFAQDetail(request);
      if (response.errorCode === '0' && response.result) {
        return response.result;
      } else {
        throw new Error(response.msg || '获取FAQ详情失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取FAQ详情失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    // 状态
    ...state,
    
    // 知识库操作
    createKnowledgeBase,
    deleteKnowledgeBase,
    fetchKnowledgeBaseList,
    updateKnowledgeBaseName,
    
    // 文档操作
    uploadFile,
    uploadUrl,
    deleteFiles,
    fetchFileList,
    
    // FAQ操作
    createFAQ,
    updateFAQ,
    deleteFAQs,
    fetchFAQList,
    fetchFAQDetail,
  };
}