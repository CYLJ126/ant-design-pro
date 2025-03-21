import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'my motto',
          title: '满目繁华尽是旧时手种红药 为谁攀折拟将幽恨试写残花',
          href: 'https://github.com/CYLJ126',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
