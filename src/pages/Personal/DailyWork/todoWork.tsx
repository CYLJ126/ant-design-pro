import React, { useState } from 'react';
import { Col, Input, InputNumber, Row } from 'antd';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  CloseOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import todoWorkStyle from './todoWorkStyle';

export default function TodoWork({ todoParam }) {
  const [todo, setTodo] = useState({ ...todoParam, fold: false });
  const { styles: dynamicStyle } = todoWorkStyle(todo.status);

  function save(param) {
    console.log('保存参数：' + JSON.stringify(param));
  }

  return (
    <div>
      <Row>
        <InputNumber
          size={'small'}
          addonBefore={'优先级'}
          max={10}
          min={1}
          changeOnWheel={true}
          value={todo.priority}
        />
        <ArrowUpOutlined className={dynamicStyle.icons} />
        <ArrowDownOutlined className={dynamicStyle.icons} />
        <CheckOutlined className={dynamicStyle.icons} />
        <CloseOutlined className={dynamicStyle.icons} />
        <ArrowLeftOutlined className={dynamicStyle.icons} />
        <ArrowRightOutlined className={dynamicStyle.icons} />
      </Row>
      <Row>
        <Col span={22}>
          <Input value={todo.title} className={dynamicStyle.title} />
        </Col>
        <Col span={2}>
          {todo.fold ? (
            <VerticalAlignBottomOutlined className={dynamicStyle.icon} />
          ) : (
            <VerticalAlignTopOutlined className={dynamicStyle.icon} />
          )}
        </Col>
      </Row>
      <Row>
        <Input.TextArea
          value={todo.content}
          className={dynamicStyle.content}
          onChange={(e) => setTodo({ ...todo, content: e.target.value })}
          onBlur={() => save(todo)}
        />
      </Row>
    </div>
  );
}
