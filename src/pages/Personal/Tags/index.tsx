import React, { useEffect, useRef, useState } from 'react';
import { Input, Space, Tree, TreeNodeProps } from 'antd';
import { DownOutlined, TagOutlined } from '@ant-design/icons';
import tagStyle from './indexStyle';
import { addTag, deleteTag, listRecursive, updateTag } from '@/services/ant-design-pro/base';
import AddIcon from '@/icons/AddIcon';
import DeleteIcon from '@/icons/DeleteIcon';

const colors = ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];

function Title({ tagDto, handleFunc }) {
  const [title, setTitle] = useState(tagDto.name);
  const { styles: dynamicStyle } = tagStyle(title, tagDto.color, tagDto.level);
  return (
    <Space size="small">
      <Space.Compact>
        <Input
          className={dynamicStyle.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleFunc({ ...tagDto, name: title, type: 'update' })}
        />
      </Space.Compact>
      <Space.Compact className={dynamicStyle.addIcon}>
        {/*在当前标签的最后一个子标签中添加一个新标签*/}
        <AddIcon
          width={20}
          height={20}
          color={tagDto.color}
          onClick={() => handleFunc({ ...tagDto, type: 'add' })}
        />
      </Space.Compact>
      <Space.Compact className={dynamicStyle.deleteIcon}>
        <DeleteIcon
          width={23}
          height={23}
          color={tagDto.color}
          onClick={() => handleFunc({ ...tagDto, type: 'delete' })}
        />
      </Space.Compact>
    </Space>
  );
}

export default function Tags() {
  const [trees, setTrees] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const treeRef = useRef(null);

  function generateTag(tagDto, handleFunc) {
    return {
      id: tagDto.id,
      title: <Title tagDto={tagDto} handleFunc={handleFunc} />,
      key: tagDto.id + tagDto.time,
      level: tagDto.level,
      color: tagDto.color,
      fatherId: tagDto.fatherId,
      icon: <TagOutlined />,
    };
  }

  function generateTags(tagList, level, time, handle) {
    if (!tagList || tagList === []) {
      return [];
    }
    let colorIndex = 0;
    return tagList.map((item) => {
      let tagColor = colors[colorIndex % 7];
      let tag: TreeNodeProps = generateTag(
        { ...item, color: tagColor, level: level, time: time },
        handle,
      );
      colorIndex++;
      tag.children = generateTags(item.children, level + 1, time, handle);
      return tag;
    });
  }

  function addNewTag(tags, currentTag, handle) {
    return tags.map((item) => {
      // 只支持一次新增一个标签，只有向后端插入了有 id 了才支持新增另一个标签
      if (item.id === currentTag.id) {
        let children = item.children ?? [];
        let tempTime = new Date().getTime();
        children.push(
          generateTag(
            {
              key: item.key + tempTime,
              time: tempTime,
              level: item.level + 1,
              name: '标签',
              fatherId: item.id,
              color: item.color,
            },
            handle,
          ),
        );
        item.children = children;
        setExpandedKeys([item.key]);
      } else if (item.children) {
        // 查找下级标签
        item.children = addNewTag(item.children, currentTag, handle);
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
      let newTags = addNewTag(treeRef.current.props.treeData, tag, handleTag);
      setTrees(newTags);
    }
  }

  function onExpand(expandedKeys) {
    setExpandedKeys([...expandedKeys]);
  }

  useEffect(() => {
    listRecursive({}).then((result) => {
      setTrees(generateTags(result, 1, new Date().getTime(), handleTag));
    });
  }, []);

  return (
    <Tree
      ref={treeRef}
      showLine
      showIcon
      draggable
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      switcherIcon={<DownOutlined />}
      treeData={trees}
    />
  );
}
