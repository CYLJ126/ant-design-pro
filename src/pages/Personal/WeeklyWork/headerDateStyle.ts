import { createStyles } from 'antd-style';

export default function headerDateStyle(date) {
  const backgroundColor = new Date(date).getTime() < new Date().getTime() ? '#5bb1c9' : '#81d3f8';
  console.log('颜色：' + backgroundColor);
  return createStyles(({ css }) => ({
    dayOfWeek: css`
      width: 50px;
      height: 20px;
      border-radius: 5px 5px 0 0;
      border: none;
      background-color: ${backgroundColor};
      padding: 2px;
      text-align: center;
      color: #ffffff;

      :hover {
        color: ${backgroundColor};
        border: 1.5px solid ${backgroundColor};
      }
    `,
    dayOfDate: css`
      width: 50px;
      height: 20px;
      border-radius: 0 0 5px 5px;
      border: 1.5px solid ${backgroundColor};
      border-top: 0;
      padding: 2px;
      text-align: center;
      color: ${backgroundColor};
    `,
  }))();
}
