import { createStyles } from 'antd-style';
import { calculateStringValue } from '@/common/stringUtil';

export default function tagStyle(title, color, level) {
  // 计算字符长度
  let titleWidth = calculateStringValue(title);
  titleWidth = titleWidth < 40 ? 45 : titleWidth;
  let opacity = 1 - level / 10;
  opacity = opacity < 0.3 ? 0.3 : opacity;
  return createStyles(({ css }) => ({
    tag: css`
      svg {
        color: ${color};
        opacity: ${opacity};
      }
    `,
    title: css`
      width: ${titleWidth}px;
      height: 25px;
      color: #ffffff;
      background-color: ${color};
      opacity: ${opacity};
      text-align: center;
      border: none;

      :hover {
        background-color: ${color};
      }

      :focus {
        background-color: ${color};
      }
    `,
    addIcon: css`
      position: absolute;
      top: 4px;
    `,
    deleteIcon: css`
      padding-left: 15px;
    `,
  }))();
}
