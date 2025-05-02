import { ReactComponent as ThumbsUp } from '@/assets/icon/thumbs-up.svg';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    thumbsUp: css`
      width: ${width}px;
      height: ${height}px;
      fill: ${color};
      margin: ${margin};

      :hover {
        cursor: pointer;
      }
    `,
  }))();
};

export default function DeleteIcon({ isUp, width, height, color, margin, onClick }) {
  const { styles } = useStyle(width, height, color, margin);
  return (
    <ThumbsUp
      transform={isUp ? '' : 'scale(1, -1)'}
      onClick={onClick}
      className={styles.thumbsUp}
    />
  );
}
