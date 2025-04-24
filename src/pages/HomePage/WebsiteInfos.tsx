import { Card, Carousel, Col, Image, Popover, Row, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './WebsiteInfos.less';
import { getWebsiteLogo, listWebsiteNews } from '@/services/ant-design-pro/homePage';
import { getTags } from '@/services/ant-design-pro/base';

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
      style={{ width: width }}
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
            <NewsCard news={news} width="800px" />
          </div>
        ))}
      </div>
    </Space>
  );
}

/**
 * 每个网站
 *
 * @param websiteParam
 * @constructor
 */
function WebsiteInfo({ websiteParam }) {
  const { module, newsList, logoUrl, moduleUrl } = websiteParam;
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getWebsiteLogo(logoUrl);
        const url = URL.createObjectURL(response);
        setImageUrl(url);
      } catch (error) {
        console.error('获取图片失败:', error);
      }
    };
    fetchImage().then();
    return () => {
      // 组件卸载时释放 Blob URL
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  const time = new Date().getTime();
  return (
    <Popover autoAdjustOverflow content={<PopoverList newsList={newsList} />}>
      <a href={moduleUrl} target="_blank" rel="noreferrer">
        <Row align="middle" style={{ width: '42vh' }}>
          <Col span={12} style={{ height: '40px' }}>
            <Image width={100} preview={false} src={imageUrl} className={styles.logoImg} />
          </Col>
          <Col span={12} align={'end'}>
            <span className={styles.websiteModule}>{module}</span>
          </Col>
        </Row>
      </a>
      {/* 走马灯 */}
      <Carousel arrows autoplay={false} dotPosition={'top'} className={styles.carousel}>
        {newsList.map((news) => (
          <NewsCard news={news} width="42vh" key={news.title + '_' + time} />
        ))}
      </Carousel>
    </Popover>
  );
}

/**
 * 每个新闻 Tab 页内容
 *
 * @param id 标签，即 Tab 类型
 * @constructor
 */
function NewsTabContent({ id }) {
  const [websiteList, setWebsiteList] = useState([]);
  useEffect(() => {
    listWebsiteNews({ type: id }).then((result) => setWebsiteList(result));
  }, []);
  const time = new Date().getTime();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 四列等宽
        gap: '10px', // 元素间距
        alignItems: 'stretch', // 元素高度对齐方式
      }}
    >
      {websiteList.map((item) => (
        <WebsiteInfo key={item.id + '_' + time} websiteParam={item} />
      ))}
    </div>
  );
}

export default function WebsiteInfos() {
  const [newsTab, setNewsTab] = useState([]);

  useEffect(() => {
    // 获取 新闻资讯 的 ID 去查询子标签
    getTags({ name: '新闻资讯' }).then((rootTag) => {
      getTags({ fatherId: rootTag[0].id }).then((result) => {
        setNewsTab(
          result.map((tag) => {
            return { label: tag.name, key: tag.id, children: <NewsTabContent id={tag.id} /> };
          }),
        );
      });
    });
  }, []);

  return <Tabs animated items={newsTab} className={styles.newsTabs} />;
}
