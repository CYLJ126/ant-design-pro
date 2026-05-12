export interface CodeLanguage {
  key: string;
  label: string;
  aliases?: string[];
}

export interface CodeBlockNodeAttrs {
  language?: string;
}

export interface CodeBlockViewProps {
  node: {
    attrs: CodeBlockNodeAttrs;
    textContent: string;
    content: any;
  };
  updateAttributes?: (attrs: CodeBlockNodeAttrs) => void;
  editor?: any;
}
