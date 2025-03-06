import { TagOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyle = function tagStyle(width, height, color, margin) {
  return createStyles(({ css }) => ({
    tag: css`
      margin: ${margin};

      svg {
        width: ${width}px;
        height: ${height}px;
        fill: ${color};
      }
    `,
  }))();
};

export default function TagIcon({ width, height, color, margin }) {
  const { styles } = useStyle(width, height, color, margin);
  return <TagOutlined className={styles.tag} />;
}
