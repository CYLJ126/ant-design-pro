import { createStyles } from 'antd-style';

export default function todoWorkWrapStyle() {
  return createStyles(({ css }) => ({
    date: css`
      height: 25px;
      border: none;
    `,
  }))();
}
