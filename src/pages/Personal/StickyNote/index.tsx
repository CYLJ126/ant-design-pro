import React from 'react';
import Note from './Note';

export default function Summary() {
  return (
    <div style={{ width: 1350, height: 1000 }}>
      <Note initialPosition={{ x: 0, y: 0 }} />
      <Note initialPosition={{ x: 310, y: 0 }} />
    </div>
  );
}
