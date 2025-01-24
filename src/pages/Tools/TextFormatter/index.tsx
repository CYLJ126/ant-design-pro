import React, { useState } from 'react';
import { Checkbox, Input } from 'antd';
import styles from './index.less';

/**
 * 格式化配置选项，由用户在页面选择
 */
interface CustomProperty {
  zhOrEn: boolean; // true-中文；false-英文；
  punctuationMark: boolean; // true-替换标点符号；false-不替换标点符号；
  clearBreakLine: boolean; // true-消除换行；false-不消除换行；
  compressSpace: boolean; // true-压缩空格；false-不压缩空格；
  withSpace: boolean; // true-英文、数字前后带空格；false-英文、数字前后不带空格；
  rewriteClipboard: boolean; // true-处理后复制到粘贴板；false-处理后不复制到粘贴板；
  isHandleClipboard: boolean; // true-从粘贴板复制内容到文本框中；false-不从粘贴板复制内容到文本框中；
}

/**
 * 列表形内容配置选项，由用户在页面选择
 */
interface ListProperty {
  removePrefixLength: number; // 要删除的前缀长度；
  serialMark: string; // 编号，下拉可选：无 或 1. 2. 3. 或（1）（2）（3）或 一、二、三、或 a . b. c. 或 （a）（b）（c）或 * * * ；
  endWith: string; // 要添加或替换的结束符，由用户输入，默认值为分号；
  withBlankLine: boolean; // true-默认，添加空行；false-不添加空行；
  lastWithPeriod: boolean; // 最后是否以句号（中文。，英文.）结束，默认为 true；
}

interface TextPair {
  raw: string; // 原内容
  formatted: string; // 格式化后的内容
}

function handleBreakLine(text: string) {
  // 消除换行
  return text.replace(/\n/g, '');
}

/**
 * 示例1：
 * |-替换前：中   中  中123+456=789  中dkghsdlsdgll(sdlghsdll)武林$ 257639.82357397&dhg三Node.js国25235,354,32末。sgdg中方`sdkgs`中`gdsjlg ` sss工。
 * |-替换后：中中中 123 + 456 = 789 中 dkghsdlsdgll（sdlghsdll）武林 $257639.82357397 & dhg 三 Node.js 国 25235, 354, 32 末。sgdg 中方 `sdkgs` 中 `gdsjlg` sss 工。
 * @param customProp
 * @param text
 */
