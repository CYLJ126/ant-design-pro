import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, message, Space } from 'antd';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  BgColorsOutlined,
  DeleteOutlined,
  MergeCellsOutlined,
  SettingOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  tableWrapper: {
    position: 'relative',
    margin: '16px 0',
    borderRadius: token.borderRadius,
    transition: 'all 0.2s ease-in-out',

    // 每个表格包装器独立的悬浮效果
    '&:hover': {
      boxShadow: `0 0 0 1px ${token.colorPrimary}20`,

      // 直接作用于当前包装器内的工具栏
      '& .table-toolbar': {
        opacity: 1,
        visibility: 'visible',
        transform: 'translateX(-50%) translateY(0)',
      },
    },

    '&:focus-within .table-toolbar, &.table-focused .table-toolbar': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(-50%) translateY(0)',
    },
  },

  tableToolbar: {
    position: 'absolute',
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 12px',
    background: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease-in-out',
    zIndex: 1000,
    whiteSpace: 'nowrap',
    border: `1px solid ${token.colorBorderSecondary}`,

    '&:before': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: `6px solid ${token.colorBgElevated}`,
    },
  },

  // 强制显示工具栏的类
  showToolbar: {
    '& .table-toolbar': {
      opacity: '1 !important',
      visibility: 'visible !important',
      transform: 'translateX(-50%) translateY(0) !important',
    },
  },

  tableContent: {
    '& table': {
      borderCollapse: 'collapse',
      margin: 0,
      overflow: 'hidden',
      tableLayout: 'fixed',
      width: '100%',
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadius,
      cursor: 'text',
    },
    '& td, & th': {
      border: `1px solid ${token.colorBorder}`,
      boxSizing: 'border-box',
      minWidth: '1em',
      padding: '8px 12px',
      position: 'relative',
      verticalAlign: 'top',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: token.colorFillTertiary,
      },
      '& > *': {
        marginBottom: 0,
      },
    },
    '& th': {
      backgroundColor: token.colorFillSecondary,
      fontWeight: 600,
      textAlign: 'left',
      color: token.colorTextHeading,
    },
    '& .selectedCell:after': {
      background: token.controlItemBgActive,
      content: '""',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: 2,
    },
    '& .column-resize-handle': {
      backgroundColor: token.colorPrimary,
      bottom: '-2px',
      pointerEvents: 'none',
      position: 'absolute',
      right: '-2px',
      top: 0,
      width: '4px',
      borderRadius: '2px',
    },
  },
}));

interface TableNodeViewProps {
  node: any;
  editor: any;
  getPos: () => number;
  selected?: boolean;
}

