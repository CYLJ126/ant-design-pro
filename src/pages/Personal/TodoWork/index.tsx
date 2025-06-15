import React, { useEffect, useState } from 'react';
import { DatePicker, Row } from 'antd';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import { listTodoWork } from '@/services/ant-design-pro/dailyWork';
import TodoWork from './todoWork';
import { PlusOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';

export default function TodoWorPane() {
  const [date, setDate] = useState(dayjs());
  const [todoWorks, setTodoWorks] = useState([]);
  dayjs.extend(utc);

  function toggleDay(type) {
    let temp = date.add(type === 'former' ? -1 : 1, 'day');
    setDate(temp);
  }

  function listTodos() {
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
      status: 0,
      title: '',
      content: '',
      foldFlag: 1,
    };
    let newList = [];
    newList.push(temp);
    newList.push(...todoWorks);
    setTodoWorks(newList);
  }

  useEffect(() => {
    listTodos();
  }, [date]);

  const time = new Date().getTime();
  return (
    <div className={styles.wrap}>
      <Row className={styles.headRow}>
        <Row className={styles.headDiv}>
          <VerticalRightOutlined
            className={styles.forwardDay}
            onClick={() => toggleDay('former')}
          />
          <DatePicker
            value={dayjs(date, dateFormat)}
            className={styles.date}
            format={dateFormat}
            onChange={(date) => {
              setDate(date);
            }}
          />
          <VerticalLeftOutlined className={styles.forwardDay} onClick={() => toggleDay('latter')} />
        </Row>
        <PlusOutlined onClick={addTodo} className={styles.headPlus} />
      </Row>
      <div className={styles.contentWrap}>
        <Row>
          {todoWorks.map((item) => (
            <TodoWork key={item.id + time} todoParam={item} postUpdate={listTodos} />
          ))}
        </Row>
      </div>
    </div>
  );
}
