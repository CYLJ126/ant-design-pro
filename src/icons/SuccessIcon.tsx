import { ReactComponent as CheckedSuccessSvg } from '@/assets/icon/checked-success.svg';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    success: css`
      width: ${width}px;
      height: ${height}px;
      fill: ${color};
      margin: ${margin};
    `,
  }))();
};

export default function SuccessIcon({ width, height, color, margin }) {
  const { styles } = useStyle(width, height, color, margin);
  return <CheckedSuccessSvg className={styles.success} />;
}
