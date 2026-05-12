import React from 'react';
import { createStyles } from 'antd-style';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

export interface WeeklyActionsProps {
  score?: number;
  proportion?: number;
  completedWork?: number;
  todoWork?: number;
  overdueWork?: number;
  onAddNew?: () => void;
  onStatistics?: () => void;
  onRefresh?: () => void;
  onSummary?: () => void;
  theme?: {
    primaryColor?: string;
    proportionColor?: string;
  };
}

const useStyles = createStyles((theme: any) => ({
  scoreItem: {
    width: '70px',
    height: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    color: theme.primaryColor || '#81d3f8',
    borderRadius: '5px',
    padding: '1px',
    marginRight: '8px',
    border: `2px solid ${theme.primaryColor || '#81d3f8'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  proportion: {
    width: '65px',
    height: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    borderRadius: '5px',
    padding: '1px',
    marginRight: '8px',
    color: theme.proportionColor || theme.primaryColor || '#81d3f8',
    border: `2px solid ${theme.proportionColor || theme.primaryColor || '#81d3f8'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemCount: {
    width: '105px',
    height: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    borderRadius: '5px',
    padding: '1px',
    marginRight: '8px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completedItems: {
    color: '#5bb1c9',
    borderColor: '#5bb1c9',
  },

  todoItems: {
    color: theme.primaryColor || '#81d3f8',
    borderColor: theme.primaryColor || '#81d3f8',
  },

  overdueItems: {
    color: '#f88a22',
    borderColor: '#f88a22',
  },

  actionButton: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '2px',
    marginRight: '5px',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    svg: {
      width: '32px',
      height: '32px',
      color: theme.primaryColor || '#81d3f8',
    },
  },
}));

const WeeklyActions: React.FC<WeeklyActionsProps> = ({
  score = 0,
  proportion = 0,
  completedWork = 0,
  todoWork = 0,
  overdueWork = 0,
  onAddNew,
  onStatistics,
  onRefresh,
  onSummary,
  theme = {},
}) => {
  const { styles } = useStyles(theme);

  return (
    <>
      {/* 得分 */}
      <span className={styles.scoreItem}>{score}分</span>

      {/* 占比 */}
      <span className={styles.proportion}>{proportion}%</span>

      {/* 完成项 */}
      <span className={`${styles.itemCount} ${styles.completedItems}`}>
        完成项 - {completedWork}
      </span>

      {/* 待办项 */}
      <span className={`${styles.itemCount} ${styles.todoItems}`}>待办项 - {todoWork}</span>

      {/* 逾期项 */}
      <span className={`${styles.itemCount} ${styles.overdueItems}`}>逾期项 - {overdueWork}</span>

      {/* 添加新目标 */}
      <PlusSquareOutlined className={styles.actionButton} onClick={onAddNew} />

      {/* 周统计数据 */}
      <BarChartOutlined className={styles.actionButton} onClick={onStatistics} />

      {/* 刷新数据 */}
      <ReloadOutlined className={styles.actionButton} onClick={onRefresh} />

      {/* 总结 */}
      <SolutionOutlined className={styles.actionButton} onClick={onSummary} />
    </>
  );
};

export default WeeklyActions;
