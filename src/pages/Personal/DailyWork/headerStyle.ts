import { createStyles } from 'antd-style';

export default function headerStyle() {
  const headBackgroundColor = '#81d3f8';
  return createStyles(({ css }) => ({
    date: css`
      margin-top: 8px;
      height: 35px;
      width: 130px;
      border: none;
      background-color: ${headBackgroundColor};

      :hover {
        background-color: ${headBackgroundColor};
      }

      // focus 且鼠标不在输入框上时的样式
      :focus-within {
        background-color: ${headBackgroundColor};
      }

      .ant-picker-input {
        input {
          color: white;
          font-size: 19px;
          font-weight: bold;
          text-align: center;
          margin-left: 2px;
        }

        input:hover {
          color: white;
          background-color: ${headBackgroundColor};
          cursor: pointer;
        }
      }

      .anticon {
        display: none;
      }
    `,
    forwardWeek: css`
      svg {
        width: 30px;
        height: 30px;
        margin-top: 8px;
        color: #81d3f8;
      }
    `,
    fold: css`
      svg {
        width: 35px;
        height: 35px;
        transform: rotate(90deg);
        margin-top: 8px;
        color: #81d3f8;
        margin-left: 3px;
      }
    `,
    plusItem: css`
      svg {
        width: 30px;
        height: 30px;
        color: #81d3f8;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 7px;
      }
    `,
    toWeekly: css`
      svg {
        width: 30px;
        height: 30px;
        color: #81d3f8;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 7px;
      }
    `,
  }))();
}
