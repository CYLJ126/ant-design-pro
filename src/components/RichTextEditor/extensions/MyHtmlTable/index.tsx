import { ReactNodeViewRenderer } from '@tiptap/react';
import { Table, TableCell, TableKit } from '@tiptap/extension-table';
import TableNodeView from './TableNodeView';

// 自定义 TableCell 扩展背景色属性
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-background-color'),
        renderHTML: (attributes) => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: attributes.backgroundColor
              ? `background-color: ${attributes.backgroundColor}`
              : '',
          };
        },
      },
    };
  },
});

// 自定义 Table 扩展，添加 NodeView
const CustomTable = Table.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableNodeView);
  },
});

// 导出扩展配置
export const configureMyHtmlTable = () => {
  return [
    TableKit.configure({
      table: false, // 禁用默认的 Table
      tableCell: false, // 禁用默认的 TableCell
    }),
    CustomTable.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'my-html-table',
      },
    }),
    CustomTableCell,
  ];
};

export { CustomTableCell, CustomTable };
