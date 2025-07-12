import React, { useEffect, useState } from 'react';
import { Badge, Button, Cascader, CascaderProps, Col, message, Popover, Row, Space } from 'antd';
import {
  KeyOutlined,
  LoginOutlined,
  MinusCircleOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import styles from './RegularItems.less';
import { getColorByIndex } from '@/common/colorUtil';
import { listRecursive } from '@/services/ant-design-pro/base';
import { Option } from 'commander';

/**
 * 标签
 * @param tag 标签内容对象
 * @param index 标签索引
 * @param singleView 点击标签，只显示当前标签的活动条
 * @param iremoveTagndex 删除当前标签
 * @constructor  Tag
 */
function Tag({ tag, index, singleView, removeTag }) {
  return (
    <Badge
      count={
        <MinusCircleOutlined
          className={styles.closeIcon}
          onClick={(e) => {
            removeTag(tag);
            e.stopPropagation();
          }}
        />
      }
    >
      <Button
        className={styles.button}
        onClick={() => singleView('single', tag)}
        style={{
          backgroundColor: getColorByIndex(index),
        }}
      >
        {tag.name}
      </Button>
    </Badge>
  );
}

/**
 * 标签选择器
 * @param addTags 添加标签的回调函数
 * @param options 标签选项
 * @constructor TagsSelector
 */
const TagsSelector: React.FC = ({ addTag, options }) => {
  const onChange: CascaderProps<Option, 'value', true>['onChange'] = (value, selectedOptions) => {
    console.log('value值：', value);
    const selectedCascader = selectedOptions[selectedOptions.length - 1];
    const currentSelected = selectedCascader[selectedCascader.length - 1];
    addTag({ id: currentSelected.id, name: currentSelected.name });
  };

  return (
    <Cascader
      options={options}
      expandTrigger="hover"
      onChange={onChange}
      fieldNames={{ label: 'name', value: 'id' }}
      multiple
    />
  );
};

function Bar({ tags }) {
  return (
    <div style={{ height: '30px', display: 'flex', flexDirection: 'row' }}>
      {tags.map((tag, index) => (
        <div
          key={index}
          style={{
            width: '7px',
            height: '30px',
            backgroundColor: getColorByIndex(index),
          }}
        />
      ))}
    </div>
  );
}

export default function RegularItems({}) {
  const [tags, setTags] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    listRecursive({ name: '日课' }).then((data) => {
      setOptions(data[0].children);
    });
  }, []);

  /**
   * 添加一个新标签
   * @param tag 标签对象
   */
  const addTag = (tag) => {
    if (tags.length >= 7) {
      message.warning('最多添加 7 个标签').then();
      return;
    }
    if (!tags.some((item) => item.id === tag.id)) {
      setTags([...tags, tag]);
    }
  };

  /**
   * 删除一个标签
   * @param tag 标签对象
   */
  const removeTag = (tag) => {
    setTags(tags.filter((item) => item.id !== tag.id));
    // TODO 调用后端删除
  };

  /**
   * 控制标签活动条的显示
   * @param type 显示类型：all-显示所有；none-所有不显示；single-显示指定标签活动条；
   * @param tag 标签对象，可选
   */
  const handleTagView = (type, tag?) => {
    console.log('查看标签：', tag);
  };

  return (
    <div className={styles.wrapper}>
      <Row wrap={false} align="middle">
        <Col flex={'auto'} style={{ display: 'flex', overflow: 'hidden' }}>
          {/* 图标容器 */}
          <div className={styles.iconContainer}>
            <Popover
              autoAdjustOverflow
              placement={'bottomRight'}
              destroyOnHidden
              content={<TagsSelector addTag={addTag} options={options} />}
            >
              {/* 添加标签 */}
              <PlusSquareOutlined className={styles.plusItem} />
            </Popover>
            {/* 导入到当天 */}
            <LoginOutlined className={styles.importIcon} />
            {/* 全部显示或不显示活动条 */}
            <KeyOutlined className={styles.aimIcon} />
          </div>
          {/* 标签容器 */}
          <div className={styles.tagsContainer}>
            <Space size={[8, 0]} wrap={false}>
              {tags.map((tag, index) => (
                <Tag
                  tag={tag}
                  key={index}
                  index={index}
                  singleView={handleTagView}
                  removeTag={removeTag}
                />
              ))}
            </Space>
          </div>
        </Col>
        <Col style={{ width: 385, flex: '0 0 auto', minWidth: 385 }}>
          {/* 右侧活动条 */}
          <Bar tags={tags} />
        </Col>
      </Row>
    </div>
  );
}
