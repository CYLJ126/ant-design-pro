import { Card, Carousel, Image, Popover, Space } from 'antd';
import CSDN from '@/assets/learn/CSDN.png';
import React from 'react';
import styles from './WebsiteInfos.less';

const openWebsite = (url) => {
  // 打开新标签页
  window.open(url, '_blank', 'noopener, noreferrer');
};

function NewsCard({ news }) {
  return (
    <Card
      title={news.title}
      className={styles.card}
      size={'small'}
      onClick={() => openWebsite(news.url)}
    >
      <p>{news.summary}</p>
    </Card>
  );
}

/**
 * 气泡卡片，悬浮显示新闻列表
 * @param newsList
 * @constructor
 */
function PopoverList({ newsList }) {
  const time = new Date().getTime();
  return (
    <Space direction={'vertical'} size={'small'} wrap={true}>
      {newsList.map((news) => (
        <>
          <NewsCard news={news} key={news.title + '_' + time} />
        </>
      ))}
    </Space>
  );
}

function WebsiteInfo({ websiteParam }) {
  const { name, newsList } = websiteParam;
  const time = new Date().getTime();
  return (
    <Popover content={<PopoverList newsList={newsList} />}>
      <Image width={100} preview={false} alt="CSDN" src={CSDN} />
      <span>{name}</span>
      {/* 走马灯 */}
      <Carousel arrows autoplay className={styles.carousel}>
        {newsList.map((news) => (
          <NewsCard news={news} key={news.title + '_' + time} />
        ))}
      </Carousel>
    </Popover>
  );
}

export default function WebsiteInfos() {
  const content = [
    {
      name: '资讯',
      newsList: [
        {
          title: 'C++变量深入理解',
          summary: '极客头条」—— 技术人员的新闻圈',
          url: 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
        },
        {
          title: '完全指南XPath语法',
          summary: '小米汽车支持Siri语音控车；苹果市值4天蒸发超5万亿元',
          url: 'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
        },
        {
          title: '使用URL API实现高效的URL解析',
          summary: '腾讯张军回应微信“已读”功能；OpenAI对马斯克提起反诉',
          url: 'https://blog.csdn.net/weixin_47754149/article/details/146371322?spm=1000.2115.3001.10524',
        },
      ],
    },
    {
      name: '头条',
      newsList: [
        {
          title: 'C++变量深入理解',
          summary: 'Go占比首次突破3%，Kotlin和Swift退居',
          url: 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
        },
        {
          title: '完全指南XPath语法',
          summary: '4 月 10 日 19:30，CSDN《万有引力》栏目特别邀请腾讯云开发者 AI 产品负责人汪',
          url: 'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
        },
      ],
    },
    {
      name: '资讯',
      newsList: [
        {
          title: 'C++变量深入理解',
          summary: '极客头条」—— 技术人员的新闻圈',
          url: 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
        },
        {
          title: '完全指南XPath语法',
          summary: '小米汽车支持Siri语音控车；苹果市值4天蒸发超5万亿元',
          url: 'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
        },
        {
          title: '使用URL API实现高效的URL解析',
          summary: '腾讯张军回应微信“已读”功能；OpenAI对马斯克提起反诉',
          url: 'https://blog.csdn.net/weixin_47754149/article/details/146371322?spm=1000.2115.3001.10524',
        },
      ],
    },
    {
      name: '头条',
      newsList: [
        {
          title: 'C++变量深入理解',
          summary: 'Go占比首次突破3%，Kotlin和Swift退居',
          url: 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
        },
        {
          title: '完全指南XPath语法',
          summary: '4 月 10 日 19:30，CSDN《万有引力》栏目特别邀请腾讯云开发者 AI 产品负责人汪',
          url: 'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
        },
      ],
    },
  ];

  const time = new Date().getTime();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 四列等宽
        gap: '16px', // 元素间距
        alignItems: 'stretch', // 元素高度对齐方式
      }}
    >
      {content.map((item) => (
        <WebsiteInfo key={item.name + '_' + time} websiteParam={item} />
      ))}
    </div>
  );
}
