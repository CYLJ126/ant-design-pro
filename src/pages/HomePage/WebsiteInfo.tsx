// import React from 'react';
// import {Image, Card, Space, Carousel, Popover, Button, Row, Col} from 'antd';
// import CSDN from '@/assets/website/CSDN.png';
//
// /**
//  * 气泡显示所有列表新闻内容
//  *
//  * @param websiteInfo 网页信息
//  * @constructor
//  */
// function PopoverList({websiteInfo}) {
//   let list = [];
//   if (websiteInfo?.newsList?.length > 0) {
//     list.push(websiteInfo);
//   }
//   let subSites = websiteInfo.subSites ?? [];
//   for (const index in subSites) {
//     if (subSites[index]?.newsList?.length > 0) {
//       list.push(subSites[index]);
//     }
//   }
//
//   const time = new Date().getTime();
//   return (
//     <Space>
//       {list.map((item) => (
//         /* 卡片 */
//         <Card title={item.name} key={item.name + '_' + time}>
//           {item.newsList?.map((one) => (
//             <a
//               key={one.key + '_' + time}
//               href={one.value}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {one.key}
//             </a>
//           ))}
//         </Card>
//       ))}
//     </Space>
//   );
// }
//
// function Website({websiteInfo}) {
//
//   const openWebsite = (url) => {
//     // 打开新标签页
//     window.open(url, '_blank', 'noopener, noreferrer');
//   };
//   return (
//     <div style={{whiteSpace: 'nowrap'}}>
//       <Image width={100} preview={false} alt="CSDN" src={CSDN}/>
//       {/* 走马灯 */}
//       <Carousel arrows autoplay style={{width: '500px', height: '200px'}}>
//         {/* 气泡卡片 */}
//         <Popover content={<PopoverList websiteInfo={content[0]}/>}>
//           <Button
//             onClick={() =>
//               openWebsite(
//                 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
//               )
//             }
//           >
//             深入理解C++变量
//           </Button>
//         </Popover>
//         <Popover content={<PopoverList websiteInfo={content[0]}/>}>
//           <Button
//             onClick={() =>
//               openWebsite('https://www.modb.pro/db/1896739173420249088?utm_source=index_ai')
//             }
//           >
//             GBASE南大通用中标广西商务厅数据库采购项目
//           </Button>
//         </Popover>
//         <Popover content={<PopoverList websiteInfo={content[0]}/>}>
//           <Button
//             onClick={() =>
//               openWebsite(
//                 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
//               )
//             }
//           >
//             深入理解C++变量
//           </Button>
//         </Popover>
//       </Carousel>
//     </div>
//   );
// }
//
// export default function WebsiteInfo() {
//   const content = [
//     {
//       name: '资讯',
//       newsList: [
//         {
//           key: 'C++变量深入理解',
//           value:
//             'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
//         },
//         {
//           key: '完全指南XPath语法',
//           value:
//             'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
//         },
//         {
//           key: '使用URL API实现高效的URL解析',
//           value:
//             'https://blog.csdn.net/weixin_47754149/article/details/146371322?spm=1000.2115.3001.10524',
//         },
//       ],
//       subSites: [
//         {
//           name: '头条',
//           newsList: [
//             {
//               key: 'C++变量深入理解',
//               value:
//                 'https://blog.csdn.net/qq_21438461/article/details/146876417?spm=1000.2115.3001.10524',
//             },
//             {
//               key: '完全指南XPath语法',
//               value:
//                 'https://blog.csdn.net/weixin_66401877/article/details/146904839?spm=1000.2115.3001.10524',
//             },
//           ],
//         },
//       ],
//     },
//   ];
//
//   const nodes = [];
//   let i = 0;
//   while (i < content.length) {
//     let cols = [];
//     for (let j = 0; j < 4; j++) {
//       if (i < content.length) {
//         cols.push()
//       }
//     }
//   }
//   return (
//     <div>
//       <Row>
//         <Col span={6}>
//
//         </Col>
//         <Col span={6}>
//
//         </Col>
//         <Col span={6}>
//
//         </Col>
//         <Col span={6}>
//
//         </Col>
//       </Row>
//     </div>
//   )
// }
