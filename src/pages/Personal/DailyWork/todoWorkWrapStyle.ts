import { createStyles } from 'antd-style';

export default function todoWorkWrapStyle() {
  return createStyles(({ css }) => ({
    wrap: css`
      width: 95%;
      // 取视口高度的90%
      height: 90vh;
      background-color: #e9ddf5;
      margin-left: 20px;
      border-radius: 10px;
      box-shadow: -3px 5px 7px #bdc4bd;
    `,
    headRow: css`
      height: 50px;
      background-color: #e2ccf7;
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
        color: #d1abbb;
      }
    `,
    date: css`
      margin-top: 6px !important;
      height: 35px;
      width: 130px;
      border: none;
      background-color: #e2ccf7;

      :hover {
        background-color: #e2ccf7;
      }

      // focus 且鼠标不在输入框上时的样式
      :focus-within {
        background-color: #e2ccf7;
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
          background-color: #e2ccf7;
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
