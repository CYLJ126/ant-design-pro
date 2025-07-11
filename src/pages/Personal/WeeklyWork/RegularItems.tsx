import React from 'react';
import { Badge, Button, Col, Row, Space } from 'antd';
import {
  KeyOutlined,
  LoginOutlined,
  MinusCircleOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import styles from './RegularItems.less';
import { getColorByIndex } from '@/common/colorUtil';

function Tag({ content }) {
  return (
    <Badge count={<MinusCircleOutlined className={styles.closeIcon} />}>
      <Button className={styles.button}>{content}</Button>
    </Badge>
  );
}

function Bar({ tags }) {
  return (
    <div style={{ height: '30px', display: 'flex', flexDirection: 'row' }}>
      {tags.map((name, index) => (
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
  return (
    <div className={styles.wrapper}>
      <Row wrap={false} align="middle">
        <Col flex={'auto'} style={{ display: 'flex', overflow: 'hidden' }}>
          {/* 图标容器 */}
          <div className={styles.iconContainer}>
            <PlusSquareOutlined className={styles.plusItem} />
            <LoginOutlined className={styles.importIcon} />
            <KeyOutlined className={styles.aimIcon} />
          </div>

          {/* 标签容器 */}
          <div className={styles.tagsContainer}>
            <Space size={[8, 0]} wrap={false}>
              <Tag content={'标签1'} />
              <Tag content={'标签2'} />
              <Tag content={'很长的标签3不会换行'} />
              <Tag content={'很长的标签3不会换行'} />
              <Tag content={'标签4'} />
              <Tag content={'标签5'} />
            </Space>
          </div>
        </Col>
        <Col style={{ width: 385, flex: '0 0 auto', minWidth: 385 }}>
          <Bar tags={['标签1', '标签2', '标签3', '标签4', '标签5', '标签6', '标签7']} />
        </Col>
      </Row>
    </div>
  );
}
