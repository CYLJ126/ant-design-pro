import React, { useRef } from 'react';
import { ActionButton, SimpleTable, TableColumn } from '@/components';

import { message } from 'antd';

const ExamplePage: React.FC = () => {
  const tableRef = useRef<any>(null);

  // 模拟后端数据请求
  const fetchTableData = async (params: any) => {
    // 实际项目中替换为真实API请求
    console.log('请求参数:', params);

    // 模拟延迟
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('数据已准备好'); // 正确使用resolve
      }, 100);
    });

    // 模拟API响应
    const page = params.currentPage || 1;
    const pageSize = params.pageSize || 10;

    return {
      code: '100000',
      success: true,
      currentPage: page,
      totalPage: 10,
      rows: Array.from({ length: pageSize }, (_, i) => ({
        id: i + (page - 1) * pageSize,
        name: `项目 ${i + (page - 1) * pageSize}`,
        amount: Math.random() * 1000,
        date: new Date().toISOString(),
        status: i % 3 === 0 ? '成功' : '处理中',
        creator: '张三',
        description: '这是一条描述',
        sex: '男',
        age: 29,
        city: '上海',
        address: '上海浦东新区',
      })),
      statistics: {
        总笔数: 85,
        总金额: '¥12,345.67',
        成功笔数: 28,
      },
    };
  };

  // 表格列配置（按顺序排列）
  const columns: TableColumn[] = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 100,
      sorter: true,
      order: 1,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 150,
      sorter: true,
      order: 2,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 180,
      sorter: true,
      order: 3,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      order: 4,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
      order: 4,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 800,
      order: 4,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      order: 4,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 60,
      order: 4,
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: 120,
      order: 4,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 180,
      order: 4,
    },
  ];

  // 操作按钮
  const actionButtons: ActionButton[] = [
    {
      text: '新建项目',
      handler: () => message.info('新建项目操作'),
    },
    {
      text: '批量处理',
      handler: (selectedRows) => message.info(`批量处理 ${selectedRows?.length || 0} 个项目`),
      requiresSelection: true,
    },
    {
      text: '导出数据',
      handler: () => {
        if (tableRef.current) {
          tableRef.current.refresh();
          message.success('数据已刷新');
        }
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <SimpleTable
        ref={tableRef}
        columns={columns}
        fetchData={fetchTableData}
        tableHeight={760}
        actionButtons={actionButtons}
        initialParams={{ status: 'active' }}
        defaultPageSize={20}
      />
    </div>
  );
};

export default ExamplePage;
