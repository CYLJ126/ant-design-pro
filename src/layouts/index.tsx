import { Outlet } from 'umi';
import { AliveScope } from 'react-activation';

export default function Layout() {
  return (
    <AliveScope>
      <span>测试</span>
      <Outlet />
    </AliveScope>
  );
}
