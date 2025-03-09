import { createStyles } from 'antd-style';

export default function headerButtonsStyle(weekInfo) {
  let proportionColor;
  if (weekInfo.proportion < 100) {
    proportionColor = '#81d3f8';
  } else if (weekInfo.proportion > 100) {
    proportionColor = '#ff0000';
  } else {
    proportionColor = '#5bb1c9';
  }
  return createStyles(({ css }) => ({
    forwardWeek: css`
      svg {
        width: 30px;
        height: 30px;
        margin-top: 8px;
        color: #81d3f8;
      }
    `,
    whichWeek: css`
      width: 90px;
      height: 30px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      background-color: #81d3f8;
      color: #ffffff;
      border: none;
      border-radius: 5px;
      padding: 5px;
      margin-top: 10px;
    `,
    weeklyScore: css`
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
    overdueItems: css`
      color: #f88a22;
      border-color: #f88a22;
    `,
    dayOfWeek: css`
      svg {
        width: 32px;
        height: 32px;
        color: #81d3f8;
        margin-left: -3px;
        margin-right: 5px;
        margin-top: 9px;
      }
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
    plusItem: css`
      svg {
        width: 32px;
        height: 32px;
        color: #81d3f8;
        margin-left: -3px;
        margin-right: 5px;
        margin-top: 9px;
      }
    `,
    statistics: css`
      svg {
        width: 34px;
        height: 34px;
        color: #81d3f8;
        margin-top: 9px;
      }
    `,
    refresh: css`
      svg {
        width: 28px;
        height: 28px;
        color: #81d3f8;
        margin-top: 9px;
        margin-left: 2px;
      }
    `,
  }))();
}
