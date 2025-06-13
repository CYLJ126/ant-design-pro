/**
 * 设置 7 种颜色：['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83']
 * 根据传入下标和偏移量，返回颜色
 */
export function getColorByIndex(index, offset: number = 0) {
  const colors = ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];
  return colors[(index + offset) % colors.length];
}
