import React, { useEffect, useRef, useState } from 'react';
import { ColorPicker, DatePicker, Input, message } from 'antd';
import Draggable, { ControlPosition } from 'react-draggable';
import { getNextZIndex } from './zIndexManager';
import styles from './StickyNote.less';
import {
  deleteSticky,
  foldSticky,
  switchThemeColor,
  updateSticky,
} from '@/services/ant-design-pro/dailyWork';
import {
  CloseOutlined,
  FileWordOutlined,
  OrderedListOutlined,
  PlusSquareOutlined,
  TagsOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useStickyNoteData } from './StickyNoteContext';

export default function StickyNote({ initData, px, py }) {
  const { list } = useStickyNoteData();
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState<ControlPosition>({ x: px, y: py });
  const [size, setSize] = useState({ width: 300, height: 220 });
  const [sticky, setSticky] = useState({
    id: initData.id,
    title: initData.title,
    content: initData.content,
    startDate: initData.startDate,
    endDate: initData.endDate,
  });
  const [foldFlag, setFoldFlag] = useState(initData.foldFlag);
  const [themeColor, setThemeColor] = useState(initData.themeColor || '#81d3f8');
  // text - 文本；list - 列表；
  const [showType, setShowType] = useState(initData.showType);
  const [tags, setTags] = useState([]);

  // 创建拖拽句柄引用
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const bringToFront = () => {
    const newZIndex = getNextZIndex();
    setZIndex(newZIndex);
  };

  const handleDrag = (e: any, ui: any) => {
    setPosition({
      x: position.x + ui.deltaX,
      y: position.y + ui.deltaY,
    });
    bringToFront(); // 拖动时也提升层级
  };

  useEffect(() => {
    if (!initData) {
      return;
    }
    if (initData.width && initData.height) {
      setSize({ width: initData.width, height: initData.height });
    }
    if (initData?.tags?.length > 0) {
      setTags(initData.tags);
      console.log(tags);
    }
  }, []);

  function saveSticky(param) {
    updateSticky(param).then((res) => {
      if (!res) {
        message.error('id：' + param.id + '保存失败').then();
      }
    });
  }

  function deleteLogical() {
    deleteSticky({ id: sticky.id }).then((res) => {
      if (res) {
        list();
      } else {
        message.warning('id：' + sticky.id + '删除失败').then();
      }
    });
  }

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      onStart={bringToFront}
      // 关键修改：指定拖拽句柄
      handle=".drag-handle"
    >
      <div
        style={{
          position: 'absolute',
          zIndex,
          width: size.width,
          height: size.height,
        }}
        onClick={bringToFront}
      >
        {/* 添加拖拽句柄区域 */}
        <div ref={dragHandleRef} className={`${styles.dragHandle} drag-handle`} style={{}} />
        <div className={styles.header}>
          <Input
            value={sticky.title}
            className={styles.title}
            onChange={(e) => setSticky({ ...sticky, title: e.target.value })}
            onBlur={() => saveSticky(sticky)}
            // 允许文本选择
            onMouseDown={(e) => e.stopPropagation()}
          />
          <TagsOutlined className={styles.dragIcon} />
        </div>
        <div className={styles.buttonBar}>
          {/* 主题色选择 */}
          <ColorPicker
            className={styles.colorPicker}
            defaultValue={themeColor}
            onChange={(color) => {
              setThemeColor(color.toHexString());
              switchThemeColor({ id: sticky.id, themeColor: color.toHexString() }).then();
            }}
          />
          {showType === 'text' ? (
            // 点击切换到列表形式
            <OrderedListOutlined className={styles.listIcon} onClick={() => setShowType('list')} />
          ) : (
            // 点击切换到文本形式
            <FileWordOutlined className={styles.textIcon} onClick={() => setShowType('text')} />
          )}
          {foldFlag === 0 ? (
            // 展开
            <VerticalAlignBottomOutlined
              className={styles.foldIcon}
              onClick={() => {
                setFoldFlag(1);
                foldSticky({ id: sticky.id, foldFlag: 1 }).then();
              }}
            />
          ) : (
            // 收起
            <VerticalAlignTopOutlined
              className={styles.foldIcon}
              onClick={() => {
                setFoldFlag(0);
                foldSticky({ id: sticky.id, foldFlag: 0 }).then();
              }}
            />
          )}
          {/* 逻辑删除 */}
          <CloseOutlined className={styles.deleteIcon} onClick={deleteLogical} />
          {/* 截止日期 */}
          <DatePicker
            className={styles.endDate}
            size={'small'}
            value={dayjs(sticky.endDate)}
            format="YYYY-MM-DD"
            onChange={(date) => {
              let newVar = { ...sticky, endDate: date.format('YYYY-MM-DD') };
              setSticky(newVar);
              saveSticky(newVar);
            }}
          />
        </div>
        <div className={styles.tagBar}>
          <PlusSquareOutlined className={styles.tagAdd} />
        </div>
        <Input.TextArea
          className={styles.content}
          value={sticky.content}
          onChange={(e) => setSticky({ ...sticky, content: e.target.value })}
          onBlur={() => saveSticky(sticky)}
          // 允许文本选择
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>
    </Draggable>
  );
}
