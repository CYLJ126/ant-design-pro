import { Mathematics } from '@tiptap/extension-mathematics';
import 'katex/dist/katex.min.css';
import './MathFormula.less';
import modalBridge, { type MathFormulaType } from './modalBridge';

export interface MathFormulaOptions {
  /**
   * 是否启用点击编辑功能
   * @default true
   */
  enableClickEdit?: boolean;
}

// 保存当前编辑器实例，供点击回调使用
let currentEditor: any = null;

/**
 * 数学公式扩展
 * 基于 @tiptap/extension-mathematics 封装，提供更好的用户体验
 */
export const MathFormula = Mathematics.extend<MathFormulaOptions>({
  name: 'mathFormula',

  addOptions() {
    return {
      ...this.parent?.(),
      enableClickEdit: true,
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      /**
       * 插入内联数学公式
       */
      insertInlineMathFormula:
        (attrs?: { latex?: string }) =>
        ({ commands, state }) => {
          const { latex } = attrs || {};

          // 直接传入 latex → 立即插入
          if (latex) {
            return commands.insertInlineMath({ latex });
          }

          // 有文本选区 → 将选区包裹为内联公式
          if (!state.selection.empty) {
            return commands.setInlineMath();
          }

          // 无 latex、无选区 → 通过 bridge 打开弹窗
          if (modalBridge.handler) {
            modalBridge.handler.openModal('inline', '', (newLatex) => {
              if (newLatex && currentEditor) {
                currentEditor.chain().focus().insertInlineMath({ latex: newLatex }).run();
              }
            });
            return true;
          }

          return false;
        },

      /**
       * 插入块级数学公式
       */
      insertBlockMathFormula:
        (attrs?: { latex?: string }) =>
        ({ commands, state }) => {
          console.log('[MathFormula] insertBlockMathFormula 触发');
          console.log('[MathFormula] modalBridge.handler =', modalBridge.handler);
          const { latex } = attrs || {};

          if (latex) {
            return commands.insertBlockMath({ latex });
          }

          if (!state.selection.empty) {
            return commands.setBlockMath();
          }

          // 通过 bridge 打开弹窗
          if (modalBridge.handler) {
            console.log('[MathFormula] 调用 openModal');
            modalBridge.handler.openModal('block', '', (newLatex) => {
              if (newLatex && currentEditor) {
                currentEditor.chain().focus().insertBlockMath({ latex: newLatex }).run();
              }
            });
            return true;
          }
          console.warn('[MathFormula] handler 为 null，无法打开弹窗');
          return false;
        },

      /**
       * 删除内联数学公式
       */
      removeInlineMathFormula:
        () =>
        ({ commands }) =>
          commands.deleteInlineMath(),

      /**
       * 删除块级数学公式
       */
      removeBlockMathFormula:
        () =>
        ({ commands }) =>
          commands.deleteBlockMath(),
    };
  },

  onCreate() {
    this.parent?.();
    // 存储编辑器实例
    currentEditor = this.editor;
  },

  onDestroy() {
    this.parent?.();
    // 清理编辑器实例
    currentEditor = null;
  },
  // 快捷键设置
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-m': () => this.editor.commands.insertInlineMathFormula(),
      'Mod-Shift-m': () => this.editor.commands.insertBlockMathFormula(),
    };
  },
} as any);

// 配置方法，用于自定义配置
export const configureMathFormula = (options: MathFormulaOptions = {}) => {
  /**
   * 点击已有公式时，通过 bridge 打开弹窗编辑
   */
  const handleClickEdit = (node: any, pos: number, type: MathFormulaType) => {
    if (!options.enableClickEdit || !currentEditor) return;
    if (!modalBridge.handler) return;

    modalBridge.handler.openModal(type, node.attrs.latex ?? '', (newLatex) => {
      try {
        const updateCmd = type === 'block' ? 'updateBlockMath' : 'updateInlineMath';
        currentEditor.chain().focus().setNodeSelection(pos)[updateCmd]({ latex: newLatex }).run();
      } catch (error) {
        console.error(`Failed to update ${type} math:`, error);
      }
    });
  };

  return MathFormula.configure({
    enableClickEdit: options.enableClickEdit ?? true,
    blockOptions: {
      onClick: (node: any, pos: number) => handleClickEdit(node, pos, 'block'),
    },
    inlineOptions: {
      onClick: (node: any, pos: number) => handleClickEdit(node, pos, 'inline'),
    },
  } as any);
};

export { default as MathFormulaModal } from './MathFormulaModal';
export type { MathFormulaModalProps, MathFormulaType } from './MathFormulaModal';
export { default as MathFormulaView } from './MathFormulaView';
export default MathFormula;
