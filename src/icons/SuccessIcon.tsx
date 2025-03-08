import { ReactComponent as CheckedSuccessSvg } from '@/assets/icon/checked-success.svg';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    success: css`
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

export default function SuccessIcon({ width, height, color, margin, onClick }) {
  const { styles } = useStyle(width, height, color, margin);
  return <CheckedSuccessSvg onClick={onClick} className={styles.success} />;
}
