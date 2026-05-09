// src/layouts/index.tsx
import { AliveScope } from 'react-activation';
import { Outlet } from '@umijs/max';

export default function Layout() {
  return (
    <AliveScope>
      <div id="test-pro-layout">
        <Outlet />
      </div>
    </AliveScope>
  );
}
