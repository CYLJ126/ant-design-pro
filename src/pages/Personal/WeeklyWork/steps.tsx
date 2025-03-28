import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Input, Row } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PlusSquareOutlined,
  SolutionOutlined,
  UndoOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import styles from './steps.less';
import { getSteps, saveSteps } from '@/services/ant-design-pro/dailyWork';
import { createStyles } from 'antd-style';

/**
 * 根据传入颜色，设置每条步骤的颜色
 * @param color 颜色
 */
const useStepStyle = (color) => {
  return createStyles(({ css }) => ({
    stepStyle: css`
      .ant-input-group-addon {
        border-color: ${color};
        background-color: ${color};
      }

      .ant-input {
        color: ${color};
        border-color: ${color};
      }
    `,
  }))();
};

function Step({ step, saveCurrentSteps }) {
  const { orderId: index, status, content: initialContent } = { ...step };
  const [content, setContent] = useState(initialContent);
  const { styles: dynamicStyle } = useStepStyle(status === 'INITIAL' ? '#81d3f8' : '#5bb1c9');
  return (
    <Input
      size="small"
      addonBefore={'Step' + index}
      className={dynamicStyle.stepStyle}
      addonAfter={
        <div>
          <ArrowUpOutlined
            onClick={() => saveCurrentSteps(index, 'up', '')}
            style={{ marginRight: '2px' }}
          />
          <ArrowDownOutlined
            onClick={() => saveCurrentSteps(index, 'down', '')}
            style={{ marginRight: '2px' }}
          />
          <PlusSquareOutlined
            onClick={() => saveCurrentSteps(index, 'add', '')}
            style={{ marginRight: '3px' }}
          />
          <MinusOutlined
            onClick={() => saveCurrentSteps(index, 'del', '')}
            style={{ marginRight: '3px' }}
          />
          {status === 'INITIAL' ? (
            <CheckOutlined
              onClick={() => saveCurrentSteps(index, 'done', '')}
              style={{ marginRight: '3px' }}
            />
          ) : (
            <UndoOutlined
              onClick={() => saveCurrentSteps(index, 'todo', '')}
              style={{ marginRight: '3px' }}
            />
          )}

          <SolutionOutlined />
        </div>
      }
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onBlur={(e) => saveCurrentSteps(index, 'save', e.target.value)}
    />
  );
}

export default function Steps({ target, deleteTarget, foldWeeklyWork }) {
  const { id: targetId } = target;
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
  const initialHeight = target.foldFlag === 'NO' ? 58 : fold ? 115 : steps.length * 30;
  const [height, setHeight] = useState(initialHeight);
  const toggleFold = () => {
    setFold(!fold);
    if (steps.length < 5 || !fold) {
      setHeight(115);
    } else {
      setHeight(steps.length * 30);
    }
  };

  /**
   * 保存当前步骤列表
   * 如果是在删除步骤，且当前只有一个步骤，则删除当前事项
   * @param index 指定步骤下标
   * @param type 操作类型，save-保存；del-删除当前步骤；add-在当前步骤后面添加新步骤；done-标记某个步骤为完成及todo-标记某个步骤为待办；
   * @param content 当前步骤调整内容
   */
  function saveCurrentSteps(index: number, type, content) {
    let tempSteps = [];
    if (index === 1 && type === 'del' && steps.length === 1) {
      // 如果只有一个步骤，且还是删除，则说明删完了步骤，则当前事项直接删除
      deleteTarget(targetId);
      return;
    } else if (type === 'up' || type === 'down') {
      if (index === 1 && type === 'up') {
        // 第一个不能再往上调顺序
        return;
      } else if (index === steps.length && type === 'down') {
        // 最后一个不能再往下调顺序
        return;
      } else if (1 === steps.length) {
        // 只有一个步骤时不能调顺序
        return;
      } else {
        tempSteps = [...steps];
        const swap = tempSteps[index - 1];
        let toIndex = index - 1 + (type === 'up' ? -1 : 1);
        const toSwap = tempSteps[toIndex];
        tempSteps[toIndex] = swap;
        tempSteps[index - 1] = toSwap;
      }
    } else {
      let newIndex = 0;
      // 生成列表的标识，每次渲染都不一样，因为使用 key（即下标）时，两次渲染时 key 一样，导致新增一行新步骤会有 bug。
      const date = new Date();
      const time = date.toLocaleTimeString();
      for (let i = 1; i <= steps.length; i++) {
        if (i === index) {
          if (type === 'save') {
            steps[i - 1].content = content;
          } else if (type === 'done') {
            steps[i - 1].status = 'DONE';
          } else if (type === 'todo') {
            steps[i - 1].status = 'INITIAL';
          } else if (type === 'del') {
            // 如果当前操作是删除，且下标等于指定下标，则删除当前步骤，即不添加到新的容器中
            continue;
          }
        }

        tempSteps.push({
          orderId: newIndex + 1,
          uuid: time + newIndex + 1,
          targetId: targetId,
          status: steps[i - 1].status ?? 'INITIAL',
          summaryId: steps[i - 1].summaryId,
          progress: steps[i - 1].progress,
          content: steps[i - 1].content,
        });
        newIndex++;
        if (i === index && type === 'add') {
          // 增加一行空步骤
          tempSteps.push({
            orderId: newIndex + 1,
            uuid: time + newIndex + 1,
            targetId: targetId,
            status: 'INITIAL',
            content: '',
            progress: 0,
          });
          newIndex++;
        }
      }
    }
    // setSteps(tempSteps);
    saveSteps(tempSteps).then((result) => {
      setSteps(result);
    });
    if (!fold) {
      setHeight(tempSteps.length * 30);
    }
  }

  const time = new Date().getTime();
  return (
    <Row>
      <Col span={23}>
        <ul className={styles.wrapper} style={{ height: height + 'px' }}>
          {steps.map((item) => (
            <li key={item.orderId + '_' + time} className={styles.itemStep}>
              <Step step={item} saveCurrentSteps={saveCurrentSteps} />
            </li>
          ))}
        </ul>
      </Col>
      <Col span={1} className={styles.myIconCol}>
        <FastBackwardOutlined
          className={styles.myIconJump}
          onClick={() => {
            navigateTo('/Personal/DailyWork');
          }}
        />
        <br />
        <FastForwardOutlined
          className={styles.myIconJump}
          onClick={() => {
            navigateTo('/Personal/MonthlyWork');
          }}
        />
        <br />
        {target.foldFlag === 'YES' ? (
          // 折叠
          <FullscreenExitOutlined
            className={styles.myIconFold}
            onClick={() => {
              foldWeeklyWork(target, 'NO');
              setHeight(58);
            }}
          />
        ) : (
          // 展开
          <FullscreenOutlined
            className={styles.myIconFold}
            onClick={() => {
              foldWeeklyWork(target, 'YES');
              setHeight(115);
            }}
          />
        )}
        <br />
        {fold ? (
          // 展开
          <VerticalAlignBottomOutlined onClick={toggleFold} className={styles.myIconFold} />
        ) : (
          // 折叠
          <VerticalAlignTopOutlined onClick={toggleFold} className={styles.myIconFold} />
        )}
      </Col>
    </Row>
  );
}
