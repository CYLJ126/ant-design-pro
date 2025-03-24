import { createStyles } from 'antd-style';

export default function activityStyle(status, foldState) {
  const textAreaHeight = foldState === 'unfold' ? '114' : '55';
  let frontColor, backColor;
  if (status === 'DONE') {
    frontColor = '#6294a5';
    backColor = '#ffffff';
  } else {
    frontColor = '#81d3f8';
    backColor = '#ffffff';
  }
  return createStyles(({ css }) => ({
    theme: css`
      width: calc(100% - 5px);
      height: 24.5px;
      padding: 0;
      margin-left: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
      border: none;

      .ant-select-selector {
        border: none !important;
        background-color: ${frontColor} !important;
      }

      .ant-select-arrow {
        display: none;
      }

      .ant-select-selection-item {
        font-size: 16px;
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
      width: calc(100% - 5px);
      height: 25px;
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
    number: css`
      margin-left: 5px;
      margin-bottom: 5px;
      width: calc(100% - 5px);

      .ant-input-number-input {
        padding-right: 1px;
        text-align: center;
        padding-left: 2px;
        color: ${frontColor};
      }

      .ant-input-number-group-addon {
        font-size: 12px;
        padding-left: 1px;
        padding-right: 1px;
        color: ${backColor};
        background-color: ${frontColor};
        border: 1.5px solid ${frontColor};
      }

      .ant-input-number {
        border: 1.5px solid ${frontColor};
      }

      .ant-input-number-handler-wrap {
        width: 16px !important;
        left: 30px !important;
        border: none;
      }
    `,
    content: css`
      width: 100%-5px;
      height: ${textAreaHeight} !important;
      color: ${frontColor};
      border: 1.5px solid ${frontColor};
      margin-left: 5px;
      // 支持滚动，但不显示滚动条
      overflow: auto;
      scrollbar-width: none;
    `,
    separator: css`
      width: 100%;
      height: 2px;
      background-color: ${frontColor};
      border: none;
    `,
    foldIcon: css`
      svg {
        margin-top: 2px;
        margin-left: 5px;
        margin-bottom: 4px;
        width: 22px;
        height: 22px;
        color: ${frontColor};
      }

      :hover {
        cursor: pointer;
      }
    `,
    unFoldIcon: css`
      margin-left: 5px;

      svg {
        margin-bottom: 4px;
        width: 22px;
        height: 22px;
        color: ${frontColor};
      }

      :hover {
        cursor: pointer;
      }
    `,
    todoIcon: css`
      :hover {
        cursor: pointer;
      }
      svg {
        width: 22px;
        height: 22px;
        color: ${frontColor};
      }
    `,
    summaryIcon: css`
      :hover {
        cursor: pointer;
      }

      svg {
        margin-top: 8px;
        margin-left: 2px;
        margin-bottom: 4px;
        width: 22px;
        height: 22px;
        color: ${frontColor};
      }
    `,
  }))();
}