const TableNodeView: React.FC<TableNodeViewProps> = ({ node, editor, getPos, selected }) => {
  const { styles } = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [isInThisTable, setIsInThisTable] = useState(false);
  const [forceShowToolbar, setForceShowToolbar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 生成唯一ID
  const tableId = useRef(`table-${Math.random().toString(36).substr(2, 9)}`);

  // 检查当前选择是否在这个表格内
  const checkIfInThisTable = useCallback(() => {
    if (!editor) return false;

    const { selection } = editor.state;
    const { from, to } = selection;
    const tablePos = getPos();
    const tableEnd = tablePos + node.nodeSize;

    // 检查选择是否在当前表格范围内
    return (from >= tablePos && from < tableEnd) || (to >= tablePos && to < tableEnd);
  }, [editor, getPos, node]);

  // 监听编辑器选择变化
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const inThisTable = checkIfInThisTable();
      setIsInThisTable(inThisTable);
      setIsFocused(inThisTable || selected || false);

      // 如果光标在当前表格内，强制显示工具栏
      if (inThisTable) {
        setForceShowToolbar(true);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('focus', handleSelectionUpdate);
    handleSelectionUpdate();

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('focus', handleSelectionUpdate);
    };
  }, [editor, selected, checkIfInThisTable]);

  // 监听全局 mousedown，处理点击外部区域时隐藏工具栏
  useEffect(() => {
    const handleDocumentMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;

      // 点击目标不在当前表格视图内
      if (!wrapperRef.current.contains(e.target as Node)) {
        // 延迟，等待编辑器选区更新
        setTimeout(() => {
          if (!checkIfInThisTable()) {
            setForceShowToolbar(false);
          }
        }, 100);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [checkIfInThisTable]);

  const handleMouseEnter = useCallback(() => {
    console.log(`鼠标进入表格 ${tableId.current}`);
    setIsFocused(true);
    setForceShowToolbar(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log(`鼠标离开表格 ${tableId.current}`);
    setTimeout(() => {
      // 检查鼠标是否还在当前表格区域
      if (!wrapperRef.current?.matches(':hover')) {
        const inThisTable = checkIfInThisTable();
        if (!inThisTable) {
          setIsFocused(false);
          setForceShowToolbar(false);
        }
      }
    }, 100);
  }, [checkIfInThisTable]);

  const handleTableClick = useCallback((e: React.MouseEvent) => {
    console.log(`点击表格 ${tableId.current}`);
    e.stopPropagation();
    setIsFocused(true);
    setForceShowToolbar(true);
  }, []);

  // 防止工具栏点击时失去焦点
  const handleToolbarMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // 工具栏鼠标事件
  const handleToolbarMouseEnter = useCallback(() => {
    setForceShowToolbar(true);
  }, []);

  const handleToolbarMouseLeave = useCallback(() => {
    // 延迟检查，给用户时间移动到其他按钮
    setTimeout(() => {
      if (!wrapperRef.current?.matches(':hover')) {
        const inThisTable = checkIfInThisTable();
        if (!inThisTable) {
          setForceShowToolbar(false);
        }
      }
    }, 200);
  }, [checkIfInThisTable]);

  // 表格操作函数
  const tableActions = {
    addColumnBefore: () => {
      console.log(`表格 ${tableId.current} - 添加列（前）`);
      if (editor.can().addColumnBefore()) {
        editor.chain().addColumnBefore().run();
        message.success('已在前面插入一列');
      } else {
        message.warning('无法在前面插入列，请先点击表格中的单元格');
      }
    },

    addColumnAfter: () => {
      console.log(`表格 ${tableId.current} - 添加列（后）`);
      if (editor.can().addColumnAfter()) {
        editor.chain().addColumnAfter().run();
        message.success('已在后面插入一列');
      } else {
        message.warning('无法在后面插入列，请先点击表格中的单元格');
      }
    },

    deleteColumn: () => {
      console.log(`表格 ${tableId.current} - 删除列`);
      if (editor.can().deleteColumn()) {
        editor.chain().deleteColumn().run();
        message.success('已删除当前列');
      } else {
        message.warning('无法删除列，请先点击表格中的单元格');
      }
    },

    addRowBefore: () => {
      console.log(`表格 ${tableId.current} - 添加行（上）`);
      if (editor.can().addRowBefore()) {
        editor.chain().addRowBefore().run();
        message.success('已在上方插入一行');
      } else {
        message.warning('无法在上方插入行，请先点击表格中的单元格');
      }
    },

    addRowAfter: () => {
      console.log(`表格 ${tableId.current} - 添加行（下）`);
      if (editor.can().addRowAfter()) {
        editor.chain().addRowAfter().run();
        message.success('已在下方插入一行');
      } else {
        message.warning('无法在下方插入行，请先点击表格中的单元格');
      }
    },

    deleteRow: () => {
      console.log(`表格 ${tableId.current} - 删除行`);
      if (editor.can().deleteRow()) {
        editor.chain().deleteRow().run();
        message.success('已删除当前行');
      } else {
        message.warning('无法删除行，请先点击表格中的单元格');
      }
    },

    deleteTable: () => {
      console.log(`表格 ${tableId.current} - 删除表格`);
      if (editor.can().deleteTable()) {
        editor.chain().deleteTable().run();
        message.success('已删除表格');
      } else {
        message.warning('无法删除表格');
      }
    },

    mergeCells: () => {
      console.log(`表格 ${tableId.current} - 合并单元格`);
      if (editor.can().mergeCells()) {
        editor.chain().mergeCells().run();
        message.success('已合并单元格');
      } else {
        message.warning('请先拖拽选择多个相邻的单元格');
      }
    },

    splitCell: () => {
      console.log(`表格 ${tableId.current} - 拆分单元格`);
      if (editor.can().splitCell()) {
        editor.chain().splitCell().run();
        message.success('已拆分单元格');
      } else {
        message.warning('当前单元格无法拆分');
      }
    },

    setCellBackground: (color: string) => {
      console.log(`表格 ${tableId.current} - 设置背景色:`, color);
      if (editor.can().setCellAttribute('backgroundColor', color)) {
        editor.chain().setCellAttribute('backgroundColor', color).run();
        message.success(color ? '已设置背景色' : '已清除背景色');
      } else {
        message.warning('请先选择单元格');
      }
    },

    toggleHeaderRow: () => {
      console.log(`表格 ${tableId.current} - 切换表头行`);
      if (editor.can().toggleHeaderRow()) {
        editor.chain().toggleHeaderRow().run();
        message.success('已切换表头行');
      } else {
        message.warning('无法切换表头行');
      }
    },

    toggleHeaderColumn: () => {
      console.log(`表格 ${tableId.current} - 切换表头列`);
      if (editor.can().toggleHeaderColumn()) {
        editor.chain().toggleHeaderColumn().run();
        message.success('已切换表头列');
      } else {
        message.warning('无法切换表头列');
      }
    },

    fixTables: () => {
      console.log(`表格 ${tableId.current} - 修复表格`);
      if (editor.can().fixTables()) {
        editor.chain().fixTables().run();
        message.success('表格已修复');
      } else {
        message.warning('表格无需修复');
      }
    },
  };

  // 菜单项配置
  const columnMenuItems: MenuProps['items'] = [
    {
      key: 'add-column-before',
      label: '在左侧插入列',
      icon: <ArrowLeftOutlined />,
      onClick: tableActions.addColumnBefore,
      disabled: !isInThisTable,
    },
    {
      key: 'add-column-after',
      label: '在右侧插入列',
      icon: <ArrowRightOutlined />,
      onClick: tableActions.addColumnAfter,
      disabled: !isInThisTable,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete-column',
      label: '删除当前列',
      icon: <DeleteOutlined />,
      onClick: tableActions.deleteColumn,
      disabled: !isInThisTable,
      danger: true,
    },
  ];

  const rowMenuItems: MenuProps['items'] = [
    {
      key: 'add-row-before',
      label: '在上方插入行',
      icon: <ArrowUpOutlined />,
      onClick: tableActions.addRowBefore,
      disabled: !isInThisTable,
    },
    {
      key: 'add-row-after',
      label: '在下方插入行',
      icon: <ArrowDownOutlined />,
      onClick: tableActions.addRowAfter,
      disabled: !isInThisTable,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete-row',
      label: '删除当前行',
      icon: <DeleteOutlined />,
      onClick: tableActions.deleteRow,
      disabled: !isInThisTable,
      danger: true,
    },
  ];

  const cellMenuItems: MenuProps['items'] = [
    {
      key: 'merge-cells',
      label: '合并单元格',
      icon: <MergeCellsOutlined />,
      onClick: tableActions.mergeCells,
      disabled: !isInThisTable,
    },
    {
      key: 'split-cell',
      label: '拆分单元格',
      icon: <SplitCellsOutlined />,
      onClick: tableActions.splitCell,
      disabled: !isInThisTable,
    },
  ];

  const backgroundMenuItems: MenuProps['items'] = [
    {
      key: 'bg-yellow',
      label: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#FAF594',
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          ></span>
          黄色高亮
        </span>
      ),
      onClick: () => tableActions.setCellBackground('#FAF594'),
      disabled: !isInThisTable,
    },
    {
      key: 'bg-green',
      label: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#D4F5D4',
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          ></span>
          绿色高亮
        </span>
      ),
      onClick: () => tableActions.setCellBackground('#D4F5D4'),
      disabled: !isInThisTable,
    },
    {
      key: 'bg-blue',
      label: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#D4E5F7',
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          ></span>
          蓝色高亮
        </span>
      ),
      onClick: () => tableActions.setCellBackground('#D4E5F7'),
      disabled: !isInThisTable,
    },
    {
      key: 'bg-red',
      label: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#FFE6E6',
              marginRight: 8,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          ></span>
          红色高亮
        </span>
      ),
      onClick: () => tableActions.setCellBackground('#FFE6E6'),
      disabled: !isInThisTable,
    },
    {
      type: 'divider',
    },
    {
      key: 'bg-clear',
      label: '清除背景色',
      onClick: () => tableActions.setCellBackground(''),
      disabled: !isInThisTable,
    },
  ];

  const settingsMenuItems: MenuProps['items'] = [
    {
      key: 'toggle-header-row',
      label: '切换表头行',
      onClick: tableActions.toggleHeaderRow,
      disabled: !isInThisTable,
    },
    {
      key: 'toggle-header-column',
      label: '切换表头列',
      onClick: tableActions.toggleHeaderColumn,
      disabled: !isInThisTable,
    },
    {
      key: 'fix-tables',
      label: '修复表格结构',
      onClick: tableActions.fixTables,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete-table',
      label: '删除整个表格',
      icon: <DeleteOutlined />,
      onClick: tableActions.deleteTable,
      disabled: !isInThisTable,
      danger: true,
    },
  ];

  // 组合类名
  const wrapperClassName = [
    styles.tableWrapper,
    isFocused ? 'table-focused' : '',
    forceShowToolbar ? styles.showToolbar : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={wrapperClassName}
      data-table-id={tableId.current}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTableClick}
    >
      {/* 工具栏 */}
      <div
        className={`${styles.tableToolbar} table-toolbar`}
        onMouseDown={handleToolbarMouseDown}
        onMouseEnter={handleToolbarMouseEnter}
        onMouseLeave={handleToolbarMouseLeave}
      >
        <Space.Compact size="small">
          <Dropdown menu={{ items: columnMenuItems }} placement="bottom" trigger={['click']}>
            <Button size="small" type={isInThisTable ? 'primary' : 'text'} ghost={isInThisTable}>
              列操作
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: rowMenuItems }} placement="bottom" trigger={['click']}>
            <Button size="small" type={isInThisTable ? 'primary' : 'text'} ghost={isInThisTable}>
              行操作
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: cellMenuItems }} placement="bottom" trigger={['click']}>
            <Button
              size="small"
              type={isInThisTable ? 'primary' : 'text'}
              ghost={isInThisTable}
              icon={<MergeCellsOutlined />}
            >
              单元格
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: backgroundMenuItems }} placement="bottom" trigger={['click']}>
            <Button
              size="small"
              type={isInThisTable ? 'primary' : 'text'}
              ghost={isInThisTable}
              icon={<BgColorsOutlined />}
            >
              背景色
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: settingsMenuItems }} placement="bottom" trigger={['click']}>
            <Button
              size="small"
              type={isInThisTable ? 'primary' : 'text'}
              ghost={isInThisTable}
              icon={<SettingOutlined />}
            >
              更多设置
            </Button>
          </Dropdown>
        </Space.Compact>
      </div>

      {/* 表格内容 */}
      <div className={styles.tableContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

export default TableNodeView;
