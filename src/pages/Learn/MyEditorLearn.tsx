import React from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import { useComponentHeight } from '@/utils/useDynamicHeight';

const MyEditorLearn: React.FC = () => {
  const editorHeight = useComponentHeight(70, 300);
  return <RichTextEditor articleId={-12654} editorHeight={editorHeight} />;
};

export default MyEditorLearn;
