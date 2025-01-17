import React, {useState} from 'react';
import {Checkbox, Input} from 'antd';
import styles from './index.less';

interface CustomProperty {
  zhOrEn: boolean; // true-中文；false-英文；
  punctuationMark: boolean; // true-替换标点符号；false-不替换标点符号；
  clearBreakLine: boolean; // true-消除换行；false-不消除换行；
  compressSpace: boolean; // true-压缩空格；false-不压缩空格；
  withSpace: boolean; // true-英文、数字前后带空格；false-英文、数字前后不带空格；
  rewriteClipboard: boolean; // true-处理后复制到粘贴板；false-处理后不复制到粘贴板；
  isHandleClipboard: boolean; // true-从粘贴板复制内容到文本框中；false-不从粘贴板复制内容到文本框中；
}

interface TextPair {
  raw: string; // 原内容
  formatted: string; // 格式化后的内容
}

/**
 * 根据用户勾选的配置格式化文本
 * @param customProp 用户勾选的配置
 * @param text 原文本
 * @return string 格式化后文本
 */
function handleText(customProp: CustomProperty, text: string) {
  return {raw: text, formatted: '格式：' + text};
}

function changeText(text: string, customProp: CustomProperty, set: (textPair: TextPair) => void) {
  let handledTextObj = handleText(customProp, text);
  set(handledTextObj);
  if (customProp.rewriteClipboard) {
    // 写入粘贴板
    navigator.clipboard.writeText(handledTextObj.formatted).then();
  }
}

/**
 * 处理剪切板内容：拷贝剪贴板内容到文本框，处理后，再通过 {@link changeText} 填充到粘贴板
 * @param customProp 用户勾选的配置
 * @param set 设置文本内容函数
 */
async function handleClipboard(customProp: CustomProperty, set: (textPair: TextPair) => void) {
  if (!window.isSecureContext) {
    // clipboard 的访问需要在安全上下文中访问，否则无此属性
    console.log('当前访问不满足“安全上下文”要求，请手动粘贴内容...');
    return;
  }
  const clipboardText = await navigator.clipboard.readText();
  changeText(clipboardText, customProp, set);
}

// 初始化内容
const initialText: TextPair = {raw: '', formatted: ''};
const initialProp: CustomProperty = {
  zhOrEn: true,
  punctuationMark: true,
  clearBreakLine: true,
  compressSpace: true,
  withSpace: true,
  rewriteClipboard: true,
  isHandleClipboard: true,
};

export default function TextFormatter() {
  const [textObj, setTextObj] = useState(initialText);
  const [customProperty, setCustomProperty] = useState(initialProp);
  const [initialFlag, setInitialFlag] = useState(true);

  function change(tempSingle: object) {
    setCustomProperty({...customProperty, ...tempSingle});
  }

  // 激活窗口
  if (initialFlag) {
    console.log('注册窗口激活事件---监听剪贴板');
    window.addEventListener('focus', () => {
      handleClipboard(customProperty, setTextObj).then();
      setCustomProperty({...customProperty, isHandleClipboard: false});
    });
    setInitialFlag(false);
  }

  return (
    <div>
      <div>
        <Checkbox
          defaultChecked
          checked={customProperty.zhOrEn}
          onChange={(e) => {
            change({zhOrEn: e.target.checked});
          }}
        >
          中文
        </Checkbox>
        <Checkbox
          checked={!customProperty.zhOrEn}
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({zhOrEn: !e.target.checked});
          }}
        >
          英文
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({punctuationMark: e.target.checked});
          }}
        >
          替换标点符号
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({clearBreakLine: e.target.checked});
          }}
        >
          消除换行
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({compressSpace: e.target.checked});
          }}
        >
          压缩空格
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({withSpace: e.target.checked});
          }}
        >
          英文数字前后空格
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({rewriteClipboard: e.target.checked});
          }}
        >
          复制到粘贴板
        </Checkbox>
      </div>
      <Input.TextArea
        showCount
        className={styles.textArea}
        value={textObj.raw}
        onChange={(e: React.SyntheticEvent): void => {
          changeText(e.target.value, customProperty, setTextObj);
        }}
      />
      <Input.TextArea showCount className={styles.textArea} value={textObj.formatted}/>
    </div>
  );
}
