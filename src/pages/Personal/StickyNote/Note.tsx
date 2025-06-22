import React, { useState } from 'react';
import { Card } from 'antd';
import Draggable, { ControlPosition } from 'react-draggable';
import { getNextZIndex } from './zIndexManager';

export default function Note({ initialPosition }) {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState<ControlPosition>(initialPosition);

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

  return (
    <Draggable position={position} onDrag={handleDrag} onStart={bringToFront}>
      <div
        style={{
          position: 'absolute',
          zIndex,
          width: 350,
          cursor: 'move',
        }}
        onClick={bringToFront}
      >
        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
          <p>Card 第一行内容</p>
          <p>Card 第二行内容</p>
          <p>Card 第三行内容</p>
        </Card>
      </div>
    </Draggable>
  );
}
