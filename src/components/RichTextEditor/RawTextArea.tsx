import React from 'react';
import { useRichTextData } from './RichTextContext';
import { Input } from 'antd';
import styles from './RawTextArea.less';

function RawTextArea() {
  const { editAreaHeight, rawText, setRawText } = useRichTextData();
  return (
    <Input.TextArea
      id="raw-text"
      className={styles.rawTextArea}
      style={{ height: editAreaHeight }}
      value={rawText}
      onChange={(e) => setRawText(e.target.value)}
    />
  );
}

export default RawTextArea;
