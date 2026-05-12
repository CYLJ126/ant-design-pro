import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, InputNumber, message, Modal, Space, Splitter, Tooltip } from 'antd';
import styles from './index.less';
import {
  FileAddOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  InsertRowBelowOutlined,
  LeftOutlined,
  MediumOutlined,
  RightOutlined,
  SaveOutlined,
  SendOutlined,
  SplitCellsOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { RichTextProvider, useRichTextData } from './RichTextContext';
import { EditorMode } from './RichTextType';
import RightSide from './RightSide';
import RichTextArea from './RichTextArea';
import RawTextArea from './RawTextArea';

interface RichTextEditorProps {
  editorHeight?: number;
  articleId?: number;
}

function EditorLayout({ editorHeight = 600, articleId = -12654 }: RichTextEditorProps) {
  const {
    setEditAreaHeight,
    initialArticle,
    editorMode,
    setEditorMode,
    sizes,
    setSizes,
    getMarkdownText,
    renderRichText,
    createArticle,
    saveArticle,
    editorRef,
  } = useRichTextData();

  // 工具条高度（包括间距等）
  const toolbarHeight = 48;

  // 表格弹窗相关状态
  const [modalOpen, setModalOpen] = useState(false);
  const [insertAction, setInsertAction] = useState<'table' | 'html-table' | null>(null);
  const [form] = Form.useForm();

  // 打开插入表格弹窗
  const handleOpenInsertModal = useCallback(
    (action: 'table' | 'html-table') => {
      setInsertAction(action);
      form.resetFields(); // 重置表单默认值
      setModalOpen(true);
    },
    [form],
  );

  // 确认插入表格
  const handleInsertConfirm = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const { rows, cols } = values;
        const editor = editorRef.current;
        if (!editor) {
          message.error('编辑器不可用').then();
          return;
        }

        if (insertAction === 'table') {
          editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
          message.success('插入表格成功').then();
        } else if (insertAction === 'html-table') {
          // 生成 HTML 表格，不使用 tbody 包装
          let html = '<table style="width:100%; border-collapse: collapse;">';

          for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
              if (r === 0) {
                // 第一行为表头
                html += '<th style="border: 1px solid #d9d9d9; padding: 8px 12px;">表头</th>';
              } else {
                // 其他行为数据行
                html += '<td style="border: 1px solid #d9d9d9; padding: 8px 12px;">&nbsp;</td>';
              }
            }
            html += '</tr>';
          }
          html += '</table>';

          try {
            editor
              .chain()
              .focus()
              .insertContent(html, {
                parseOptions: {
                  preserveWhitespace: false,
                },
              })
              .run();
            message.success('插入 HTML 表格成功').then();
          } catch (error) {
            message.error('插入HTML表格失败').then();
          }
        }
        setModalOpen(false);
      })
      .catch((error) => {
        console.error('表单验证失败:', error);
      });
  }, [form, insertAction, editorRef.current]);

  const toolbarButtons = useMemo(
    () => [
      {
        key: 'raw-text',
        label: '只显示左侧纯文本编辑器',
        mode: 'raw-text' as EditorMode,
        icon: <LeftOutlined />,
        onClick: () => setEditorMode('raw-text'),
      },
      {
        key: 'split',
        label: '左右同显',
        mode: 'split' as EditorMode,
        icon: <SplitCellsOutlined />,
        onClick: () => setEditorMode('split'),
      },
      {
        key: 'rich-text',
        label: '只显示右侧富文本编辑器',
        mode: 'rich-text' as EditorMode,
        icon: <RightOutlined />,
        onClick: () => setEditorMode('rich-text'),
      },
      {
        key: 'full-screen',
        label: sizes[0] < 100 ? '隐藏侧边栏' : '显示侧边栏',
        mode: 'none' as EditorMode,
        icon: sizes[0] < 100 ? <FullscreenOutlined /> : <FullscreenExitOutlined />,
        onClick: () => {
          setSizes(sizes[0] < 100 ? [100, 0] : [80, 20]);
        },
      },
      {
        key: 'insert-table',
        label: '插入表格',
        mode: 'none' as EditorMode,
        icon: <TableOutlined />,
        onClick: () => handleOpenInsertModal('table'),
      },
      {
        key: 'insert-html-table',
        label: '插入HTML表格',
        mode: 'none' as EditorMode,
        icon: <InsertRowBelowOutlined />,
        onClick: () => handleOpenInsertModal('html-table'),
      },
      {
        key: 'create-article',
        label: '创建文章',
        mode: 'none' as EditorMode,
        icon: <FileAddOutlined />,
        onClick: () => {
          createArticle('文章标题');
        },
      },
      {
        key: 'save-article',
        label: '保存文章内容',
        mode: 'none' as EditorMode,
        icon: <SaveOutlined />,
        onClick: () => {
          saveArticle();
        },
      },
      {
        key: 'markdown-text',
        label: '转换为 Markdown 纯文本',
        mode: 'none' as EditorMode,
        icon: <MediumOutlined />,
        onClick: () => {
          getMarkdownText();
        },
      },
      {
        key: 'rich-text-convert',
        label: '转换为富文本',
        mode: 'none' as EditorMode,
        icon: <SendOutlined />,
        onClick: () => {
          renderRichText();
        },
      },
    ],
    [
      sizes,
      setSizes,
      renderRichText,
      getMarkdownText,
      setEditorMode,
      handleOpenInsertModal,
      createArticle,
      saveArticle,
    ],
  );

  useEffect(() => {
    setEditAreaHeight(editorHeight - toolbarHeight);
  }, [editorHeight]);

  useEffect(() => {
    initialArticle(articleId);
  }, [initialArticle, articleId]);

  const leftArea = useMemo(() => <RawTextArea />, []);

  const rightArea = useMemo(() => <RichTextArea />, []);

  // 使用 useCallback 包装 renderEditorPanels 函数
  const renderEditorPanels = useCallback(() => {
    switch (editorMode) {
      case 'split':
        return (
          <Splitter className={styles.customSplitter}>
            <Splitter.Panel defaultSize="50%" min="20%">
              {leftArea}
            </Splitter.Panel>
            <Splitter.Panel min="20%">{rightArea}</Splitter.Panel>
          </Splitter>
        );
      case 'raw-text':
        return leftArea;
      case 'rich-text':
      default:
        return rightArea;
    }
  }, [editorMode, leftArea, rightArea]);

  return (
    <div className={styles.editorLayout} style={{ height: editorHeight }}>
      <Splitter className={styles.customSplitter} onResize={setSizes}>
        <Splitter.Panel collapsible size={sizes[0] + '%'} min="30%" max="90%">
          {/* 主内容区域 */}
          <div className={styles.mainContent}>
            {/* 工具条 */}
            <div className={styles.toolbar}>
              <Space.Compact>
                {toolbarButtons.map((button) => (
                  <Tooltip key={button.key} title={button.label}>
                    <Button
                      size="small"
                      icon={button.icon}
                      type={editorMode === button.mode ? 'primary' : 'default'}
                      className={`toolbar-button ${editorMode === button.mode ? 'active' : ''}`}
                      onClick={() => {
                        button.onClick();
                      }}
                    />
                  </Tooltip>
                ))}
              </Space.Compact>
            </div>
            {/* 编辑区域 */}
            <div className={styles.editorContainer}>{renderEditorPanels()}</div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel collapsible size={sizes[1] + '%'} min="10%" max="70%">
          {/* 侧边栏 */}
          <div className={styles.sidebar} style={{ height: editorHeight - 10 }}>
            <RightSide />
          </div>
        </Splitter.Panel>
      </Splitter>

      {/* 插入表格弹窗 */}
      <Modal
        title={insertAction === 'table' ? '插入表格' : '插入HTML表格'}
        open={modalOpen}
        onOk={handleInsertConfirm}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
        width={400}
      >
        <Form form={form} layout="vertical" initialValues={{ rows: 3, cols: 3 }}>
          <Form.Item label="行数" name="rows" rules={[{ required: true, message: '请输入行数' }]}>
            <InputNumber min={1} max={20} style={{ width: '100%' }} placeholder="请输入行数" />
          </Form.Item>
          <Form.Item label="列数" name="cols" rules={[{ required: true, message: '请输入列数' }]}>
            <InputNumber min={1} max={20} style={{ width: '100%' }} placeholder="请输入列数" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default function RichTextEditor({ articleId, editorHeight }: RichTextEditorProps) {
  return (
    <RichTextProvider>
      <EditorLayout editorHeight={editorHeight} articleId={articleId} />
    </RichTextProvider>
  );
}
