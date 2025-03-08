import { ReactComponent as ArrowRightFromArcSvg } from '@/assets/icon/arrow-right-from-arc.svg';
import { createStyles } from 'antd-style';

const useStyle = function iconStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    arrowRight: css`
      width: ${width}px;
      height: ${height}px;
      margin: ${margin};

      :hover {
        cursor: pointer;
      }

      path {
        stroke: ${color};
      }
    `,
  }))();
};

export default function ArrowRightIcon({ width, height, color, margin, onClick }) {
  const { styles } = useStyle(width, height, color, margin);
  return <ArrowRightFromArcSvg onClick={onClick} className={styles.arrowRight} />;
}
