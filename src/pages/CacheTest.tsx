// src/pages/CacheTest.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Card, Row, Col, Statistic, Button, Input, Timeline,
  Typography, Alert, Tag, Space, Divider, Table, Switch,
  message, Tabs, Progress, List
} from 'antd';
import type { TabsProps } from 'antd';
import {
  ExperimentOutlined, ClockCircleOutlined, DatabaseOutlined,
  ReloadOutlined, DeleteOutlined, InfoCircleOutlined,
  CheckCircleOutlined, WarningOutlined
} from '@ant-design/icons';
import { useActivate, useUnactivate, useAliveController } from 'react-activation';
import PageWrapper from '@/components/PageWrapper';

const { Title, Text } = Typography;

interface TimelineItem {
  id: string;
  time: string;
  action: string;
  type: 'system' | 'user' | 'cache';
  details?: any;
}

interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'pending';
  description: string;
  value?: any;
  expectedValue?: any;
}

// ==================== 独立 Tab 内容组件 ====================

const FunctionTestTab: React.FC<{
  activateCount: number;
  buttonClickCount: number;
  inputValue: string;
  onButtonClick: () => void;
  onInputChange: (value: string) => void;
}> = ({ activateCount, buttonClickCount, inputValue, onButtonClick, onInputChange }) => (
  <Row gutter={[16, 16]}>
    <Col span={6}>
      <Card>
        <Statistic
          title="页面激活次数"
          value={activateCount}
          suffix="次"
          valueStyle={{ color: activateCount > 1 ? '#3f8600' : '#cf1322' }}
        />
        <Text type="secondary">
          {activateCount > 1 ? '缓存正常工作' : '请切换页面后再回来'}
        </Text>
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="按钮点击次数"
          value={buttonClickCount}
          suffix="次"
          valueStyle={{ color: '#1890ff' }}
        />
        <Button
          type="primary"
          onClick={onButtonClick}
          style={{ marginTop: 8 }}
          block
        >
          点击测试 (+1)
        </Button>
      </Card>
    </Col>
    <Col span={6}>
      <Card title="输入框测试">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="输入内容测试缓存"
        />
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">
            当前: <Text code>{inputValue || '(空)'}</Text>
          </Text>
        </div>
      </Card>
    </Col>
    <Col span={6}>
      <Card title="缓存状态">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: activateCount > 1 ? '#52c41a' : '#ff4d4f',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {activateCount > 1 ? '✅ 缓存生效' : '⏳ 等待验证'}
          </div>
          <Text type="secondary">
            {activateCount > 1 ? '页面状态已缓存' : '需要切换页面验证'}
          </Text>
        </div>
      </Card>
    </Col>
  </Row>
);

const TestResultTab: React.FC<{
  testResults: TestResult[];
}> = ({ testResults }) => {
  const testColumns = [
    {
      title: '测试项',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = {
          pass: { color: 'success', icon: <CheckCircleOutlined />, text: '通过' },
          fail: { color: 'error', icon: <WarningOutlined />, text: '失败' },
          pending: { color: 'processing', icon: <ClockCircleOutlined />, text: '等待' }
        };
        const { color, icon, text } = config[status as keyof typeof config];
        return <Tag color={color} icon={icon}>{text}</Tag>;
      }
    },
    {
      title: '当前值',
      dataIndex: 'value',
      key: 'value',
      render: (value: any) => <Text code>{String(value)}</Text>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }
  ];

  return (
    <Card title="自动化测试结果">
      <Table
        dataSource={testResults}
        columns={testColumns}
        pagination={false}
        rowKey="id"
        size="small"
      />
    </Card>
  );
};

