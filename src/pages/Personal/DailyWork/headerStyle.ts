import { createStyles } from 'antd-style';

export default function headerStyle(headInfo) {
  let proportionColor;
  if (headInfo.proportion < 100) {
    proportionColor = '#81d3f8';
  } else if (headInfo.proportion > 100) {
    proportionColor = '#ff0000';
  } else {
    proportionColor = '#5bb1c9';
  }
  const headBackgroundColor = '#81d3f8';
  return createStyles(({ css }) => ({
    date: css`
      margin-top: 10px;
      height: 30px;
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
    dailyScore: css`
      width: 65px;
      height: 30px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      color: #81d3f8;
      border-radius: 5px;
      padding: 5px;
      margin-right: 8px;
      border: 1.5px solid #81d3f8;
      margin-top: 10px;
    `,
    proportion: css`
      width: 58px;
      height: 30px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
      padding: 5px;
      margin-right: 8px;
      margin-top: 10px;
      color: ${proportionColor};
      border: 1.5px solid ${proportionColor};
    `,
    itemCount: css`
      width: 95px;
      height: 30px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
      padding: 5px;
      margin-right: 8px;
      border: 1.5px solid;
      margin-top: 10px;
    `,
    completedItems: css`
      color: #5bb1c9;
      border-color: #5bb1c9;
    `,
    todoItems: css`
      color: #81d3f8;
      border-color: #81d3f8;
    `,
    refresh: css`
      svg {
        width: 25px;
        height: 25px;
        color: #81d3f8;
        margin-top: 9px;
        margin-left: 2px;
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
