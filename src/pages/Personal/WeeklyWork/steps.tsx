import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Input, Row } from 'antd';
import {
  ExportOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PlusSquareOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import styles from './steps.less';
import { getSteps, saveSteps } from '@/services/ant-design-pro/dailyWork';

function save(index: number, content: string) {
  console.log('下标：' + index + '，内容：' + content);
}

function Step({ index, initialContent, addOrDeleteStep }) {
  const [content, setContent] = useState(initialContent);
  return (
    <Input
      size="small"
      addonBefore={'Step' + (index + 1)}
      addonAfter={
        <div>
          <PlusSquareOutlined
            onClick={() => addOrDeleteStep(index, false)}
            style={{ marginRight: '3px' }}
          />
          <MinusOutlined
            onClick={() => addOrDeleteStep(index, true)}
            style={{ marginRight: '3px' }}
          />
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

export default function Steps({ targetId, deleteTarget }) {
  const [steps, setSteps] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    getSteps(targetId).then((result) => {
      setSteps(result);
    });
  }, [targetId]);

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
   * 在指定步骤后面添加一行新步骤，或删除当前步骤
   * 如果是在删除步骤，且当前只有一个步骤，则删除当前事项
   * @param index 指定步骤下标
   * @param isDel true-删除当前步骤；false-在当前步骤后面添加新步骤；
   */
  function addOrDeleteStep(index: number, isDel: boolean) {
    if (index === 0 && isDel && steps.length === 1) {
      // 如果只有一个步骤，且还是删除，则说明删完了步骤，则当前事项直接删除
      deleteTarget(targetId);
      return;
    }
    let tempSteps = [];
    let newIndex = 0;
    // 生成列表的标识，每次渲染都不一样，因为使用 key（即下标）时，两次渲染时 key 一样，导致新增一行新步骤会有 bug。
    const date = new Date();
    const time = date.toLocaleTimeString();
    for (let i = 0; i < steps.length; i++) {
      if (isDel && i === index) {
        // 如果当前操作是删除，且下标等于指定下标，则删除当前步骤，即不添加到新的容器中
        continue;
      }
      tempSteps.push({ key: newIndex, uuid: time + newIndex, content: steps[i].content });
      newIndex++;
      if (i === index && !isDel) {
        // 增加一行空步骤
        tempSteps.push({ key: newIndex, uuid: time + newIndex, content: '' });
        newIndex++;
      }
    }
    setSteps(tempSteps);
    saveSteps(targetId, tempSteps);
    if (!fold) {
      setHeight(tempSteps.length * 30);
    }
  }

  return (
    <Row>
      <Col span={23}>
        <ul className={styles.wrapper} style={{ height: height + 'px' }}>
          {steps
            .sort((a, b) => a.key - b.key)
            .map((item) => (
              <li key={item.uuid} className={styles.itemStep}>
                <Step
                  index={item.key}
                  initialContent={item.content}
                  addOrDeleteStep={addOrDeleteStep}
                />
              </li>
            ))}
        </ul>
      </Col>
      <Col span={1} className={styles.myIconCol}>
        <FastBackwardOutlined
          className={styles.myIconJump}
          onClick={() => {
            navigateTo('/personal/daily-work');
          }}
        />
        <br />
        <FastForwardOutlined
          className={styles.myIconJump}
          onClick={() => {
            navigateTo('/personal/monthly-work');
          }}
        />
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
