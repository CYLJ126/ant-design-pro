import { MarkdownTableProcessor } from '@/pages/Tools/TextFormatter/MarkdownTableProcessor';
import ClipboardUtil from '@/utils/ClipboardUtil';
import { ListProcessor } from './listProcessor';
import { TextProcessor } from './textProcessor';
import type {
  CustomProperty,
  ListProperty,
  MarkdownTableProperty,
  TextPair,
} from './types';

/**
 * 剪贴板处理器
 */
export class ClipboardHandler {
  /**
   * 处理剪贴板内容
   */
  static async handleClipboard(
    customProp: CustomProperty,
    listProp: ListProperty,
    markdownTableProperty: MarkdownTableProperty,
    setTextPair: (textPair: TextPair) => void,
  ): Promise<void> {
    if (!window.isSecureContext) {
      console.warn('当前访问不满足"安全上下文"要求，请手动粘贴内容...');
      return;
    }

    try {
      const clipboardText = await ClipboardUtil.readText();

      if (customProp.handleList) {
        ListProcessor.handleCompleteListText(
          clipboardText,
          customProp,
          listProp,
          setTextPair,
        );
      } else if (customProp.handleMarkdownTable) {
        MarkdownTableProcessor.handleMarkdownTable(
          clipboardText,
          customProp,
          markdownTableProperty,
          setTextPair,
        );
      } else {
        TextProcessor.handleText(clipboardText, customProp, setTextPair);
      }
    } catch (error) {
      console.error('读取剪贴板失败:', error);
    }
  }

  /**
   * 检查是否应该处理剪贴板
   */
  static shouldHandleClipboard(): boolean {
    return localStorage.getItem('active-key') === '/Tools/TextFormatter';
  }
}
