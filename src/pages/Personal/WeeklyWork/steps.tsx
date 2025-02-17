import React, { useEffect, useState } from 'react';
import { Col, Input, Row } from 'antd';
import {
  ExportOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  PlusSquareOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import styles from './steps.less';
import { getSteps } from '@/services/ant-design-pro/dailyWork';

function save(index: number, content: string) {
  console.log('下标：' + index + '，内容：' + content);
}

function Step({ index, initialContent, addStep }) {
  const [content, setContent] = useState(initialContent);
  return (
    <Input
      size="small"
      addonBefore={'Step' + (index + 1)}
      addonAfter={
        <div>
          <PlusSquareOutlined onClick={() => addStep(index)} style={{ marginRight: '3px' }} />
          <SolutionOutlined />
        </div>
      }
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onPressEnter={(e) => save(index, e.target.value)}
      onBlur={(e) => save(index, e.target.value)}
    />
  );
}

export default function Steps({ itemId }) {
  const [steps, setSteps] = useState();

  useEffect(() => {
    getSteps(itemId).then((result) => {
      setSteps(result);
    });
  }, [itemId]);

  // true-收起；false-展开
  const [fold, setFold] = useState(true);
  // steps 高度，收起时为 115px，展开时为 步骤数 * 30
  const [height, setHeight] = useState(fold ? 115 : steps.length * 30);
  const toggleFold = () => {
    setFold(!fold);
    if (steps.length < 5 || !fold) {
      setHeight(115);
    } else {
      setHeight(steps.length * 30);
    }
  };

  /**
   * 在指定步骤后面添加一行新步骤
   * @param index 指定步骤下标
   */
  function addStep(index: number) {
    let tempSteps = [];
    let newIndex = 0;
    // 生成列表的标识，每次渲染都不一样，因为使用 key（即下标）时，两次渲染时 key 一样，导致新增一行新步骤会有 bug。
    const date = new Date();
    const time = date.toLocaleTimeString();
    for (let i = 0; i < steps.length; i++) {
      tempSteps.push({ key: newIndex, uuid: time + newIndex, content: steps[i].content });
      newIndex++;
      if (i === index) {
        // 增加一行空步骤
        tempSteps.push({ key: newIndex, uuid: time + newIndex, content: '' });
        newIndex++;
      }
    }
    setSteps(tempSteps);
    if (!fold) {
      setHeight(tempSteps.length * 30);
    }
  }

  return (
    <Row>
      <Col span={23}>
        <ul className={styles.wrapper} style={{ height: height + 'px' }}>
          {steps
            .sort((a, b) => a.key < b.key)
            .map((item) => (
              <li key={item.uuid} className={styles.itemStep}>
                <Step index={item.key} initialContent={item.content} addStep={addStep} />
              </li>
            ))}
        </ul>
      </Col>
      <Col span={1} className={styles.myIconCol}>
        <FastBackwardOutlined className={styles.myIconJump} />
        <br />
        <FastForwardOutlined className={styles.myIconJump} />
        <br />
        <ExportOutlined className={styles.myIconContinue} />
        <br />
        {fold ? (
          <FullscreenOutlined onClick={toggleFold} className={styles.myIconFold} />
        ) : (
          <FullscreenExitOutlined onClick={toggleFold} className={styles.myIconFold} />
        )}
      </Col>
    </Row>
  );
}
