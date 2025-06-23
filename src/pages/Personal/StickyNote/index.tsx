import React from 'react';
import HeaderButtons from './HeaderButtons';
import StickyNote from './StickyNote';
import { StickyNoteProvider, useStickyNoteData } from './StickyNoteContext';

function StickyWrap() {
  const { ids } = useStickyNoteData();

  const time = new Date().getTime();
  return (
    <>
      <HeaderButtons />
      <div style={{ width: 1350, height: 1000 }}>
        {ids?.map((id) => <StickyNote key={id + time} id={id} />)}
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
