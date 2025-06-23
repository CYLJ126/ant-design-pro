import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import Draggable, { ControlPosition } from 'react-draggable';
import { getNextZIndex } from './zIndexManager';
import { getStickyById } from '@/services/ant-design-pro/dailyWork';

export default function StickyNote({ id }) {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState<ControlPosition>(null);
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [sticky, setSticky] = useState({ id: id, title: '', content: '' });
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
    if (!id) {
      return;
    }
    getStickyById(id).then((res) => {
      if (res.width && res.height) {
        setSize({ width: res.width, height: res.height });
      }
      setSticky({ id: id, title: res.title, content: res.content });
      setPosition({ x: 0, y: 0 });
      if (res?.tags?.length > 0) {
        setTags(res.tags);
        console.log(tags);
      }
    });
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
          <p>{sticky.content}</p>
        </Card>
      </div>
    </Draggable>
  );
}
