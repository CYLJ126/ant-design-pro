import React, { useEffect, useState } from 'react';
import { DatePicker, Row } from 'antd';
import todoWorkWrapStyle from './todoWorkWrapStyle';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import { listTodoWork } from '@/services/ant-design-pro/dailyWork';
import TodoWork from './todoWork';

const dateFormat = 'YYYY-MM-DD';

export default function TodoWorkWrap() {
  const [date, setDate] = useState(dayjs());
  const [todoWorks, setTodoWorks] = useState([]);
  const { styles: dynamicStyle } = todoWorkWrapStyle();

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

  useEffect(() => {
    listTodos();
  }, [date]);

  const time = new Date().getTime();
  return (
    <div>
      <Row>
        <DatePicker
          defaultValue={dayjs(date, dateFormat)}
          className={dynamicStyle.date}
          format={dateFormat}
          onChange={(date) => {
            setDate(date);
          }}
        />
      </Row>
      <Row>
        <ul>
          {todoWorks.map((item) => (
            <li key={item.id + time}>
              <TodoWork todoParam={item} />
            </li>
          ))}
        </ul>
      </Row>
    </div>
  );
}