function handleChinese(customProp: CustomProperty, text: string) {
  let tempStr = text;
  if (customProp.clearBreakLine) {
    tempStr = handleBreakLine(tempStr);
  }
  if (customProp.punctuationMark) {
    // 转换标点符号
    tempStr = tempStr
      .replace(/\?/g, '？')
      .replace(/:/g, '：')
      .replace(/\./g, '。')
      .replace(/,/g, '，')
      .replace(/\(/g, '（')
      .replace(/\)/g, '）')
      .replace(/!/g, '！')
      .replace(/;/g, '；');
  }
  if (customProp.withSpace) {
    // 添加空格
    tempStr = tempStr
      .replace(/(?<backQuota>([a-zA-Z0-9]+)|([+\-/*￥$]))/g, ' $<backQuota> ')
      .replace(/ +/g, ' ')
      .trim();
  }
  if (customProp.compressSpace) {
    // 压缩空格
    //压缩空格
    tempStr = tempStr.replace(/ +/g, ' ');
    //去除中文之间的空格，由于存在“中 中 中 中”这样交叉空格情况，所以要调用两次才能清完
    tempStr = tempStr.replace(/([\u4e00-\u9fa5]) ([\u4e00-\u9fa5])/g, '$1$2');
    tempStr = tempStr.replace(/([\u4e00-\u9fa5]) ([\u4e00-\u9fa5])/g, '$1$2');
  }
  //去除标点符号和前后的空格
  tempStr = tempStr.replace(/(\w) +([！，。？；（）‘’“”…、：【】])/g, '$1$2');
  tempStr = tempStr.replace(/([！，。？；（）‘’“”…、：【】]) +/g, '$1');
  // 格式化数字
  tempStr = tempStr.replace(/(\d) ?[.。] ?(\d)/g, '$1.$2');
  tempStr = tempStr.replace(/(\d) ?[,，] ?(\d)/g, '$1, $2');
  tempStr = tempStr.replace(/([$￥]) ?(\d)/g, '$1$2');
  // 格式化代码
  tempStr = tempStr.replace(/ ?` ?(.*?) ?` ?/g, ' `$1` ');
  // 英文之间的句点，形如 Node.js 还原
  tempStr = tempStr.replace(/(\w) ?[.。] ?(\w)/g, '$1.$2');
  return tempStr.trim();
}

const serialMark = [
  { '0': '', '1': '1. ', '2': '（1）', '3': '一、', '4': 'a. ', '5': '（a）' },
  { '0': '', '1': '2. ', '2': '（2）', '3': '二、', '4': 'b. ', '5': '（b）' },
  { '0': '', '1': '3. ', '2': '（3）', '3': '三、', '4': 'c. ', '5': '（c）' },
  { '0': '', '1': '4. ', '2': '（4）', '3': '四、', '4': 'd. ', '5': '（d）' },
  { '0': '', '1': '5. ', '2': '（5）', '3': '五、', '4': 'e. ', '5': '（e）' },
  { '0': '', '1': '6. ', '2': '（6）', '3': '六、', '4': 'f. ', '5': '（f）' },
  { '0': '', '1': '7. ', '2': '（7）', '3': '七、', '4': 'g. ', '5': '（g）' },
  { '0': '', '1': '8. ', '2': '（8）', '3': '八、', '4': 'h. ', '5': '（h）' },
  { '0': '', '1': '9. ', '2': '（9）', '3': '九、', '4': 'i. ', '5': '（i）' },
  { '0': '', '1': '10. ', '2': '（10）', '3': '十、', '4': 'j. ', '5': '（j）' },
  { '0': '', '1': '11. ', '2': '（11）', '3': '十一、', '4': 'k. ', '5': '（k）' },
  { '0': '', '1': '12. ', '2': '（12）', '3': '十二、', '4': 'l. ', '5': '（l）' },
  { '0': '', '1': '13. ', '2': '（13）', '3': '十三、', '4': 'm. ', '5': '（m）' },
  { '0': '', '1': '14. ', '2': '（14）', '3': '十四、', '4': 'n. ', '5': '（n）' },
  { '0': '', '1': '15. ', '2': '（15）', '3': '十五、', '4': 'o. ', '5': '（o）' },
  { '0': '', '1': '16. ', '2': '（16）', '3': '十六、', '4': 'p. ', '5': '（p）' },
  { '0': '', '1': '17. ', '2': '（17）', '3': '十七、', '4': 'q. ', '5': '（q）' },
  { '0': '', '1': '18. ', '2': '（18）', '3': '十八、', '4': 'r. ', '5': '（r）' },
  { '0': '', '1': '19. ', '2': '（19）', '3': '十九、', '4': 's. ', '5': '（s）' },
  { '0': '', '1': '20. ', '2': '（20）', '3': '二十、', '4': 't. ', '5': '（t）' },
];

function handleListChinese(listProp: ListProperty, text: string) {
  let list = text.split(/[\r\n]+/g);
  list = list.filter((item) => item && item !== '');
  if (list.length === 0) {
    return '';
  }
  // 最长只支持 20
  const loopCount = Math.min(list.length, 20);
  for (let i = 0; i < loopCount; i++) {
    let str = list[i];
    const length = str.length;
    if (listProp.removePrefixLength > 0) {
      // 删除前缀
      str = str.substring(listProp.removePrefixLength, length);
    }
    str = str.trim();
    // 添加编号
    str = serialMark[i][listProp.serialMark] + str;
    str = str.replace(/[,.，。；、]\w?$/, '');
    str = str.trim();
    if (i === list.length - 1) {
      if (listProp.lastWithPeriod) {
        // 最后一条换成句号结尾
        str += '。';
      }
    } else {
      // 添加指定末尾标点
      str = str + listProp.endWith;
      if (listProp.withBlankLine) {
        // 加上换行
        str += '\r\n';
      }
    }
    list[i] = str;
  }
  return list.join('');
}

/**
 * 根据用户勾选的配置格式化文本
 * @param text 原文本
 * @param customProp 用户勾选的配置
 * @param set 文本内容设置函数（useState属性）
 * @return TextPair 格式化后的文本对象
 */
function handleText(text: string, customProp: CustomProperty, set: (textPair: TextPair) => void) {
  let handledTextObj = { raw: text, formatted: handleChinese(customProp, text) };
  set(handledTextObj);
  if (customProp.rewriteClipboard) {
    // 写入粘贴板
    navigator.clipboard.writeText(handledTextObj.formatted).then();
  }
  return handledTextObj;
}

/**
 * 处理成列表型内容
 * @param text 原文本
 * @param customProp 用户勾选的配置
 * @param listProp 用户勾选的列表配置
 * @param set 文本内容设置函数（useState 属性）
 */
function handleListText(
  text: string,
  customProp: CustomProperty,
  listProp: ListProperty,
  set: (textPair: TextPair) => void,
) {
  // 修改非列表下的参数
  customProp.rewriteClipboard = false;
  customProp.clearBreakLine = false;
  // 先处理文本中的其他内容
  let tempPair: TextPair = handleText(text, customProp, set);
  tempPair.formatted = handleListChinese(listProp, tempPair.formatted);
  set(tempPair);
}

/**
 * 处理剪切板内容：拷贝剪贴板内容到文本框，处理后，再通过 {@link handleText} 填充到粘贴板
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
  handleText(clipboardText, customProp, set);
}

// 初始化内容
const initialText: TextPair = { raw: '', formatted: '' };
const initialProp: CustomProperty = {
  zhOrEn: true,
  punctuationMark: true,
  clearBreakLine: true,
  compressSpace: true,
  withSpace: true,
  rewriteClipboard: true,
  isHandleClipboard: true,
};
const initialListProp: ListProperty = {
  removePrefixLength: 0,
  endWith: '；',
  lastWithPeriod: true,
  serialMark: '1',
  withBlankLine: true,
};

export default function TextFormatter() {
  // 文本处理
  const [textObj, setTextObj] = useState(initialText);
  const [customProperty, setCustomProperty] = useState(initialProp);
  const [initialFlag, setInitialFlag] = useState(true);
  // 列表内容处理
  const [listProperty, setListProperty] = useState(initialListProp);

  function change(tempSingle: object) {
    setCustomProperty({ ...customProperty, ...tempSingle });
    handleText(textObj.raw, { ...customProperty, ...tempSingle }, setTextObj);
  }

  function listChange(tempSingle: object) {
    let newProp = { ...listProperty, ...tempSingle };
    setListProperty(newProp);
    handleListText(textObj.raw, customProperty, newProp, setTextObj);
  }

  // 激活窗口
  if (initialFlag) {
    console.log('注册窗口激活事件---监听剪贴板');
    window.addEventListener('focus', () => {
      handleClipboard(customProperty, setTextObj).then();
      setCustomProperty({ ...customProperty, isHandleClipboard: false });
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
            change({ zhOrEn: e.target.checked });
          }}
        >
          中文
        </Checkbox>
        <Checkbox
          checked={!customProperty.zhOrEn}
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ zhOrEn: !e.target.checked });
          }}
        >
          英文
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ punctuationMark: e.target.checked });
          }}
        >
          替换标点符号
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ clearBreakLine: e.target.checked });
          }}
        >
          消除换行
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ compressSpace: e.target.checked });
          }}
        >
          压缩空格
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ withSpace: e.target.checked });
          }}
        >
          英文数字前后空格
        </Checkbox>
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            change({ rewriteClipboard: e.target.checked });
          }}
        >
          复制到粘贴板
        </Checkbox>
      </div>
      <div>
        <Input
          value={listProperty.removePrefixLength}
          placeholder="前缀删除长度"
          onChange={(e: React.SyntheticEvent): void => {
            let content = e.target.value;
            if (/^\d*$/.test(content)) {
              // 只在输入为整数的情况下才进行处理
              listChange({ removePrefixLength: content });
            }
          }}
        />
        <Checkbox
          defaultChecked
          onChange={(e: React.CheckboxChangeEvent): void => {
            listChange({ rewriteClipboard: e.target.checked });
          }}
        >
          添加空行
        </Checkbox>
      </div>
      <Input.TextArea
        showCount
        className={styles.textArea}
        value={textObj.raw}
        onChange={(e: React.SyntheticEvent): void => {
          handleText(e.target.value, customProperty, setTextObj);
        }}
      />
      <Input.TextArea showCount className={styles.textArea} value={textObj.formatted} />
    </div>
  );
}
