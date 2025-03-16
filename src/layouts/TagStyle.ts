import { createStyles } from 'antd-style';

export default function tagStyle(isActive) {
  const backGroundColor = isActive ? '#81d3f8' : '#81D3F8';
  const fontColor = isActive ? '#ffffff' : '#81d3f8';
  return createStyles(({ css }) => ({
    tag: css`
      background-color: ${backGroundColor};
      border: solid 1px #81d3f8;
      color: ${fontColor};
    `,
  }))();
}
