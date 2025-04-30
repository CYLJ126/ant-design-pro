import { Card, Carousel, Col, Image, Popover, Row, Space, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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
    <div className={styles.popoverContentWrapper}>
      <Space direction="vertical" size="small">
        {newsList.map((news) => (
          <NewsCard key={news.title + '_' + time} news={news} width="100%" />
        ))}
      </Space>
    </div>
  );
}

/**
 * 每个网站
 *
 * @param websiteParam 网站信息参数
 * @param cardWidth 样式宽度
 * @constructor
 */
function WebsiteInfo({ websiteParam, cardWidth }) {
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
    <Popover
      autoAdjustOverflow
      placement="topLeft"
      content={<PopoverList newsList={newsList} />}
      overlayClassName={styles.newsPopover}
      getPopupContainer={(triggerNode) => triggerNode.parentElement!}
      onPopupAlign={(domNode) => {
        const popover = domNode as HTMLElement;
        const rect = popover.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (
          rect.left >= 20 &&
          rect.right <= viewportWidth - 20 &&
          rect.top >= 20 &&
          rect.bottom <= viewportHeight - 20
        ) {
          // 不需调整
          return;
        }

        if (rect.left < 20) {
          // 左侧溢出
          popover.style.left = `${20 - rect.left}px`;
        } else if (rect.right > viewportWidth - 20) {
          // 右侧溢出
          const overflow = rect.right - viewportWidth;
          popover.style.left = `${parseFloat(popover.style.left) - overflow - 20}px`;
        }

        if (rect.top < 20) {
          // 顶部溢出
          popover.style.top = `${20 - rect.top}px`;
        } else if (rect.bottom > viewportHeight - 20) {
          // 底部溢出
          let delta;
          if (popover.style.top === 'auto') {
            delta = viewportHeight - 600;
          } else {
            const overflow = rect.bottom - viewportHeight;
            delta = parseFloat(popover.style.top) - overflow - 20;
          }
          if (delta < 20) {
            delta = 20 - delta;
          }
          console.log('delta: ', delta);
          popover.style.top = delta + 'px';
        }
      }}
    >
      <a href={moduleUrl} target="_blank" rel="noreferrer">
        <Row align="middle" style={{ width: cardWidth }}>
          <Col span={12} style={{ height: '40px' }}>
            <Image width={100} preview={false} src={imageUrl} className={styles.logoImg} />
          </Col>
          <Col span={12} align={'end'}>
            <span className={styles.websiteModule}>{module}</span>
          </Col>
        </Row>
      </a>
      {/* 走马灯 */}
      <Carousel arrows autoplay dotPosition={'top'} dots={false} className={styles.carousel}>
        {newsList.map((news) => (
          <NewsCard news={news} width={cardWidth} key={news.title + '_' + time} />
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
  const [cardWidth, setCardWidth] = useState('42vh');
  const gridRef = useRef<HTMLDivElement>(null); // 步骤1：创建ref引用
  useEffect(() => {
    listWebsiteNews({ type: id }).then((result) => setWebsiteList(result));
  }, []);

  // 监听容器尺寸变化
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    // 在ResizeObserver内添加防抖逻辑
    let resizeTimeout;
    // 步骤2：创建 IntersectionObserver，只在可见时监听
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        // 激活ResizeObserver
        for (const entry of entries) {
          // 步骤3：计算有效宽度（包含padding和border）
          const totalWidth = entry.target.clientWidth;

          // 步骤4：计算目标宽度并设置CSS变量
          const tabWidth = (totalWidth - 40) / 4;
          entry.target.style.setProperty('--news-tab-width', `${tabWidth}px`);
          setCardWidth(tabWidth + 'px');
        }
      }, 1000); // 150ms延迟可自行调整
    });

    resizeObserver.observe(gridElement);

    return () => {
      resizeObserver.disconnect(); // 清理观察器
    };
  }, []);

  const time = new Date().getTime();
  return (
    <div
      id="website-content-grid"
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 四列等宽
        gap: '10px', // 元素间距
        alignItems: 'stretch', // 元素高度对齐方式
      }}
    >
      {websiteList.map((item) => (
        <WebsiteInfo key={item.id + '_' + time} websiteParam={item} cardWidth={cardWidth} />
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
