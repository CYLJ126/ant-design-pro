import { createStyles } from 'antd-style';

export default function activityStyle(status) {
  let frontColor, backColor;
  if (status === 'INITIAL') {
    frontColor = '#81d3f8';
    backColor = '#ffffff';
  } else {
    frontColor = '#63bd89';
    backColor = '#ffffff';
  }
  return createStyles(({ css }) => ({
    line: css`
      background-color: ${frontColor};
      height: 2px;
      border: none;
      margin: 12px 0 0 0;
    `,
    time: css`
      width: 70px;
      height: 25px;
      border: 1.5px solid ${frontColor};
      border-radius: 5px;
      background-color: ${frontColor};
      color: #ffffff;
      padding: 0;

      :hover {
        color: ${frontColor};
        border-color: ${frontColor};
      }

      .ant-picker-input {
        input {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          padding-left: 2px;
        }

        input::placeholder {
          position: relative;
          top: -2px;
          color: #ffffff;
          font-size: 14px;
        }

        input:hover::placeholder {
          color: ${frontColor};
        }

        .aria-invalid {
          color: ${frontColor};
        }

        .anticon {
          display: none;
        }
      }
    `,
    theme: css`
      width: 40px;
      padding: 0;
      margin-left: 5px;
      margin-bottom: 5px;
      font-weight: bold;
      text-align: center;
      font-size: 14px;
      background-color: ${frontColor};
      color: ${backColor};
      border: 1.5px solid ${frontColor};

      :hover {
        color: ${frontColor};
        background-color: ${backColor};
      }
    `,
    target: css`
      width: 100%-5px;
      height: 30px;
      border: 1.5px solid ${frontColor};
      color: ${frontColor};
      margin-left: 5px;
      font-size: 18px;

      :hover {
        color: ${frontColor};
      }
    `,
    number: css`
      margin-left: 5px;
      margin-bottom: 5px;

      .ant-input-number-input {
        padding-right: 1px;
        text-align: center;
      }

      .ant-input-number-group-addon {
        font-size: 12px;
        padding-left: 1px;
        padding-right: 1px;
      }

      .ant-input-number-handler {
        width: 7px;
        margin-left: 5px;
        border: none;

        svg {
          color: #ffffff;
        }
      }

      .ant-input-number {
        border: 1.5px solid ${frontColor};
      }

      .ant-input-number-input {
        color: ${frontColor};
      }

      .ant-input-number-group-addon {
        color: ${backColor};
        background-color: ${frontColor};
        border: 1.5px solid ${frontColor};
      }

      .ant-input-number-handler-wrap {
        background-color: ${frontColor};
      }
    `,
    work: css`
      width: 141px;
      margin-left: 5px;
      margin-bottom: 5px;
      background-color: ${frontColor};
      color: ${backColor};
      border: 1.5px solid ${frontColor};

      :hover {
        color: ${frontColor};
        background-color: ${backColor};
      }
    `,
    score: css`
      border: 1.5px solid ${frontColor};
      border-radius: 5px;
      width: 40px;
      height: 25px;
      padding: 0;
      margin-bottom: 5px;
      font-weight: bold;
      text-align: center;

      .ant-input-number-input {
        padding-left: 0;
      }

      .ant-input-number-handler-wrap {
        width: 16px !important;
        left: 22px !important;
        border: none;
      }

      :hover {
        border: 1.5px solid ${frontColor};
      }
    `,
    proportion: css`
      width: 52px;

      .ant-input-number-input {
        padding-left: 2px;
      }

      .ant-input-number-handler-wrap {
        width: 16px !important;
        left: 32px !important;
        border: none;
      }
    `,
    content: css`
      width: 100%-5px;
      height: 89.5px !important;
      color: ${frontColor};
      border: 1.5px solid ${frontColor};
      margin-left: 5px;
    `,
  }))();
}
