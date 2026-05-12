import { Editor } from '@tiptap/core';
import { Dayjs } from 'dayjs';
import { RefObject } from 'react';

// 编辑器显示模式
export type EditorMode = 'split' | 'raw-text' | 'rich-text' | 'none';

// useContext 属性
export interface RichTextContextType {
  editAreaHeight: number;
  setEditAreaHeight: (height: number) => void;
  editorRef: RefObject<Editor | null>;
  articleInfoRef: RefObject<ArticleInfoType | null>;
  rawText: string;
  setRawText: (rawText: string) => void;
  richText: string;
  setRichText: (richText: string) => void;
  editorMode: EditorMode | 'rich-text';
  setEditorMode: (editorMode: EditorMode) => void;
  sizes: number[];
  setSizes: (sizes: number[]) => void;
  getMarkdownText: () => void;
  renderRichText: () => void;
  createArticle: (title: string) => void;
  initialArticle: (id: number | undefined) => void;
  saveArticle: () => void;
}

// 文章属性，文章内容单独存储
export interface ArticleInfoType {
  id: number | undefined;
  title: string | undefined;
  author: string | undefined;
  summary: string | undefined;
  createTime: Dayjs | undefined;
  updateTime: Dayjs | undefined;
  createBy: string | undefined;
  updateBy: string | undefined;
}
