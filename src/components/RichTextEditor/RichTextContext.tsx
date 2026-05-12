import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor } from '@tiptap/core';
import { ArticleInfoType, EditorMode, RichTextContextType } from './RichTextType';
import { addArticle, getArticleById, updateArticle } from '@/services/ant-design-pro/richText';

const RichTextContext = createContext<RichTextContextType | undefined>(undefined);

export function RichTextProvider({ children }: { children: ReactNode }) {
  // 编辑区域高度
  const [editAreaHeight, setEditAreaHeight] = useState(500);
  // 编辑器实例
  const editorRef = useRef<Editor>(null);
  // 原始文本内容
  const [rawText, setRawText] = useState('');
  // 富文本文本内容
  const [richText, setRichText] = useState('');
  // 编辑器显示模式
  const [editorMode, setEditorMode] = useState<EditorMode>('split');
  // 编辑区域与侧边栏比例
  const [sizes, setSizes] = useState<number[]>([80, 20]);
  // 文章属性
  const articleInfoRef = useRef<ArticleInfoType>(null);

  // 转换为 Markdown 纯文本
  const getMarkdownText = useCallback(() => {
    if (!editorRef.current) {
      return setRawText('编辑器实例不存在，无法转换');
    }
    try {
      setRawText(editorRef.current.getMarkdown());
    } catch (e) {
      console.error(e);
      setRawText('转换异常：\n' + JSON.stringify(e));
    } finally {
      setEditorMode('split');
    }
  }, []);

  // 转换为富文本
  const renderRichText = useCallback(() => {
    if (!editorRef.current || !editorRef.current.markdown) {
      return setRichText('编辑器实例不存在，或不为 markdown 实例，无法转换');
    }
    try {
      editorRef.current.commands.setContent(rawText, { contentType: 'markdown' });
    } catch (e) {
      console.error(e);
      setRichText('# 转换异常：\n' + JSON.stringify(e));
    } finally {
      setEditorMode('split');
    }
  }, [rawText]);

  // 创建新文章
  const createArticle = useCallback(async (title: string) => {
    try {
      const tempArticle = { title };
      const result = await addArticle(tempArticle);
      console.log(`文章已创建，ID: ${result.id}`);
      articleInfoRef.current = result;
    } catch (e) {
      console.error('创建文章失败:', e);
    }
  }, []);

  // 获取文章信息
  const initialArticle = useCallback(async (id: number) => {
    if (!id) {
      console.log('文章 ID 不存在，无法获取文章信息');
      return;
    }
    const article = await getArticleById(id);
    articleInfoRef.current = {
      id: article.id,
      author: article.author,
      title: article.title,
      summary: article.summary,
    } as ArticleInfoType;
    editorRef.current?.commands.setContent(JSON.parse(article.contentJson));
    setRawText(editorRef.current?.getMarkdown() || '');
  }, []);

  // 保存到 localStorage
  const saveToLocalStorage = useCallback(() => {
    // 如果是新文章或临时文章还没有保存到后端，则用 -12654 作为 ID
    const articleId = articleInfoRef.current?.id || -12654;
    try {
      const articleData = {
        ...articleInfoRef.current,
        updateTime: new Date().toISOString(),
      };
      localStorage.setItem(`richText-${articleId}`, JSON.stringify(articleData));
      localStorage.setItem('richText-tiptap-json', JSON.stringify(editorRef.current?.getJSON()));
      localStorage.setItem('richText-tiptap-raw', JSON.stringify(editorRef.current?.getText()));
      console.log(`文章已保存到 localStorage: richText-${articleId}`);
    } catch (e) {
      console.error('保存到 localStorage 失败:', e);
    }
  }, []);

  // 保存到后端
  const saveToBackend = useCallback(async () => {
    if (!articleInfoRef.current?.id) {
      console.warn('文章 ID 不存在，无法保存到后端');
      return;
    }
    try {
      const articleData = {
        ...articleInfoRef.current,
        contentJson: JSON.stringify(editorRef.current?.getJSON()), // TODO 前端序列化后端反序列化，考虑下是否有更合适的方式
        contentText: rawText,
      };
      await updateArticle(articleData);
      console.log(`文章已保存到后端，ID: ${articleInfoRef.current.id}`);
    } catch (e) {
      console.error('保存到后端失败:', e);
    }
  }, [rawText]);

  // 保存文章内容（手动触发）
  const saveArticle = useCallback(async () => {
    saveToLocalStorage();
    await saveToBackend();
  }, [saveToLocalStorage, saveToBackend]);

  const value = useMemo(() => {
    return {
      editAreaHeight,
      setEditAreaHeight,
      editorRef,
      articleInfoRef,
      rawText,
      setRawText,
      richText,
      setRichText,
      editorMode,
      setEditorMode,
      sizes,
      setSizes,
      getMarkdownText,
      renderRichText,
      createArticle,
      initialArticle,
      saveArticle,
    };
  }, [
    editAreaHeight,
    setEditAreaHeight,
    rawText,
    richText,
    sizes,
    getMarkdownText,
    renderRichText,
    createArticle,
    initialArticle,
    saveArticle,
    editorMode,
  ]);

  // 自动保存定时器
  useEffect(() => {
    // 每30秒保存到 localStorage
    const localStorageTimer = setInterval(() => {
      saveToLocalStorage();
    }, 30 * 1000);

    // 每5分钟保存到后端
    const backendTimer = setInterval(
      () => {
        saveToBackend().then();
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(localStorageTimer);
      clearInterval(backendTimer);
    };
  }, [saveToLocalStorage, saveToBackend]);

  return <RichTextContext.Provider value={value}>{children}</RichTextContext.Provider>;
}

// 自定义 hook 方便使用
export function useRichTextData() {
  const context = useContext(RichTextContext);
  if (!context) {
    throw new Error('useRichTextData must be used within a RichTextProvider');
  }
  return context;
}
