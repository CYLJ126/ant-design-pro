import { Card, Carousel, Image, Popover, Space } from 'antd';
import CSDN from '@/assets/learn/CSDN.png';
import React, { useEffect, useState } from 'react';
import styles from './WebsiteInfos.less';
import { listWebsiteNews } from '@/services/ant-design-pro/homePage';

const openWebsite = (url) => {
  // 打开新标签页
  window.open(url, '_blank', 'noopener, noreferrer');
};

function NewsCard({ news, width }) {
  return (
    <Card
      title={news.title}
      hoverable
      className={styles.card}
      style={{ width: width + 'px' }}
      size={'small'}
      onClick={() => openWebsite(news.url)}
    >
      <p>{news.summary}</p>
    </Card>
  );
}

/**
 * 气泡卡片，悬浮显示新闻列表
 *
 * @param newsList
 * @constructor
 */
function PopoverList({ newsList }) {
  const time = new Date().getTime();
  return (
    <Space direction={'vertical'} size={'small'} wrap={true} className={styles.popoverContent}>
      <div>
        {newsList.map((news) => (
          <div style={{ marginBottom: '10px' }} key={news.title + '_' + time}>
            <NewsCard news={news} width={800} />
          </div>
        ))}
      </div>
    </Space>
  );
}

function WebsiteInfo({ websiteParam }) {
  const { name, newsList } = websiteParam;
  const time = new Date().getTime();
  return (
    <Popover autoAdjustOverflow content={<PopoverList newsList={newsList} />}>
      <Image width={100} preview={false} alt="CSDN" src={CSDN} />
      <span>{name}</span>
      {/* 走马灯 */}
      <Carousel arrows autoplay dotPosition={'top'} className={styles.carousel}>
        {newsList.map((news) => (
          <NewsCard news={news} width={330} key={news.title + '_' + time} />
        ))}
      </Carousel>
    </Popover>
  );
}

export default function WebsiteInfos() {
  const [websiteList, setWebsiteList] = useState([]);

  useEffect(() => {
    listWebsiteNews({}).then((result) => setWebsiteList(result));
  }, []);

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
      {websiteList.map((item) => (
        <WebsiteInfo key={item.name + '_' + time} websiteParam={item} />
      ))}
    </div>
  );
}
