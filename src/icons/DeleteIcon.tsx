import { ReactComponent as DeleteSvg } from '@/assets/icon/delete-garbage.svg';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    delete: css`
      width: ${width}px;
      height: ${height}px;
      fill: ${color};
      margin: ${margin};

      :hover {
        cursor: pointer;
      }

      line {
        stroke: ${color};
      }

      rect {
        stroke: ${color};
      }
    `,
  }))();
};

export default function DeleteIcon({ width, height, color, margin, onClick }) {
  const { styles } = useStyle(width, height, color, margin);
  return <DeleteSvg onClick={onClick} className={styles.delete} />;
}
