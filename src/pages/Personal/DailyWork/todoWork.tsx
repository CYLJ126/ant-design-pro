import React, { useState } from 'react';
import { Col, Input, InputNumber, message, Row } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UndoOutlined,
  CheckOutlined,
  CloseOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import todoWorkStyle from './todoWorkStyle';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import {
  deleteTodoWork,
  insertTodoWork,
  updateTodoWork,
} from '@/services/ant-design-pro/dailyWork';

export default function TodoWork({ todoParam, postUpdate }) {
  const [todo, setTodo] = useState({ ...todoParam, fold: false });
  const { styles: dynamicStyle } = todoWorkStyle(todo.status);
  dayjs.extend(utc);

  function save(param) {
    console.log('保存参数：' + JSON.stringify(param));
    if (!param.title || !param.content || !param.priority) {
      message.error('请完善待办信息！');
      return;
    }
    let temp = {
      id: null,
      status: param.status,
      startDate: dayjs(todo.startDate).utc().local().format('YYYY-MM-DD HH:mm:ss'),
      title: param.title,
      content: param.content,
      priority: param.priority,
    };
    if (!param.id) {
      insertTodoWork(temp).then(() => postUpdate());
    } else {
      temp.id = param.id;
      updateTodoWork(temp).then(() => postUpdate());
    }
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
          onChange={(value) => setTodo({ ...todo, priority: value })}
          onBlur={() => save(todo)}
        />
        {/* 标记为完成或待办 */}
        {todo.status === 'INITIAL' ? (
          <CheckOutlined
            className={dynamicStyle.icons}
            onClick={() => save({ ...todo, status: 'DONE' })}
          />
        ) : (
          <UndoOutlined
            className={dynamicStyle.icons}
            onClick={() => save({ ...todo, status: 'INITIAL' })}
          />
        )}
        {/* 删除 */}
        <CloseOutlined
          className={dynamicStyle.icons}
          onClick={() => {
            deleteTodoWork(todo.id).then();
            postUpdate();
          }}
        />
        {/* 推入前一天 */}
        <ArrowLeftOutlined
          className={dynamicStyle.icons}
          onClick={() => save({ ...todo, startDate: dayjs(todo.startDate).add(-1, 'day') })}
        />
        {/* 推入后一天 */}
        <ArrowRightOutlined
          className={dynamicStyle.icons}
          onClick={() => save({ ...todo, startDate: dayjs(todo.startDate).add(1, 'day') })}
        />
      </Row>
      <Row>
        <Col span={22}>
          <Input
            value={todo.title}
            className={dynamicStyle.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            onBlur={() => save(todo)}
          />
        </Col>
        <Col span={2}>
          {todo.fold ? (
            // 展开
            <VerticalAlignBottomOutlined
              className={dynamicStyle.icon}
              onClick={() => setTodo({ ...todo, fold: true })}
            />
          ) : (
            // 收起
            <VerticalAlignTopOutlined
              className={dynamicStyle.icon}
              onClick={() => setTodo({ ...todo, fold: false })}
            />
          )}
        </Col>
      </Row>
      {!todo.fold && (
        <Row>
          <Input.TextArea
            value={todo.content}
            className={dynamicStyle.content}
            onChange={(e) => setTodo({ ...todo, content: e.target.value })}
            onBlur={() => save(todo)}
          />
        </Row>
      )}
    </div>
  );
}
