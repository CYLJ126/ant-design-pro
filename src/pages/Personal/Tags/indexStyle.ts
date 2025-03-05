import { createStyles } from 'antd-style';

export default function tagStyle(title, color, level) {
  const titleWidth = title.length * 14 + 25;
  let opacity = 1 - level / 10;
  opacity = opacity < 0.3 ? 0.3 : opacity;
  return createStyles(({ css }) => ({
    title: css`
      width: ${titleWidth}px;
      height: 25px;
      color: #ffffff;
      background-color: ${color};
      opacity: ${opacity};

      :hover {
        background-color: ${color};
      }

      :focus {
        background-color: ${color};
      }
    `,
  }))();
}
