import React, { useEffect, useState } from 'react';
import { FullscreenOutlined, SolutionOutlined, UndoOutlined } from '@ant-design/icons';
import Time from './time';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import foldedActivityStyle from './foldedActivityStyle';
import { getTargets } from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
import SuccessIcon from '@/icons/SuccessIcon';
import ArrowRightIcon from '@/icons/ArrowRightIcon';
import DeleteIcon from '@/icons/DeleteIcon';

export default function FoldedActivity({ dailyWork, setFoldState }) {
  const { styles: dynamicStyle } = foldedActivityStyle(dailyWork.status);
  const [targetOptions, setTargetOptions] = useState([]);
  const color = dailyWork.status === 'DONE' ? '#6294a5' : '#81d3f8';

  useEffect(() => {
    if (dailyWork?.workId) {
      getTargets({
        workId: dailyWork.workId,
        whichDay: dayjs(dailyWork.startTime).utc().local().format('YYYY-MM-DD'),
      }).then((result) => {
        setTargetOptions(
          result.map((item) => {
            return { value: item.id, label: item.target };
          }),
        );
      });
    }
  }, [dailyWork.workId]);

  return (
    <Row>
      <Col span={2}>
        <Row style={{ marginBottom: '5px' }}>
          <Time
            showLine={true}
            dailyWork={{ ...dailyWork, mark: 'startTime', placeholder: '开始时间' }}
            className={dynamicStyle.startTime}
          />
        </Row>
        <Row>
          <Time
            showLine={true}
            dailyWork={{ ...dailyWork, mark: 'endTime', placeholder: '结束时间' }}
            className={dynamicStyle.endTime}
          />
        </Row>
      </Col>
      <Col span={7} style={{ paddingLeft: '14px' }}>
        <Row>
          <Col span={4}>
            <InputNumber
              className={dynamicStyle.number}
              size={'small'}
              controls={false}
              addonAfter="%"
              value={dailyWork.proportion}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              className={dynamicStyle.number}
              controls={false}
              size={'small'}
              addonAfter="分"
              value={dailyWork.score}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              className={dynamicStyle.number}
              controls={false}
              size={'small'}
              addonAfter="h"
              value={dailyWork.cost}
            />
          </Col>
          <Col span={12}>
            {/* 删除 */}
            <DeleteIcon width={25} height={25} color={color} margin="0 0 0 5px" />
            {dailyWork.status === 'INITIAL' ? (
              // 完成
              <SuccessIcon width={21} height={21} color={color} margin="2px 0 0 10px" />
            ) : (
              // 待办
              <UndoOutlined className={dynamicStyle.todoIcon} />
            )}
            {/* 总结 */}
            <SolutionOutlined className={dynamicStyle.summaryIcon} />
            {/* 推到下一天 */}
            <ArrowRightIcon width={23} height={24} color={color} margin="2px 0 0 5px" />
            <FullscreenOutlined
              className={dynamicStyle.unFoldIcon}
              onClick={() => setFoldState(dailyWork.id, 'unfold')}
            />
          </Col>
        </Row>
        <Row>
          <Select
            value={dailyWork.targetId}
            className={dynamicStyle.target}
            options={targetOptions}
          />
        </Row>
      </Col>
      <Col span={15}>
        <Input.TextArea value={dailyWork.content} className={dynamicStyle.content} />
      </Col>
    </Row>
  );
}
