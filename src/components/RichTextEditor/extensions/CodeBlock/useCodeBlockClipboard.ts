import { useEffect } from 'react';
import { message } from 'antd';

/**
 * 将复制函数挂载到 window，供代码块复制按钮调用
 */
function useCodeBlockClipboard() {
  useEffect(() => {
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        message.success('代码已复制到剪贴板');
      } catch (err) {
        message.error('复制失败');
      }
    };

    (window as any).copyCodeToClipboard = copyToClipboard;

    return () => {
      delete (window as any).copyCodeToClipboard;
    };
  }, []);
}

export default useCodeBlockClipboard;
