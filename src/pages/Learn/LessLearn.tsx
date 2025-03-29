import React, { useState } from 'react';
import { Button, Input } from 'antd';
import styles from './lessLearn.less';

export default function LessLearn() {
  const [input1Style, setInput2Style] = useState({
    flag: true,
    height: '22px',
    width: '90px',
    color: '#65bf8b',
  });

  const handleInput1Style = () => {
    let temp;
    if (input1Style.flag) {
      // 切换成蓝色
      temp = { flag: false, height: '33px', width: '66px', color: '#81d3f8' };
    } else {
      // 切换成绿色
      temp = { flag: true, height: '22px', width: '170px', color: '#65bf8b' };
    }
    setInput2Style(temp);
    // 动态设置样式
    document.documentElement.style.setProperty('--height', input1Style.height);
    document.documentElement.style.setProperty('--width', input1Style.width);
    document.documentElement.style.setProperty('--color', input1Style.color);
  };
  return (
    <div>
      <Button onClick={handleInput1Style}>切换</Button>
      <Input className={styles.input1} value="长烟落日孤城闭" />
      <br />
    </div>
  );
}
