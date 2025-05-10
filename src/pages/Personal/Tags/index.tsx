import React, { useEffect, useRef, useState } from 'react';
import { Input, Space, Tree, TreeNodeProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import tagStyle from './indexStyle';
import { addTag, deleteTag, listRecursive, updateTag } from '@/services/ant-design-pro/base';
import AddIcon from '@/icons/AddIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import TagIcon from '@/icons/TagIcon';

const colors = ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];

let expandedIdsCache = [];

function Title({ tagDto, handleFunc }) {
  const [title, setTitle] = useState(tagDto.title);
  const { styles: dynamicStyle } = tagStyle(title, tagDto.color, tagDto.level);
  return (
    <Space>
      <Space.Compact>
        <Input
          className={dynamicStyle.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleFunc({ ...tagDto, title: title, type: 'update' })}
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
      <Space.Compact
        className={dynamicStyle.deleteIcon}
        onClick={() => handleFunc({ ...tagDto, type: 'delete' })}
      >
        <DeleteIcon color={tagDto.color} />
      </Space.Compact>
    </Space>
  );
}

export default function Tags() {
  const [trees, setTrees] = useState([]);
  // 展开的 key 列表，由于担心树节点的 key 使用 id 时，可能更新不会触发，所以 key 没有用 id 作为值，而是 id 加时间，并配合 expandedIdsCache 变量一起控制在增、删、改时的展开、收起
  const [expandedKeys, setExpandedKeys] = useState([]);
  const treeRef = useRef(null);

  function generateTag(tagDto, handleFunc) {
    return {
      id: tagDto.id,
      title: <Title tagDto={tagDto} handleFunc={handleFunc} />,
      key: tagDto.key,
      level: tagDto.level,
      color: tagDto.color,
      fatherId: tagDto.fatherId,
      icon: <TagIcon width={18} height={18} color={tagDto.color} margin="7px 15px 0 0" />,
    };
  }

  function generateTags(tagList, level, time, handle, expandedKeysCache) {
    if (!tagList || tagList === []) {
      return [];
    }
    let colorIndex = 0;
    return tagList.map((item) => {
      let tagColor = colors[colorIndex % 7];
      let tag: TreeNodeProps = generateTag(
        { ...item, title: item.name, color: tagColor, level: level, key: item.id + '_' + time },
        handle,
      );
      if (expandedIdsCache.includes(tag.id)) {
        expandedKeysCache.push(tag.key);
      }
      colorIndex++;
      tag.children = generateTags(item.children, level + 1, time, handle, expandedKeysCache);
      return tag;
    });
  }

  /**
   * 添加一个新的标签，并将其父节点添加到展开的 key 列表中
   * @param tags 所有标签（用以查询是在哪个标签下添加新节点）
   * @param currentTag 在该标签下添加新节点
   * @param handle 对标签的处理函数，支持增、删、改
   */
  function addNewTag(tags, currentTag, handle) {
    return tags.map((item) => {
      // 只支持一次新增一个标签，只有向后端插入了有 id 了才支持新增另一个标签
      if (item.id === currentTag.id) {
        let children = item.children ?? [];
        let tempTime = new Date().getTime();
        let toAdd = {
          key: item.key + tempTime,
          time: tempTime,
          level: item.level + 1,
          status: 'DOING',
          title: '新标签',
          fatherId: item.id,
          color: '#919191',
        };
        children.push(generateTag(toAdd, handle));
        item.children = children;
      } else if (item.children) {
        // 查找下级标签
        item.children = addNewTag(item.children, currentTag, handle);
      }
      return item;
    });
  }

  function postUpdate(handleFunc) {
    listRecursive({}).then((result) => {
      const expandedKeysCache = [];
      let nodes = generateTags(result, 1, new Date().getTime(), handleFunc, expandedKeysCache);
      // 设置新的展开 key，因为时间变了，所以 节点对应的 key 也变了，需要重新设置回原来要展开的结点
      setExpandedKeys(expandedKeysCache);
      setTrees(nodes);
    });
  }

  function handleTag(tag) {
    console.log('参数【id: ' + tag.id + ' , title: ' + tag.title + ' , type: ' + tag.type);
    // 后端字段名转换
    tag.name = tag.title;
    if (tag.type === 'delete') {
      if (!tag.id) {
        return;
      }
      deleteTag(tag.id).then(() => {
        postUpdate(handleTag);
      });
    } else if (tag.type === 'update') {
      if (tag.id) {
        updateTag(tag).then(() => {
          postUpdate(handleTag);
        });
      } else {
        addTag(tag).then(() => {
          postUpdate(handleTag);
        });
      }
    } else if (tag.type === 'add') {
      let newTags = addNewTag(treeRef.current.props.treeData, tag, handleTag);
      setTrees(newTags);
    }
  }

  function onExpand(expandedKeys, current) {
    console.log('当前展开：' + JSON.stringify(expandedKeys));
    setExpandedKeys([...expandedKeys]);
    if (!current.expanded) {
      expandedIdsCache = expandedIdsCache.filter((id) => current.node.id !== id);
    } else {
      expandedIdsCache.push(current.node.id);
    }
    console.log('当前展开id：' + JSON.stringify(expandedIdsCache));
  }

  useEffect(() => {
    listRecursive({}).then((result) => {
      setTrees(generateTags(result, 1, new Date().getTime(), handleTag, []));
    });
  }, []);

  return (
    <Tree
      ref={treeRef}
      showLine
      showIcon
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      switcherIcon={<DownOutlined />}
      treeData={trees}
    />
  );
}
