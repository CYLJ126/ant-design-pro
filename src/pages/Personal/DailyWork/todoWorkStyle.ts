import { createStyles } from 'antd-style';

export default function todoWorkStyle(status) {
  let color = status === 'DONE' ? '#63bd89' : '#81d3f8';
  return createStyles(({ css }) => ({
    priority: css`
      height: 25px;
      border: none;
    `,
    icons: css`
      width: 25px;
      height: 25px;
      color: ${color};
    `,
    title: css`
      width: 100%;
      height: 25px;
      color: ${color};
    `,
    content: css`
      width: 100%;
      color: ${color};
    `,
  }))();
}
