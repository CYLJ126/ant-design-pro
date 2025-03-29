/**
 * 由于菜单配置中的按钮无法在前端转换成图标，所以只能通过 Map 映射成图标组件。
 */
import {
  CrownOutlined,
  LoadingOutlined,
  ReadOutlined,
  SmileOutlined,
  TagOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';

const IconMap = {
  smile: <SmileOutlined />,
  crown: <CrownOutlined />,
  userOutlined: <UserOutlined />,
  tool: <ToolOutlined />,
  tag: <TagOutlined />,
  loading: <LoadingOutlined />,
  book: <ReadOutlined />,
};

export default IconMap;
