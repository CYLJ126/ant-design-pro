import React, { useEffect, useState } from 'react';
import { Tree, Input, Space } from 'antd';
import {
  DownOutlined,
  MinusCircleOutlined,
  TagOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import tagStyle from './indexStyle';

const colors = ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];

const treeJson = [
  {
    name: '日课',
    id: 24,
    subTags: [
      {
        name: '工作',
        id: 1,
      },
      {
        name: '治学',
        id: 2,
      },
      {
        name: '修身',
        id: 3,
      },
    ],
  },
  {
    name: '项目目',
    id: 29,
    subTags: [],
  },
  {
    name: '其他其他',
    id: 30,
    subTags: [
      {
        name: '其他',
        id: 31,
      },
    ],
  },
];

function Title({ tagDto, handleFunc }) {
  const [title, setTitle] = useState(tagDto.name);
  const { styles: dynamicStyle } = tagStyle(title, tagDto.color, tagDto.level);
  return (
    <Space size="middle">
      <Space.Compact>
        <Input
          className={dynamicStyle.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleFunc(tagDto.id, title, 'update')}
        />
      </Space.Compact>
      <Space.Compact>
        <PlusCircleOutlined onClick={() => handleFunc(tagDto.id, title, 'add')} />
      </Space.Compact>
      <Space.Compact>
        <MinusCircleOutlined onClick={() => handleFunc(tagDto.id, title, 'delete')} />
      </Space.Compact>
    </Space>
  );
}

function generateTag(tagDto, handleFunc) {
  return {
    title: <Title tagDto={tagDto} handleFunc={handleFunc} />,
    key: tagDto.id + tagDto.time,
    icon: <TagOutlined />,
  };
}

function generateTags(tagList, level, time, handleTag) {
  if (!tagList || tagList === []) {
    return [];
  }
  let colorIndex = 0;
  return tagList.map((item) => {
    let tagColor = colors[colorIndex % 7];
    let tag = generateTag({ ...item, color: tagColor, level: level, time: time }, handleTag);
    colorIndex++;
    tag.children = generateTags(item.subTags, level + 1, time, handleTag);
    return tag;
  });
}

export default function Tags() {
  const [trees, setTrees] = useState([]);

  function handleTag(id, title, type) {
    console.log('参数【id: ' + id + ' , title: ' + title + ' , type: ' + type);
  }

  useEffect(() => {
    setTrees(generateTags(treeJson, 1, new Date().getTime(), handleTag));
  }, []);

  return (
    <Tree showLine showIcon defaultExpandAll switcherIcon={<DownOutlined />} treeData={trees} />
  );
}
