import React, { useEffect, useState } from 'react';
import { DatePicker, Row } from 'antd';
import todoWorkWrapStyle from './todoWorkWrapStyle';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import { listTodoWork } from '@/services/ant-design-pro/dailyWork';
import TodoWork from './todoWork';
import { PlusOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

const dateFormat = 'YYYY-MM-DD';

export default function TodoWorkWrap() {
  const [date, setDate] = useState(dayjs());
  const [todoWorks, setTodoWorks] = useState([]);
  const { styles: dynamicStyle } = todoWorkWrapStyle();

  function toggleDay(type) {
    let temp = date.add(type === 'former' ? -1 : 1, 'day');
    setDate(temp);
  }

  function listTodos() {
    dayjs.extend(utc);
    let temp = dayjs(date).utc().local().format(dateFormat);
    listTodoWork({
      startDateTimeFloor: temp + ' 00:00:00',
      startDateTimeCeil: temp + ' 23:59:59',
    }).then((result) => {
      setTodoWorks(result);
    });
  }

  function addTodo() {
    let temp = {
      startDate: date,
      priority: 10,
      status: 'INITIAL',
      title: '',
      content: '',
      foldFlag: 'YES',
    };
    let newList = [];
    newList.push(temp);
    newList.push(...todoWorks);
    setTodoWorks(newList);
  }

  useEffect(() => {
    listTodos(null);
  }, [date]);

  const time = new Date().getTime();
  return (
    <div className={dynamicStyle.wrap}>
      <Row className={dynamicStyle.headRow}>
        <Row className={dynamicStyle.headDiv}>
          <VerticalRightOutlined
            className={dynamicStyle.forwardDay}
            onClick={() => toggleDay('former')}
          />
          <DatePicker
            value={dayjs(date, dateFormat)}
            className={dynamicStyle.date}
            format={dateFormat}
            onChange={(date) => {
              setDate(date);
            }}
          />
          <VerticalLeftOutlined
            className={dynamicStyle.forwardDay}
            onClick={() => toggleDay('latter')}
          />
        </Row>
        <PlusOutlined onClick={addTodo} className={dynamicStyle.headPlus} />
      </Row>
      <Row>
        {todoWorks.map((item) => (
          <TodoWork key={item.id + time} todoParam={item} postUpdate={listTodos} />
        ))}
      </Row>
    </div>
  );
}
