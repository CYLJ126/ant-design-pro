import { getSubTags, listRecursive } from '@/services/ant-design-pro/base';

export function initialUserTags() {
  // 查询“日课”的标签列表
  getSubTags({ name: '日课' }).then((rootTag) => {
    if (!rootTag || rootTag.length === 0) {
      return;
    }
    getSubTags({ fatherId: rootTag[0].value }).then((result) => {
      localStorage.setItem('dailyWorkTags', JSON.stringify(result || []));
    });
  });
  // 查询“便笺”的标签列表
  listRecursive({ name: '便笺' }).then((data) => {
    if (!data || data.length === 0) {
      return;
    }
    localStorage.setItem('stickyTags', JSON.stringify(data[0].children || []));
  });
}
