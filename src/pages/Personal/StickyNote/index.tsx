import React from 'react';
import HeaderButtons from './HeaderButtons';
import StickyNote from './StickyNote';

export default function Summary() {
  return (
    <div>
      <HeaderButtons />
      <div style={{ width: 1350, height: 1000 }}>
        <StickyNote initialPosition={{ x: 0, y: 0 }} />
        <StickyNote initialPosition={{ x: 310, y: 0 }} />
      </div>
    </div>
  );
}
