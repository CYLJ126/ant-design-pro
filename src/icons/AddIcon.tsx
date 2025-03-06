import { ReactComponent as AddSvg } from '@/assets/icon/add-square.svg';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color) {
  return createStyles(({ css }) => ({
    add: css`
      width: ${width}px;
      height: ${height}px;
      fill: ${color};
    `,
  }))();
};

export default function AddIcon({ width, height, color }) {
  const { styles } = useStyle(width, height, color);
  return <AddSvg className={styles.add} />;
}
