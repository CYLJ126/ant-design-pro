import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { formatContent } from '@/services/ant-design-pro/base';

const width = {
  xs: '90%',
  sm: '80%',
  md: '70%',
  lg: '60%',
  xl: '60%',
  xxl: '60%',
};

/**
 * 总结面板
 */
const ContentPanel = forwardRef((ref) => {
  // 弹窗控制
  const [open, setOpen] = useState(false);
  // 总结内容
  const [content, setContent] = useState('');

  const format = (content, operationType) => {
    formatContent(content, operationType).then((result) => setContent(result));
  };

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    setOpen: (open) => setOpen(open),
    setContent: (content) => setContent(content),
  }));

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      afterClose={() => Modal.destroyAll()}
      footer={null}
      width={width}
    >
      <div>
        <div>
          <Button className={'my-button'} onClick={() => format(content, 'formatSerialNo')}>
            重新排序
          </Button>
          <Button className={'my-button'} onClick={() => format(content, 'removeTime')}>
            移除工时
          </Button>
        </div>
        <div>
          <Input.TextArea
            value={content}
            autoSize={{ minRows: 4 }}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
});
export default ContentPanel;
