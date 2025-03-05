import React, { useEffect, useState } from 'react';
import { Input, Space, Tree, TreeNodeProps } from 'antd';
import {
  DownOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  TagOutlined,
} from '@ant-design/icons';
import tagStyle from './indexStyle';
import { addTag, deleteTag, listRecursive, updateTag } from '@/services/ant-design-pro/base';

const colors = ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];

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
          onBlur={() => handleFunc({ ...tagDto, name: title, type: 'update' })}
        />
      </Space.Compact>
      <Space.Compact>
        {/*在当前标签的最后一个子标签中添加一个新标签*/}
        <PlusCircleOutlined onClick={() => handleFunc({ ...tagDto, type: 'add' })} />
      </Space.Compact>
      <Space.Compact>
        <MinusCircleOutlined onClick={() => handleFunc({ ...tagDto, type: 'delete' })} />
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
    let tag: TreeNodeProps = generateTag(
      { ...item, color: tagColor, level: level, time: time },
      handleTag,
    );
    colorIndex++;
    tag.children = generateTags(item.subTags, level + 1, time, handleTag);
    return tag;
  });
}

export default function Tags() {
  const [trees, setTrees] = useState([]);

  function addNewTag(tags, currentTag) {
    return tags.map((item) => {
      // 只支持一次新增一个标签，只有向后端插入了有 id 了才支持新增另一个标签
      if (item.id === currentTag.id) {
        let subTags = item.subTags ?? [];
        subTags.push({ key: item.key + new Date().getTime(), title: '' });
      } else if (item.subTags) {
        // 查找下级标签
        item.subTags = addNewTag(item.subTags, currentTag);
      }
      return item;
    });
  }

  function handleTag(tag) {
    console.log('参数【id: ' + tag.id + ' , title: ' + tag.title + ' , type: ' + tag.type);
    if (tag.type === 'delete') {
      deleteTag(tag.id).then(() => {
        listRecursive({}).then((result) => {
          setTrees(generateTags(result, 1, new Date().getTime(), handleTag));
        });
      });
    } else if (tag.type === 'update') {
      if (tag.id) {
        updateTag(tag).then(() => {
          listRecursive({}).then((result) => {
            setTrees(generateTags(result, 1, new Date().getTime(), handleTag));
          });
        });
      } else {
        addTag(tag).then(() => {
          listRecursive({}).then((result) => {
            setTrees(generateTags(result, 1, new Date().getTime(), handleTag));
          });
        });
      }
    } else if (tag.type === 'add') {
      setTrees(addNewTag(trees, tag));
    }
  }

  useEffect(() => {
    listRecursive({}).then((result) => {
      setTrees(generateTags(result, 1, new Date().getTime(), handleTag));
    });
  }, []);

  return (
    <Tree
      showLine
      showIcon
      draggable
      defaultExpandAll
      switcherIcon={<DownOutlined />}
      treeData={trees}
    />
  );
}
