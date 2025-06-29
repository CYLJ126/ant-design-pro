import React, { useEffect, useState } from 'react';
import { Card, Input, message } from 'antd';
import Draggable, { ControlPosition } from 'react-draggable';
import { getNextZIndex } from './zIndexManager';
import { updateSticky } from '@/services/ant-design-pro/dailyWork';

export default function StickyNote({ initData, px, py }) {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState<ControlPosition>({ x: px, y: py });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [sticky, setSticky] = useState({
    id: initData.id,
    title: initData.title,
    content: initData.content,
    startDate: initData.startDate,
    endDate: initData.endDate,
    showType: initData.showType,
    foldFlag: initData.foldFlag,
  });
  const [tags, setTags] = useState([]);

  const bringToFront = () => {
    const newZIndex = getNextZIndex();
    setZIndex(newZIndex);
  };

  const handleDrag = (e: any, ui: any) => {
    setPosition({
      x: position.x + ui.deltaX,
      y: position.y + ui.deltaY,
    });
    bringToFront(); // 拖动时也提升层级
  };

  useEffect(() => {
    if (!initData) {
      return;
    }
    if (initData.width && initData.height) {
      setSize({ width: initData.width, height: initData.height });
    }
    if (initData?.tags?.length > 0) {
      setTags(initData.tags);
      console.log(tags);
    }
  }, []);

  return (
    <Draggable position={position} onDrag={handleDrag} onStart={bringToFront}>
      <div
        style={{
          position: 'absolute',
          zIndex,
          width: size.width,
          height: size.height,
        }}
        onClick={bringToFront}
      >
        <Card title={sticky.title} extra={<a href="#">More</a>} style={{ width: 300 }}>
          <Input.TextArea
            value={sticky.content}
            onChange={(e) => setSticky({ ...sticky, content: e.target.value })}
            onBlur={() => {
              updateSticky(sticky).then((res) => {
                if (!res) {
                  message.error('id：' + sticky.id + '保存失败').then();
                }
              });
            }}
          />
        </Card>
      </div>
    </Draggable>
  );
}
