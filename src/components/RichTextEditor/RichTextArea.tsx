import React from 'react';
import { useRichTextData } from './RichTextContext';
import { EditorContent, useEditor } from '@tiptap/react';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Youtube } from '@tiptap/extension-youtube';
import { Image } from '@tiptap/extension-image';
import FileHandler from '@tiptap/extension-file-handler';
import { Highlight } from '@tiptap/extension-highlight';
import { configureMathFormula, MathFormulaView } from './extensions/MathFormula';
import { configureMyHtmlTable } from './extensions/MyHtmlTable';
import styles from './RichTextArea.less';
import NestedReactContentNode from './extensions/NestedReactContentNode';
import MyCodeBlock from './extensions/CodeBlock';

function RichTextArea() {
  const { editAreaHeight, editorRef, rawText } = useRichTextData();

  const handleUpdate = ({ editor }: { editor: any }) => {
    console.log('文档JSON结构:', editor.getJSON());
  };

  const editor = useEditor({
    content: rawText,
    contentType: 'markdown',
    extensions: [
      Markdown,
      StarterKit.configure({
        codeBlock: false,
      }),
      configureMathFormula({
        enableClickEdit: true,
      }),
      MyCodeBlock,
      Details,
      DetailsSummary,
      DetailsContent,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        inline: false,
        width: 480,
        height: 320,
      }),
      ...configureMyHtmlTable(),
      Highlight,
      NestedReactContentNode,
      Image.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
          minWidth: 150,
          minHeight: 150,
        },
        HTMLAttributes: {
          class: 'tiptap-img',
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          console.log('拖动文件数量：', files?.length || 0);
          files.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          console.log('粘贴文件数量：', files?.length || 0);
          files.forEach((file) => {
            if (htmlContent) {
              console.log('htmlContent 内容：', htmlContent);
              return false;
            }
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    onUpdate: handleUpdate,
    onCreate: ({ editor }) => {
      // console.log('编辑器创建成功，支持的命令：', Object.keys(editor.commands));
      console.log('是否支持插入表格：', editor.can().insertTable());
    },
  });

  editorRef.current = editor;

  return (
    <div className={styles.richTextArea} style={{ height: editAreaHeight }}>
      {editor ? (
        <div className="tiptap-editor-content">
          <EditorContent editor={editor} />
          <MathFormulaView />
        </div>
      ) : (
        <div>正在加载编辑器……</div>
      )}
    </div>
  );
}

export default RichTextArea;
