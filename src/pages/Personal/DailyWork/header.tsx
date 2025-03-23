import React from 'react';
import { DatePicker, Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
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

export default function Header({ whichDay, add, toggleDay }) {
  dayjs.extend(utc);
  const { styles: dynamicStyle } = headerStyle();
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
        <StepBackwardOutlined className={dynamicStyle.fold} />
        <StepForwardOutlined className={dynamicStyle.fold} />
        <PlusSquareOutlined className={dynamicStyle.plusItem} onClick={() => add(whichDay)} />
        <ExportOutlined className={dynamicStyle.toWeekly} />
      </Row>
    </div>
  );
}
