import React from 'react';
import { DatePicker, Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import headerStyle from './headerStyle';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';

const dateFormat = 'YYYY-MM-DD';

export default function Header({ whichDay, headInfo, refresh, add, toggleDay }) {
  dayjs.extend(utc);
  const { styles: dynamicStyle } = headerStyle(headInfo);
  return (
    <div>
      <Row>
        <VerticalRightOutlined
          className={dynamicStyle.forwardWeek}
          onClick={() => toggleDay('former')}
        />
        <DatePicker
          className={dynamicStyle.date}
          value={dayjs(whichDay)}
          format={dateFormat}
          onChange={(date) => {
            toggleDay('set', date);
          }}
        />
        <VerticalLeftOutlined
          className={dynamicStyle.forwardWeek}
          onClick={() => toggleDay('latter')}
        />
        <span className={dynamicStyle.dailyScore}>{'' + headInfo.score + '分'}</span>
        <span className={dynamicStyle.dailyScore}>{'' + headInfo.cost + 'h'}</span>
        <span key={new Date().getTime()} className={dynamicStyle.proportion}>
          {'' + headInfo.proportion + '%'}
        </span>
        <span className={`${dynamicStyle.itemCount} ${dynamicStyle.completedItems}`}>
          {'完成项 - ' + headInfo.completedWork}
        </span>
        <span className={`${dynamicStyle.itemCount} ${dynamicStyle.todoItems}`}>
          {'待办项 - ' + headInfo.todoWork}
        </span>
        <ReloadOutlined onClick={refresh} className={dynamicStyle.refresh} />
        <StepBackwardOutlined className={dynamicStyle.fold} />
        <StepForwardOutlined className={dynamicStyle.fold} />
        <PlusSquareOutlined className={dynamicStyle.plusItem} onClick={() => add(whichDay)} />
        <ExportOutlined className={dynamicStyle.toWeekly} />
      </Row>
    </div>
  );
}
