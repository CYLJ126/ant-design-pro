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
      width: calc(100% - 5px);
      height: 55px;
      padding: 0;
      margin-left: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
      border: none;

      .ant-select-selector {
        border: none;
        background-color: ${frontColor} !important;
      }

      .ant-select-arrow {
        display: none;
      }

      .ant-select-selection-item {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        padding: 0 !important;
        color: ${backColor};
      }
    `,
    work: css`
      width: calc(100% - 5px);
      margin-left: 5px;
      margin-bottom: 5px;
      border-radius: 5px;

      .ant-select-selector {
        border: 1.5px solid ${frontColor} !important;
        background-color: ${backColor} !important;
      }

      .ant-select-arrow {
        display: none;
      }

      .ant-select-selection-item {
        text-align: center;
        font-size: 14px;
        padding: 0 !important;
        color: ${frontColor};
      }
    `,
    target: css`
      width: 100%-5px;
      height: 25px;
      border: 1.5px solid ${frontColor};
      color: ${frontColor};
      margin-left: 5px;
      font-size: 16px;

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
    score: css`
      border: 1.5px solid ${frontColor};
      border-radius: 5px;
      width: calc(100% - 5px);
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
        left: 30px !important;
        border: none;
      }

      :hover {
        border: 1.5px solid ${frontColor};
      }
    `,
    proportion: css`
      width: calc(100% - 5px);

      .ant-input-number-input {
        padding-left: 2px;
      }

      .ant-input-number-handler-wrap {
        width: 16px !important;
        left: 30px !important;
        border: none;
      }
    `,
    content: css`
      width: 100%-5px;
      height: 114px !important;
      color: ${frontColor};
      border: 1.5px solid ${frontColor};
      margin-left: 5px;
    `,
    separator: css`
      width: 100%;
      height: 2px;
      background-color: ${frontColor};
      border: none;
    `,
  }))();
}
