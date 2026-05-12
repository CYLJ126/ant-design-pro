import React from 'react';
import { createStyles } from 'antd-style';
import { PlusSquareOutlined, ReloadOutlined, SolutionOutlined } from '@ant-design/icons';

export interface DailyActionsProps {
  score?: number;
  cost?: number;
  proportion?: number;
  todoWork?: number;
  completedWork?: number;
  onRefresh?: () => void;
  onAddNew?: () => void;
  onSummary?: () => void;
  theme?: {
    primaryColor?: string;
    proportionColor?: string;
  };
}

const useStyles = createStyles((theme: any) => ({
  scoreItem: {
    width: '65px',
    height: '30px',
    marginRight: '8px',
    padding: '1px',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    color: theme.primaryColor || '#81d3f8',
    borderRadius: '5px',
    border: `2px solid ${theme.primaryColor || '#81d3f8'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  proportion: {
    width: '58px',
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
    width: '95px',
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
    color: '#5cb3cc',
    borderColor: '#5cb3cc',
  },

  todoItems: {
    color: theme.primaryColor || '#81d3f8',
    borderColor: theme.primaryColor || '#81d3f8',
  },

  actionButton: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '5px',
    marginRight: '5px',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    svg: {
      width: '30px',
      height: '30px',
      color: theme.primaryColor || '#81d3f8',
    },
  },
}));

const DailyActions: React.FC<DailyActionsProps> = ({
  score = 0,
  cost = 0,
  proportion = 0,
  todoWork = 0,
  completedWork = 0,
  onRefresh,
  onAddNew,
  onSummary,
  theme = {},
}) => {
  const { styles } = useStyles(theme);

  return (
    <>
      {/* 得分 */}
      <span className={styles.scoreItem}>{score}分</span>

      {/* 小时数 */}
      <span className={styles.scoreItem}>{cost}h</span>

      {/* 占比 */}
      <span className={styles.proportion}>{proportion}%</span>

      {/* 完成项 */}
      <span className={`${styles.itemCount} ${styles.completedItems}`}>
        完成项 - {completedWork}
      </span>

      {/* 待办项 */}
      <span className={`${styles.itemCount} ${styles.todoItems}`}>待办项 - {todoWork}</span>

      {/* 刷新 */}
      <ReloadOutlined className={styles.actionButton} onClick={onRefresh} />

      {/* 新增 */}
      <PlusSquareOutlined className={styles.actionButton} onClick={onAddNew} />

      {/* 总结 */}
      <SolutionOutlined className={styles.actionButton} onClick={onSummary} />
    </>
  );
};

export default DailyActions;
