import { createStyles } from 'antd-style';

export default function tagStyle(title, color, level) {
  let titleWidth = title.length * 14 + 25;
  titleWidth = titleWidth < 40 ? 45 : titleWidth;
  let opacity = 1 - level / 5;
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
    addIcon: css`
      position: absolute;
      top: 3px;
    `,
    deleteIcon: css`
      position: absolute;
      top: 0;
      left: 0;
      //right: -30px;
    `,
  }))();
}
