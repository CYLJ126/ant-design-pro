import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import { SearchFieldConfig } from '@/components/SearchForm/SearchFormTypes';

const ExamplePage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const searchFields: SearchFieldConfig[] = [
    {
      fieldName: 'keyword',
      fieldType: 'input',
      label: '关键词',
      placeholder: '请输入关键词',
      debounce: 300,
      alwaysShow: true,
    },
    {
      fieldName: 'status',
      fieldType: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    {
      fieldName: 'dateRange',
      fieldType: 'dateRangePicker',
      label: '创建时间范围',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD',
      transformFunction: (value) => {
        if (value && value.length === 2) {
          return {
            startDate: value[0].format('YYYY-MM-DD'),
            endDate: value[1].format('YYYY-MM-DD'),
          };
        }
        return null;
      },
    },
    {
      fieldName: 'merchant',
      fieldType: 'select',
      label: '商户',
      placeholder: '请选择商户',
      optionUrl: '/api/merchants',
      optionKeyMap: { label: 'name', value: 'id' },
    },
    {
      fieldName: 'orgCode',
      fieldType: 'multiSelect',
      label: '机构代码',
      placeholder: '请选择机构',
      optionUrl: '/api/organizations',
      dependOn: [{ field: 'merchant', paramKey: 'merchantId' }],
    },
    {
      fieldName: 'amountRange',
      fieldType: 'numberRange',
      label: '金额大小区间',
      joinFunction: (values) => values.join('-'),
    },
    {
      fieldName: 'isDeleted',
      fieldType: 'switch',
      label: '是否删除',
      defaultValue: false,
    },
    {
      fieldName: 'areaCheckbox',
      fieldType: 'checkboxGroup',
      label: '区域选择',
      placeholder: '请选择区域',
      options: [
        { label: '北京', value: 1 },
        { label: '上海', value: 2 },
        { label: '杭州', value: 3 },
      ],
    },
    {
      fieldName: 'sizeMultiSelect',
      fieldType: 'multiSelect',
      label: '尺寸选择',
      placeholder: '请选择尺寸',
      options: [
        { label: '大', value: 1 },
        { label: '中', value: 2 },
        { label: '小', value: 3 },
      ],
    },
    {
      fieldName: 'areaCheckbox',
      fieldType: 'slider',
      label: '价格区间',
      placeholder: '请选择价格区间',
      defaultValue: [100, 200],
      extraProps: {
        min: 0,
        max: 1000,
        step: 10,
      },
    },
    {
      fieldName: 'password',
      fieldType: 'password',
      label: '密码',
      placeholder: '请输入密码',
    },
    {
      fieldName: 'rate',
      fieldType: 'rate',
      label: '评分',
      placeholder: '请选择评分',
      extraProps: {
        allowHalf: true,
      },
    },
    {
      fieldName: 'lastModifyTime',
      fieldType: 'datePicker',
      label: '最后修改时间',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      extraProps: {
        showTime: true,
      },
    },
  ];

  const handleSearch = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      console.log('搜索参数:', values);
      // 调用API获取数据
      // const response = await fetchTableData(values);
      // setTableData(response.data);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (values: Record<string, any>) => {
    console.log('重置后的值:', values);
  };

  return (
    <div>
      <SearchForm
        gutter={[8, 8]}
        fields={searchFields}
        size="middle"
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
        collapsible={true}
        defaultCollapsed={false}
        collapsedRows={1}
        searchShortcut="Enter"
        resetShortcut="r"
      />
    </div>
  );
};

export default ExamplePage;
