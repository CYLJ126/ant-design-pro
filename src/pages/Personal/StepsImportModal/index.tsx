import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'antd';
import { SimpleTable } from '@/components';
import { getSteps } from '@/services/ant-design-pro/dailyWork';

const StepsImportModal = forwardRef(
  ({ originalContent = '', id, dwType, closeAfterAction = true, setContent }, ref) => {
    const tableColumns = [
      {
        title: '序号',
        dataIndex: 'orderId',
        width: 60,
        sorter: true,
        order: 1,
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: 300,
        sorter: false,
        order: 2,
      },
    ];

    const [open, setOpen] = useState(false);

    const importData = (action: 'cover' | 'append', steps: any[]) => {
      let append = steps.toSorted((a, b) => a.orderId - b.orderId).join('\n');
      if (action === 'cover') {
        setContent(append);
      } else {
        setContent(originalContent + '\n' + append);
      }
      if (closeAfterAction) {
        setOpen(false);
      }
    };

    const fetchData = async () => {
      return await getSteps(id, dwType);
    };

    // 暴露刷新方法给父组件
    useImperativeHandle(ref, () => ({
      open: (open) => setOpen(open),
    }));

    return (
      <Modal
        title="从上级步骤导入"
        open={open}
        onCancel={() => setOpen(false)}
        afterClose={() => Modal.destroyAll()}
        footer={null}
      >
        <SimpleTable
          columns={tableColumns}
          defaultPageSize={10}
          actionButtons={[
            {
              text: '覆盖',
              handler: (selectedRows) => importData('cover', selectedRows),
            },
            {
              text: '追加',
              handler: (selectedRows) => importData('append', selectedRows),
            },
          ]}
          fetchData={fetchData}
        />
      </Modal>
    );
  },
);

export default StepsImportModal;
