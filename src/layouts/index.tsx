import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'umi';
import { AliveScope } from 'react-activation';
import { Flex, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import tagStyle from './TagStyle';
import { RouteContext } from '@ant-design/pro-layout';

interface TagInfo {
  path: string;
  title?: string;
  isActive?: boolean;
}

const initTags: TagInfo[] = [
  {
    title: '首页',
    path: '/welcome',
    isActive: true,
  },
];

export default function Layout() {
  const [tags, setTags] = useState(initTags);
  const navigate = useNavigate();
  const { location } = useContext(RouteContext);

  const handleTab = (tag: TagInfo, type: string) => {
    if (type === 'click') {
      // 点击标签跳转
      const newTags = tags.map((item) => {
        item.isActive = item.path === tag.path;
        return item;
      });
      setTags(newTags);
      navigate(tag.path);
    }
  };

  useEffect(() => {
    // 点击左侧菜单跳转
    /*let exist = false;
    const newTags: TagInfo[] = tags.map(item => {
      exist = item.path === location.pathname;
      return {...item, isActive: exist};
    });
    if(!exist) {
      newTags.push({path: location.pathname, isActive: true});
    }
    setTags(newTags);*/
  }, [location]);

  return (
    <>
      <Flex gap="4px 0" wrap>
        {tags.map((tag) => {
          const { styles: dynamicStyle } = tagStyle(tag.isActive);
          const time = new Date().getTime();
          return (
            <Tag
              key={time + '_' + tag.path}
              className={dynamicStyle.tag}
              onClick={() => handleTab(tag, 'click')}
              onClose={(e) => {
                e.preventDefault();
                handleTab(tag, 'close');
              }}
            >
              {tag.title}
            </Tag>
          );
        })}
      </Flex>
      <AliveScope>
        <Outlet />
      </AliveScope>
    </>
  );
}
