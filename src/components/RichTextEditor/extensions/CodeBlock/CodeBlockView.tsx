import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface CodeBlockViewProps {
  node: any;
  updateAttributes?: (attrs: any) => void;
  editor?: any;
}

// 支持的编程语言列表
const SUPPORTED_LANGUAGES = [
  { key: 'plaintext', label: 'Plain Text' },
  { key: 'java', label: 'Java' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'json', label: 'JSON' },
  { key: 'yaml', label: 'YAML' },
  { key: 'sql', label: 'SQL' },
  { key: 'nginx', label: 'Nginx' },
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'scss', label: 'SCSS' },
  { key: 'less', label: 'Less' },
  { key: 'xml', label: 'XML' },
  { key: 'markdown', label: 'Markdown' },
  { key: 'bash', label: 'Bash' },
  { key: 'cpp', label: 'C++' },
  { key: 'c', label: 'C' },
  { key: 'csharp', label: 'C#' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'swift', label: 'Swift' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'scala', label: 'Scala' },
  { key: 'shell', label: 'Shell' },
  { key: 'powershell', label: 'PowerShell' },
  { key: 'dockerfile', label: 'Dockerfile' },
  { key: 'apache', label: 'Apache' },
];

function CodeBlockView({ node, updateAttributes, editor }: CodeBlockViewProps) {
  const wrapperRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const codeContentRef = useRef<HTMLDivElement>(null);
  const languageSelectorRef = useRef<HTMLButtonElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const language = node.attrs.language || 'plaintext';

  // 使用 node 内容直接计算行数
  const calculateLineCountFromNode = useCallback(() => {
    // 直接从 node 获取文本内容
    const textContent = node.textContent || '';
    if (textContent === '') {
      return 1;
    }
    return Math.max(1, textContent.split('\n').length);
  }, [node.textContent]);

  // 从 DOM 计算行数（备用方案）
  const calculateLineCountFromDOM = useCallback(() => {
    const codeEl = wrapperRef.current?.querySelector('code');
    if (codeEl) {
      const text = codeEl.textContent || '';
      if (text === '') {
        return 1;
      }
      return Math.max(1, text.split('\n').length);
    }
    return 1;
  }, []);

  // 更新行号
  const updateLineNumbers = useCallback(() => {
    // 优先使用 node 内容，如果没有则使用 DOM 内容
    const newLineCount = calculateLineCountFromNode() || calculateLineCountFromDOM();
    setLineCount(newLineCount);
  }, [calculateLineCountFromNode, calculateLineCountFromDOM]);

  // 同步垂直滚动
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (lineNumbersRef.current && target === codeContentRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }
  }, []);

  // 计算下拉菜单的位置和大小
  const getDropdownPlacement = useCallback(() => {
    if (!languageSelectorRef.current) return 'bottomLeft';

    const rect = languageSelectorRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;

    // 如果下方空间足够显示视窗高度的一半，使用 bottomLeft
    // 否则使用 topLeft
    return spaceBelow >= viewportHeight * 0.5 + 20 ? 'bottomLeft' : 'topLeft';
  }, []);

  // 监听 node 变化
  useEffect(() => {
    updateLineNumbers();
  }, [node.textContent, node.content, updateLineNumbers]);

  // DOM 监听和滚动同步
  useEffect(() => {
    const codeEl = wrapperRef.current?.querySelector('code');
    const codeContent = codeContentRef.current;

    if (!codeEl || !codeContent) return;

    // MutationObserver 监听内容变化
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        updateLineNumbers();
      });
    });

    observer.observe(codeEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 输入事件监听
    const handleInput = () => {
      requestAnimationFrame(() => {
        updateLineNumbers();
      });
    };

    // 添加事件监听器
    codeEl.addEventListener('input', handleInput);
    codeContent.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      codeEl.removeEventListener('input', handleInput);
      codeContent.removeEventListener('scroll', handleScroll);
    };
  }, [updateLineNumbers, handleScroll]);

  // 编辑器事件监听
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      requestAnimationFrame(() => {
        updateLineNumbers();
      });
    };

    editor.on('update', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor, updateLineNumbers]);

  // 复制代码
  const handleCopy = async () => {
    const text = node.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      message.success('复制成功');
    } catch {
      message.error('复制失败');
    }
  };

  // 切换编程语言
  const handleLanguageChange = useCallback(
    (languageKey: string) => {
      if (updateAttributes) {
        updateAttributes({ language: languageKey });
      }
      setIsLanguageDropdownOpen(false);
    },
    [updateAttributes],
  );

  // 生成行号
  const renderLineNumbers = () => {
    const lines = [];
    for (let i = 1; i <= lineCount; i++) {
      lines.push(
        <span key={i} className="line-number">
          {i}
        </span>,
      );
    }
    return lines;
  };

  // 构建语言选择器菜单
  const languageMenuItems: MenuProps['items'] = SUPPORTED_LANGUAGES.map((lang) => ({
    key: lang.key,
    label: lang.label,
    onClick: () => handleLanguageChange(lang.key),
  }));

  // 获取当前语言的显示名称
  const getCurrentLanguageLabel = () => {
    const currentLang = SUPPORTED_LANGUAGES.find((lang) => lang.key === language);
    return currentLang?.label || language.toUpperCase();
  };

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      as="pre"
      className="enhanced-code-block"
      data-language={language}
    >
      {/* 头部工具栏 */}
      <div className="code-block-header">
        {/* 语言选择器 */}
        <Dropdown
          menu={{
            items: languageMenuItems,
            className: 'language-selector-dropdown-menu',
          }}
          trigger={['click']}
          open={isLanguageDropdownOpen}
          onOpenChange={setIsLanguageDropdownOpen}
          placement={getDropdownPlacement()}
          getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
          autoAdjustOverflow={{
            adjustX: 1,
            adjustY: 1,
          }}
        >
          <Button
            ref={languageSelectorRef}
            className="code-block-language-selector"
            size="small"
            contentEditable={false}
            onClick={(e) => {
              e.preventDefault();
              setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
            }}
          >
            <span className="language-text">{getCurrentLanguageLabel()}</span>
            <DownOutlined className="language-dropdown-icon" />
          </Button>
        </Dropdown>

        {/* 复制按钮 */}
        <Button
          className="code-block-copy-btn"
          onClick={handleCopy}
          title="复制代码"
          contentEditable={false}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
        </Button>
      </div>

      {/* 代码容器 */}
      <div className="code-container">
        {/* 行号区域 */}
        <div ref={lineNumbersRef} className="line-numbers" contentEditable={false}>
          {renderLineNumbers()}
        </div>
        {/* 代码内容区，NodeViewContent 渲染为 code 标签由 CSS 负责 */}
        {/* 用类型断言 as any 消除 TS 报错，运行时正常渲染为 <code> */}
        <div ref={codeContentRef} className="code-content">
          <NodeViewContent as={'code' as any} />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export default CodeBlockView;
