import React, { useState } from 'react';
import { Input } from 'antd';
import { PlusSquareOutlined, SolutionOutlined } from '@ant-design/icons';
import styles from './index.less';

function save(index: number, content: string) {
  console.log('下标：' + index + '，内容：' + content);
}

function Step({ index, initialContent, addStep }) {
  const [content, setContent] = useState(initialContent);
  return (
    <Input
      size="small"
      className={styles.itemStep}
      addonBefore={'Step' + (index + 1)}
      addonAfter={
        <div>
          <PlusSquareOutlined onClick={() => addStep(index)} />
          <SolutionOutlined />
        </div>
      }
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onPressEnter={(e) => save(index, e.target.value)}
      onBlur={(e) => save(index, e.target.value)}
    />
  );
}

export default function Steps({ stepContents }) {
  const [steps, setSteps] = useState(stepContents);

  /**
   * 在指定步骤后面添加一行新步骤
   * @param index 指定步骤下标
   */
  function addStep(index: number) {
    let tempSteps = [];
    let newIndex = 0;
    // 生成列表的标识，每次渲染都不一样，因为使用 key（即下标）时，两次渲染时 key 一样，导致新增一行新步骤会有 bug。
    const date = new Date();
    const time = date.toLocaleTimeString();
    for (let i = 0; i < steps.length; i++) {
      tempSteps.push({ key: newIndex, uuid: time + newIndex, content: steps[i].content });
      newIndex++;
      if (i === index) {
        // 增加一行空步骤
        tempSteps.push({ key: newIndex, uuid: time + newIndex, content: '' });
        newIndex++;
      }
    }
    setSteps(tempSteps);
  }

  return (
    <ul>
      {steps
        .sort((a, b) => a.key < b.key)
        .map((item) => (
          <li key={item.uuid}>
            <Step index={item.key} initialContent={item.content} addStep={addStep} />
          </li>
        ))}
    </ul>
  );
}