const TimelineTab: React.FC<{
  timeline: TimelineItem[];
  showDetails: boolean;
}> = ({ timeline, showDetails }) => (
  <Card
    title="操作时间线"
    extra={<Text type="secondary">共 {timeline.length} 条记录</Text>}
  >
    <Timeline
      items={timeline.map((item) => {
        const config = {
          system: { color: 'blue' as const, icon: <DatabaseOutlined /> },
          user: { color: 'green' as const, icon: <ExperimentOutlined /> },
          cache: { color: 'orange' as const, icon: <ReloadOutlined /> }
        };
        const { color, icon } = config[item.type];
        return {
          key: item.id,
          color,
          dot: icon,
          children: (
            <div>
              <Space>
                <Tag color={color}>
                  {item.type === 'system' ? '系统' : item.type === 'user' ? '用户' : '缓存'}
                </Tag>
                <Text strong>{item.time}</Text>
              </Space>
              <div>{item.action}</div>
              {showDetails && item.details && (
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {JSON.stringify(item.details)}
                  </Text>
                </div>
              )}
            </div>
          )
        };
      })}
    />
    {timeline.length === 0 && <Text type="secondary">暂无操作记录</Text>}
  </Card>
);

const CacheManagementTab: React.FC<{
  cacheNodes: any[];
  onCacheOperation: (operation: string, target?: string) => void;
}> = ({ cacheNodes, onCacheOperation }) => (
  <Card title="缓存节点管理">
    <List
      dataSource={cacheNodes}
      renderItem={(node: any) => (
        <List.Item
          actions={[
            <Button
              key="refresh"
              size="small"
              onClick={() => onCacheOperation('refresh', node.name)}
              icon={<ReloadOutlined />}
            >
              刷新
            </Button>,
            <Button
              key="delete"
              size="small"
              danger
              onClick={() => onCacheOperation('drop', node.name)}
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          ]}
        >
          <List.Item.Meta
            title={<Text code>{node.name}</Text>}
            description={`缓存节点 - 创建时间: ${new Date().toLocaleString()}`}
          />
        </List.Item>
      )}
      locale={{ emptyText: '暂无缓存节点' }}
    />
    <Divider />
    <Button
      danger
      onClick={() => onCacheOperation('clear')}
      icon={<DeleteOutlined />}
    >
      清空所有缓存
    </Button>
  </Card>
);

// ==================== 主内容组件 ====================

