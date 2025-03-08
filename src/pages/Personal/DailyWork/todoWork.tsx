import React, { useState } from 'react';
import { Input, InputNumber, message, Row } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
  UndoOutlined,
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
  const [todo, setTodo] = useState(todoParam);
  const { styles: dynamicStyle } = todoWorkStyle(todo);
  dayjs.extend(utc);

  function save(param) {
    console.log('保存参数：' + JSON.stringify(param));
    if (!param.title) {
      message.error('请填写待办标题！');
      return;
    }
    let temp = {
      id: null,
      status: param.status,
      foldFlag: param.foldFlag,
      startDate: dayjs(param.startDate).utc().local().format('YYYY-MM-DD HH:mm:ss'),
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
    <div className={dynamicStyle.todoWrap}>
      <Row className={dynamicStyle.operation}>
        <InputNumber
          size={'small'}
          addonBefore={'优先级'}
          max={10}
          min={1}
          changeOnWheel={true}
          value={todo.priority}
          className={dynamicStyle.priority}
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
            deleteTodoWork(todo.id).then(() => postUpdate());
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
        {todo.foldFlag === 'NO' ? (
          // 展开
          <VerticalAlignBottomOutlined
            className={`${dynamicStyle.icons} ${dynamicStyle.fold}`}
            onClick={() => save({ ...todo, foldFlag: 'YES' })}
          />
        ) : (
          // 收起
          <VerticalAlignTopOutlined
            className={`${dynamicStyle.icons} ${dynamicStyle.fold}`}
            onClick={() => save({ ...todo, foldFlag: 'NO' })}
          />
        )}
      </Row>
      <Row>
        <Input
          value={todo.title}
          className={dynamicStyle.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          onBlur={() => save(todo)}
        />
      </Row>
      {todo.foldFlag === 'YES' && (
        <Row>
          <Input.TextArea
            autoSize
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
