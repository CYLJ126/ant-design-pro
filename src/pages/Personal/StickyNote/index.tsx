import React from 'react';
import HeaderButtons from './HeaderButtons';
import StickyNote from './StickyNote';
import { StickyNoteProvider, useStickyNoteData } from './StickyNoteContext';

function StickyWrap() {
  const { stickies } = useStickyNoteData();

  const time = new Date().getTime();
  let px = 0;
  let py = 0;
  const windowsWidth = 1350;
  return (
    <>
      <HeaderButtons />
      <div style={{ width: windowsWidth, height: 800 }}>
        {stickies?.map((sticky) => {
          const node = <StickyNote key={sticky.id + time} initData={sticky} px={px} py={py} />;
          px += 10 + sticky.width;
          if (px > 1350) {
            px = 0;
            py += 210;
          }
          return node;
        })}
      </div>
    </>
  );
}

export default function StickyNotes() {
  return (
    <StickyNoteProvider>
      <StickyWrap />
    </StickyNoteProvider>
  );
}