const CacheTestContent: React.FC = () => {
  const { getCachingNodes, drop, refresh, clear } = useAliveController();

  const [componentId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [renderTime] = useState(() => new Date().toLocaleTimeString());
  const [startTime] = useState(() => new Date().toLocaleTimeString());

  const [activateCount, setActivateCount] = useState(0);
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [autoTest, setAutoTest] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const autoTestTimer = useRef<NodeJS.Timeout>();
  const testCounter = useRef(0);
  const activateCountRef = useRef(0);
  const buttonClickCountRef = useRef(0);
  const inputValueRef = useRef('');

  // 用 ref 同步最新状态值，供回调使用
  useEffect(() => { activateCountRef.current = activateCount; }, [activateCount]);
  useEffect(() => { buttonClickCountRef.current = buttonClickCount; }, [buttonClickCount]);
  useEffect(() => { inputValueRef.current = inputValue; }, [inputValue]);

  const addTimelineItem = useCallback((action: string, type: TimelineItem['type'], details?: any) => {
    const item: TimelineItem = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      action,
      type,
      details
    };
    setTimeline(prev => [item, ...prev.slice(0, 49)]);
  }, []);

  const updateTestResults = useCallback(() => {
    const cacheNodes = getCachingNodes();
    const currentActivateCount = activateCountRef.current;
    const currentButtonClickCount = buttonClickCountRef.current;
    const currentInputValue = inputValueRef.current;

    const results: TestResult[] = [
      {
        id: 'component-persistence',
        name: '组件实例持久化',
        status: currentActivateCount > 1 ? 'pass' : 'pending',
        description: '组件ID在页面切换后保持不变',
        value: componentId,
        expectedValue: componentId
      },
      {
        id: 'render-time-stability',
        name: '渲染时间稳定性',
        status: currentActivateCount > 1 ? 'pass' : 'pending',
        description: '首次渲染时间在缓存恢复后保持不变',
        value: renderTime,
        expectedValue: renderTime
      },
      {
        id: 'state-persistence',
        name: '状态数据持久化',
        status: currentButtonClickCount > 0 && currentActivateCount > 1 ? 'pass' :
          currentButtonClickCount > 0 ? 'pending' : 'fail',
        description: '用户操作产生的状态在页面切换后保持',
        value: currentButtonClickCount,
        expectedValue: '> 0 且保持不变'
      },
      {
        id: 'input-persistence',
        name: '表单数据持久化',
        status: currentInputValue && currentActivateCount > 1 ? 'pass' :
          currentInputValue ? 'pending' : 'fail',
        description: '用户输入的表单数据在页面切换后保持',
        value: currentInputValue || '(空)',
        expectedValue: '保持用户输入'
      },
      {
        id: 'lifecycle-hooks',
        name: '生命周期钩子',
        status: currentActivateCount > 0 ? 'pass' : 'pending',
        description: 'useActivate 和 useUnactivate 钩子正确触发',
        value: `激活${currentActivateCount}次`,
        expectedValue: '正确触发'
      },
      {
        id: 'cache-manager',
        name: '缓存管理器',
        status: cacheNodes.length > 0 ? 'pass' : 'fail',
        description: 'AliveController 能正确获取缓存节点',
        value: `${cacheNodes.length}个节点`,
        expectedValue: '> 0'
      }
    ];

    setTestResults(results);
  }, [getCachingNodes, componentId, renderTime]);

  useActivate(() => {
    setActivateCount(prev => {
      const newCount = prev + 1;
      activateCountRef.current = newCount;
      addTimelineItem(
        newCount === 1 ? '页面首次激活' : `页面第${newCount}次激活 (从缓存恢复)`,
        'system',
        { activateCount: newCount, cacheRestored: newCount > 1 }
      );
      setTimeout(updateTestResults, 100);
      return newCount;
    });
  });

  useUnactivate(() => {
    addTimelineItem('页面失活，状态保存到缓存', 'system');
  });

  useEffect(() => {
    addTimelineItem('组件首次挂载', 'system', { componentId, renderTime });
    return () => {
      if (autoTestTimer.current) clearInterval(autoTestTimer.current);
    };
  }, []);

  useEffect(() => {
    if (autoTest) {
      autoTestTimer.current = setInterval(() => {
        testCounter.current++;
        addTimelineItem(`自动测试 #${testCounter.current}`, 'user');
        setButtonClickCount(prev => prev + 1);
      }, 2000);
    } else if (autoTestTimer.current) {
      clearInterval(autoTestTimer.current);
    }
    return () => {
      if (autoTestTimer.current) clearInterval(autoTestTimer.current);
    };
  }, [autoTest]);

  const handleButtonClick = useCallback(() => {
    setButtonClickCount(prev => {
      const next = prev + 1;
      buttonClickCountRef.current = next;
      addTimelineItem(`用户点击按钮 (第${next}次)`, 'user');
      setTimeout(updateTestResults, 100);
      return next;
    });
  }, [addTimelineItem, updateTestResults]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    inputValueRef.current = value;
    addTimelineItem(`用户输入: "${value}"`, 'user', { inputLength: value.length });
    setTimeout(updateTestResults, 100);
  }, [addTimelineItem, updateTestResults]);

  const handleCacheOperation = useCallback((operation: string, target?: string) => {
    try {
      switch (operation) {
        case 'refresh':
          if (target) refresh(target);
          addTimelineItem(`刷新缓存: ${target}`, 'cache');
          break;
        case 'drop':
          if (target) drop(target);
          addTimelineItem(`删除缓存: ${target}`, 'cache');
          break;
        case 'clear':
          clear();
          addTimelineItem('清空所有缓存', 'cache');
          break;
      }
      message.success(`缓存操作成功: ${operation}`);
      setTimeout(updateTestResults, 100);
    } catch (error) {
      message.error(`缓存操作失败: ${error}`);
      addTimelineItem(`缓存操作失败: ${operation}`, 'cache', { error });
    }
  }, [refresh, drop, clear, addTimelineItem, updateTestResults]);

  const resetTestData = useCallback(() => {
    setButtonClickCount(0);
    buttonClickCountRef.current = 0;
    setInputValue('');
    inputValueRef.current = '';
    setTimeline(prev => prev.slice(0, 5));
    setTestResults([]);
    addTimelineItem('重置测试数据', 'user');
    message.info('测试数据已重置');
  }, [addTimelineItem]);

  const cacheNodes = getCachingNodes();
  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const totalTests = testResults.length;
  const testProgress = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  // ✅ 关键修复：使用 useMemo 确保 items 正确响应状态变化
  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: '1',
      label: <span><ExperimentOutlined /> 功能测试</span>,
      children: (
        <FunctionTestTab
          activateCount={activateCount}
          buttonClickCount={buttonClickCount}
          inputValue={inputValue}
          onButtonClick={handleButtonClick}
          onInputChange={handleInputChange}
        />
      ),
    },
    {
      key: '2',
      label: <span><CheckCircleOutlined /> 测试结果</span>,
      children: <TestResultTab testResults={testResults} />,
    },
    {
      key: '3',
      label: <span><ClockCircleOutlined /> 操作时间线</span>,
      children: <TimelineTab timeline={timeline} showDetails={showDetails} />,
    },
    {
      key: '4',
      label: <span><DatabaseOutlined /> 缓存管理</span>,
      children: (
        <CacheManagementTab
          cacheNodes={cacheNodes}
          onCacheOperation={handleCacheOperation}
        />
      ),
    },
  ], [
    activateCount,
    buttonClickCount,
    inputValue,
    testResults,
    timeline,
    showDetails,
    cacheNodes,
    handleButtonClick,
    handleInputChange,
    handleCacheOperation,
  ]);

  return (
    <PageContainer
      title="KeepAlive 缓存测试中心"
      subTitle={`组件ID: ${componentId} | 启动时间: ${startTime}`}
      extra={[
        <Space key="actions">
          <Switch
            checked={autoTest}
            onChange={setAutoTest}
            checkedChildren="自动测试"
            unCheckedChildren="手动测试"
          />
          <Button onClick={resetTestData} icon={<ReloadOutlined />}>
            重置数据
          </Button>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            icon={<InfoCircleOutlined />}
          >
            {showDetails ? '隐藏' : '显示'}详情
          </Button>
        </Space>
      ]}
    >
      <Alert
        message={
          <Row align="middle">
            <Col flex="auto">
              <Space>
                <Tag color="blue">激活次数: {activateCount}</Tag>
                <Tag color="green">渲染时间: {renderTime}</Tag>
                <Tag color="orange">缓存节点: {cacheNodes.length}</Tag>
                <Tag color={testProgress === 100 ? 'success' : 'processing'}>
                  测试进度: {passedTests}/{totalTests}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Progress
                type="circle"
                size={40}
                percent={testProgress}
                format={percent => percent === 100 ? '✓' : `${Math.round(percent!)}%`}
              />
            </Col>
          </Row>
        }
        type={testProgress === 100 ? 'success' : 'info'}
        style={{ marginBottom: 16 }}
      />

      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={tabItems}
        size="large"
      />

      <Card style={{ marginTop: 16 }} title="使用说明">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>测试步骤：</Title>
            <ol>
              <li>在当前页面进行一些操作（点击按钮、输入内容）</li>
              <li>切换到其他页面</li>
              <li>再切换回当前页面</li>
              <li>检查"测试结果"选项卡中的验证结果</li>
            </ol>
          </Col>
          <Col span={12}>
            <Title level={4}>验证指标：</Title>
            <ul>
              <li><Text strong>激活次数递增：</Text>说明生命周期钩子正常</li>
              <li><Text strong>状态数据保持：</Text>说明组件状态被缓存</li>
              <li><Text strong>渲染时间不变：</Text>说明组件实例被复用</li>
              <li><Text strong>缓存节点存在：</Text>说明缓存管理器正常工作</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

const CacheTest: React.FC = () => {
  return (
    <PageWrapper>
      <CacheTestContent />
    </PageWrapper>
  );
};

export default CacheTest;
