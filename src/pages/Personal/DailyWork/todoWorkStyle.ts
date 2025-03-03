import { createStyles } from 'antd-style';

export default function todoWorkStyle(status) {
  let color = status === 'DONE' ? '#63bd89' : '#81d3f8';
  let backgroundColor = status === 'DONE' ? '#63bd89' : '#b5d8f7';
  return createStyles(({ css }) => ({
    todoWrap: css`
      // background-color: ${backgroundColor};
      margin-bottom: 5px;
      width: 90%;
      margin-left: 5%;

      .ant-input-number-handler-wrap {
        display: none;
      }

      .ant-input-number-input {
        background-color: transparent;
      }
    `,
    priority: css`
      height: 25px;
      width: 80px;
      border: none;

      .ant-input-number-group-addon {
        padding: 2px;
      }
    `,
    icons: css`
      width: 25px;
      height: 25px;
      border: 3px;
      margin-left: 5px;
      color: ${color};
    `,
    title: css`
      width: 100%;
      height: 25px;
      color: white;
      background-color: ${color};
      border: none;
      border-radius: 0;

      :hover {
        background-color: ${color};
      }
    `,
    content: css`
      width: 100%;
      border-radius: 0;
      border: none;
      color: white;
      background-color: #b5d8f7;

      :hover {
        background-color: #b5d8f7;
      }
    `,
  }))();
}
