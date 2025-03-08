import { createStyles } from 'antd-style';

export default function todoWorkWrapStyle() {
  const arrowColor = '#ffffff';
  const backgroundColor = '#ccebf7';
  const headBackgroundColor = '#81d3f8';
  return createStyles(({ css }) => ({
    wrap: css`
      width: 95%;
      // 取视口高度的90%
      height: 90vh;
      background-color: ${backgroundColor};
      margin-left: 20px;
      border-radius: 10px;
      box-shadow: -3px 5px 7px #bdc4bd;
    `,
    headRow: css`
      height: 50px;
      background-color: ${headBackgroundColor};
      border-radius: 10px 10px 0 0;
    `,
    headDiv: css`
      width: 60%;
      margin-left: auto;
      margin-right: auto;
    `,
    forwardDay: css`
      svg {
        width: 25px;
        height: 25px;
        color: ${arrowColor};
      }
    `,
    date: css`
      margin-top: 8px !important;
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
          font-size: 18px;
          font-weight: bold;
          text-align: center;
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
    headPlus: css`
      position: absolute;
      top: 10px;
      // 显示在右侧
      right: 10px;

      svg {
        width: 27px;
        height: 27px;
        color: #81d3f8;
      }
    `,
  }))();
}
