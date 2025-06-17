import OpenAI from 'openai';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

export default function AILearn() {
  const [model, setModel] = useState('openai/gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [url, setUrl] = useState('https://openrouter.ai/api/v1');
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');

  const openai = new OpenAI({
    baseURL: url,
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  async function invoke() {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: inputContent,
        },
      ],
    });
    return completion.choices[0].message;
  }

  const invokeRemote = () => {
    invoke()
      .then((res) => setOutputContent(res.content))
      .catch((err) => setOutputContent(err));
  };

  return (
    <div>
      <Input
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
        }}
        style={{ marginBottom: '5px' }}
      />
      <Space size="small">
        <Button onClick={invokeRemote} primary>
          生成内容
        </Button>
        <Input
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
          }}
          style={{ width: '300px' }}
        />
        <Input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          style={{ width: '300px' }}
        />
      </Space>
      <Input.TextArea
        value={inputContent}
        onChange={(e) => {
          setInputContent(e.target.value);
        }}
        style={{ height: 'calc(45vh - 50px)', marginTop: '5px', marginBottom: '5px' }}
      />
      <Input.TextArea value={outputContent} style={{ height: 'calc(45vh - 50px)' }} />
    </div>
  );
}
