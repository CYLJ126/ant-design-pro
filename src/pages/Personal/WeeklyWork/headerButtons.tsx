import React, { useEffect, useRef, useState } from 'react';
import { Row, Select } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  SolutionOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './headerButtons.less';
import {
  getWeekStatistics,
  summaryForWeek,
  updateWeeklyStatistics,
} from '@/services/ant-design-pro/dailyWork';
import { useModel } from 'umi';
import ContentPanel, { ContentPanelRef } from '@/pages/Personal/Summary/contentPanel';

function getWeekOptions(currentWeek) {
  if (currentWeek === 0) {
    return [];
  }
  let options = [];
  for (let i = currentWeek - 3; i <= currentWeek + 3; i++) {
    options.push({ value: i, label: '第 ' + i + ' 周' });
  }
  return options;
}

export default function HeaderButtons({ whichWeek, toggleWeek }) {
  const [weekInfo, setWeekInfo] = useState({
    aimId: whichWeek,
    score: 0,
    proportion: 0,
    completedWork: 0,
    todoWork: 0,
    overdueWork: 0,
  });
  const { addNewTarget, initialTargets } = useModel('targetsModel');
  const { updateInfo: targetChangeTip } = useModel('targetUpdateModel');
  const [weekOptions, setWeekOptions] = useState([]);
  // 总结弹窗
  const summaryModalRef = useRef<ContentPanelRef>();

  /**
   * 显示周统计和周总结
   */
  function showWeeklyStatistics(whichWeek) {
    console.log('周统计: ' + whichWeek);
  }

  /**
   * 刷新周统计数据
   */
  function refreshStatistics(whichWeek) {
    updateWeeklyStatistics(whichWeek).then((result) => setWeekInfo(result));
    initialTargets(whichWeek).then();
  }

  /**
   * 复制为总结内容
   */
  function summary() {
    summaryForWeek(whichWeek).then((result) => {
      summaryModalRef.current?.openModal();
      summaryModalRef.current?.initialContent(result);
    });
  }

  useEffect(() => {
    // 加载表头——周统计信息
    if (whichWeek !== 0) {
      getWeekStatistics(whichWeek).then((result) => setWeekInfo({ ...result, aimId: whichWeek }));
      setWeekOptions(getWeekOptions(whichWeek));
    }
  }, [whichWeek, targetChangeTip]);

  useEffect(() => {
    // 加载表头——周统计信息
    if (weekInfo.proportion > 100) {
      document.documentElement.style.setProperty('--proportion-color', '#ff0000');
    } else if (weekInfo.proportion === 100) {
      document.documentElement.style.setProperty('--proportion-color', '#5bb1c9');
    } else {
      document.documentElement.style.setProperty('--proportion-color', '#81d3f8');
    }
  }, [weekInfo.proportion]);

  return (
    <div className={styles.wrapper}>
      <Row wrap={false} style={{ marginTop: '5px' }}>
        {/* 向前一周 */}
        <VerticalRightOutlined
          className={styles.forwardWeek}
          onClick={() => {
            toggleWeek('former');
            setWeekOptions(getWeekOptions(whichWeek - 1));
          }}
        />
        <Select
          className={styles.whichWeek}
          options={weekOptions}
          value={'第 ' + whichWeek + ' 周'}
          onSelect={(value) => {
            toggleWeek('select', value);
            setWeekOptions(getWeekOptions(value));
          }}
        />
        {/* 向后一周 */}
        <VerticalLeftOutlined
          className={styles.forwardWeek}
          onClick={() => {
            toggleWeek('latter');
            setWeekOptions(getWeekOptions(whichWeek + 1));
          }}
        />
        {/* 得分 */}
        <span className={styles.weeklyScore}>{'' + weekInfo.score + '分'}</span>
        {/* 占比 */}
        <span key={new Date().getTime()} className={styles.proportion}>
          {'' + weekInfo.proportion + '%'}
        </span>
        <span className={`${styles.itemCount} ${styles.completedItems}`}>
          {'完成项 - ' + weekInfo.completedWork}
        </span>
        <span className={`${styles.itemCount} ${styles.todoItems}`}>
          {'待办项 - ' + weekInfo.todoWork}
        </span>
        <span className={`${styles.itemCount} ${styles.overdueItems}`}>
          {'逾期项 - ' + weekInfo.overdueWork}
        </span>
        {/* 添加新目标 */}
        <PlusSquareOutlined onClick={() => addNewTarget(whichWeek)} className={styles.plusItem} />
        {/* 周统计数据 */}
        <BarChartOutlined
          onClick={() => showWeeklyStatistics(whichWeek)}
          className={styles.statistics}
        />
        {/* 刷新数据 */}
        <ReloadOutlined onClick={() => refreshStatistics(whichWeek)} className={styles.refresh} />
        {/* 总结 */}
        <SolutionOutlined className={styles.showSummary} onClick={() => summary()} />
      </Row>
      <ContentPanel ref={summaryModalRef} />
    </div>
  );
}
