import { createStyles } from 'antd-style';

export default function todoWorkStyle(status) {
  let color = status === 'DONE' ? '#63bd89' : '#81d3f8';
  return createStyles(({ css }) => ({
    todoWrap: css`
      margin-top: 5px;
      width: 90%;
      margin-left: 5%;

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
      opacity: 0.75;
      border: none;
      border-radius: 0;
      text-align: center;
      font-weight: bold;

      :hover {
        background-color: ${color};
      }
    `,
    content: css`
      width: 100%;
      height: 75px !important;
      border-radius: 0 0 5px 5px;
      border: none;
      color: #ffffff;
      background-color: ${color};
      opacity: 0.5;

      :hover {
        background-color: #b5d8f7;
      }
    `,
  }))();
}
