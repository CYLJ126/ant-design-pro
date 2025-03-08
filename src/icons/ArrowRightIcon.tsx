import { ReactComponent as ArrowRightFromArcSvg } from '@/assets/icon/arrow-right-from-arc.svg';
import { createStyles } from 'antd-style';

const useStyle = function iconStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    arrowRight: css`
      width: ${width}px;
      height: ${height}px;
      stroke: ${color};
      margin: ${margin};
    `,
  }))();
};

export default function ArrowRightIcon({ width, height, color, margin }) {
  const { styles } = useStyle(width, height, color, margin);
  return <ArrowRightFromArcSvg className={styles.arrowRight} />;
}
