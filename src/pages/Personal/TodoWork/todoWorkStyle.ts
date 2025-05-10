import { createStyles } from 'antd-style';

export default function todoWorkStyle(todo) {
  let color = todo.status === 'DONE' ? '#63bd89' : '#6294a5';
  let contentColor = todo.status === 'DONE' ? '#92d1b4' : '#8bbbcc';
  let headRadius = todo.foldFlag === 'YES' ? '0' : '0 0 5px 5px';
  return createStyles(({ css }) => ({
    todoWrap: css`
      margin-top: 5px;
      width: calc(100% - 10px);
      margin-left: 5px;

      .ant-input-number-handler-wrap {
        display: none;
      }

      .ant-input-number-input {
        background-color: transparent;
      }
    `,
    operation: css`
      border-radius: 5px 5px 0 0;
      background-color: ${color};
    `,
    priority: css`
      height: 25px;
      width: 80px;
      border: none;

      .ant-input-number-group-addon {
        padding: 2px;
        border: none;
        color: #ffffff;
      }

      .ant-input-number {
        border: none;
      }

      .ant-input-number-input {
        border: none;
        border-radius: 0;
        color: #ffffff;
        font-weight: bold;
        background-color: ${color} !important;
      }
    `,
    icons: css`
      width: 25px;
      height: 25px;
      border: 3px;
      margin-left: 5px;
      color: #ffffff;
    `,
    title: css`
      width: 100%;
      height: 25px;
      color: white;
      background-color: ${color};
      opacity: 0.8;
      border: none;
      border-radius: ${headRadius};
      text-align: center;
      font-weight: bold;

      :hover {
        background-color: ${color};
      }

      :focus {
        background-color: ${color};
      }
    `,
    content: css`
      width: 100%;
      border-radius: 0 0 5px 5px;
      border: none;
      color: #ffffff;
      background-color: ${contentColor};
      // 支持滚动，但不显示滚动条
      overflow: auto;
      scrollbar-width: none;

      :hover {
        background-color: ${contentColor};
      }

      :focus {
        background-color: ${contentColor};
      }
    `,
    datePicker: css`
      width: 18px;
      height: 18px;
      margin-top: 4px;
      border: none;
      padding: 0;
      background-color: ${color};

      :hover {
        background-color: ${color};
        cursor: pointer;
      }

      :focus-within {
        background-color: ${color};
      }

      .anticon {
        svg {
          color: #ffffff;
        }
      }
    `,
  }))();
}
