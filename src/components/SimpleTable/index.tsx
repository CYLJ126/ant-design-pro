import React, { useCallback, useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { Button, Checkbox, Col, message, Row, Space, Table, Typography } from 'antd';
import type { ColumnType, TableProps } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';

export interface Statistics {
  [key: string]: number | string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface QueryParams {
  [key: string]: any;
}

export interface ActionButton {
  text: string;
  handler: (selectedRows?: any[]) => void;
  requiresSelection?: boolean;
}

export interface TableColumn extends ColumnType<any> {
  dataIndex?: string;
  title: string;
  width?: number;
  sorter?: boolean;
  fixed?: 'left' | 'right';
  order?: number; // 列显示顺序
}

export interface ApiResponse {
  code: string;
  success: boolean;
  currentPage: number;
  totalPage: number;
  data: any[];
  statistics: Statistics;
}

export interface AdvancedTableProps {
  columns: TableColumn[];
  fetchData: (
    params: QueryParams & {
      currentPage: number;
      pageSize: number;
      sortField?: string;
      sortOrder?: 'ascend' | 'descend';
    },
  ) => Promise<ApiResponse>;
  initialParams?: QueryParams;
  actionButtons?: ActionButton[];
  rowKey?: string;
  defaultPageSize?: number;
}

const SimpleTable = forwardRef((props, ref) => {
  const {
    columns,
    fetchData,
    initialParams = {},
    actionButtons = [],
    rowKey = 'id',
    defaultPageSize = 10,
  } = props;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [statistics, setStatistics] = useState<Statistics>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sorter, setSorter] = useState<{ field?: string; order?: 'ascend' | 'descend' }>({});
  const [queryParams, setQueryParams] = useState<QueryParams>(initialParams);

  // 处理列排序和添加固定列
  const getProcessedColumns = useCallback((): TableColumn[] => {
    // 按order排序
    const sortedColumns = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return [
      ...sortedColumns.map((col) => ({
        ...col,
        sorter: col.sorter ? true : undefined,
      })),
    ];
  }, [columns, selectedRowKeys, rowKey, pagination.current, pagination.pageSize]);

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...queryParams,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
      };

      const response = await fetchData(params);

      if (response.success) {
        setData(response.data);
        setStatistics(response.statistics || {});
        setPagination((prev) => ({
          ...prev,
          total: response.totalPage * pagination.pageSize,
        }));

        // 重置选中状态
        setSelectedRowKeys([]);
        setSelectedRows([]);
      }
    } catch (error) {
      message.error('加载数据失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, queryParams, pagination.current, pagination.pageSize, sorter.field, sorter.order]);

  // 处理分页变化
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination({
      current: page,
      pageSize: pageSize ?? pagination.pageSize,
      total: pagination.total,
    });
  };

  // 处理排序变化
  const handleTableChange: TableProps<any>['onChange'] = (
    _,
    filters,
    sorterResult: SorterResult<any> | SorterResult<any>[],
  ) => {
    const sorterArray = Array.isArray(sorterResult) ? sorterResult : [sorterResult];
    const validSorter = sorterArray.find((s) => s.column?.sorter && s.order);

    if (validSorter) {
      setSorter({
        field: validSorter.field as string,
        order: validSorter.order === 'ascend' ? 'ascend' : 'descend',
      });
    } else {
      setSorter({});
    }
  };

  /*  // 处理选择变化
    const handleSelectChange = (checked: boolean, record: any) => {
      const key = record[rowKey];
      const newSelectedRowKeys = checked
        ? [...selectedRowKeys, key]
        : selectedRowKeys.filter(k => k !== key);

      const newSelectedRows = checked
        ? [...selectedRows, record]
        : selectedRows.filter(row => row[rowKey] !== key);

      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(newSelectedRows);
    };*/

  // 处理全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const keys = data.map((item) => item[rowKey]);
      setSelectedRowKeys(keys);
      setSelectedRows(data);
    } else {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };

  // 格式化统计信息
  const formatStatistics = (stats: Statistics): string => {
    return Object.entries(stats)
      .map(([key, value]) => `${key}：${value}`)
      .join('，');
  };

  // 当查询参数变化时重置到第一页
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [queryParams]);

  // 监听参数变化自动刷新
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, sorter, queryParams, loadData]);

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refresh: () => loadData(),
    setQueryParams: (params: QueryParams) => setQueryParams(params),
    getSelectedRows: () => selectedRows,
  }));

  return (
    <div>
      {/* 按钮行 */}
      {actionButtons.length > 0 && (
        <div className="table-action-bar" style={{ marginBottom: 16 }}>
          <Space>
            {actionButtons.map((btn, index) => (
              <Button
                key={index}
                type="primary"
                disabled={btn.requiresSelection && selectedRows.length === 0}
                onClick={() => btn.handler(selectedRows)}
              >
                {btn.text}
              </Button>
            ))}
          </Space>
        </div>
      )}

      {/* 统计行和全选 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          {Object.keys(statistics).length > 0 && (
            <Typography.Text strong>{formatStatistics(statistics)}</Typography.Text>
          )}
        </Col>
        <Col>
          {data.length > 0 && (
            <Space>
              <Checkbox
                indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
                checked={selectedRowKeys.length === data.length && data.length > 0}
                onChange={handleSelectAll}
              >
                全选当页
              </Checkbox>
              <span>已选择 {selectedRowKeys.length} 项</span>
            </Space>
          )}
        </Col>
      </Row>

      {/* 表格 */}
      <Table
        columns={getProcessedColumns()}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePaginationChange,
          onShowSizeChange: (current, size) => handlePaginationChange(1, size),
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        sticky
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedRows(selectedRows);
          },
          getCheckboxProps: (record) => ({
            disabled: record.disabled,
          }),
        }}
      />
    </div>
  );
});

export default SimpleTable;
