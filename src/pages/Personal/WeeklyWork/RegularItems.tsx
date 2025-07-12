import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Cascader,
  CascaderProps,
  Checkbox,
  Col,
  message,
  Popover,
  Row,
  Space,
} from 'antd';
import {
  KeyOutlined,
  LoginOutlined,
  MinusCircleOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import styles from './RegularItems.less';
import { getColorByIndex } from '@/common/colorUtil';
import { listRecursive } from '@/services/ant-design-pro/base';
import { Option } from 'commander';
import {
  addWeeklyRegularActivity,
  deleteWeeklyRegularActivity,
  listWeeklyRegularActivities,
  updateWeeklyRegularActivity,
} from '@/services/ant-design-pro/dailyWork';
import { getWeekDayByLabel, getWeekDayByValue, weekDays } from '@/common/calendarUtil';

/**
 * 每周常规活动
 * @param regularActivity 每周常规活动对象
 * @param index 每周常规活动索引
 * @param singleView 点击每周常规活动标签，只显示当前每周常规活动标签的活动条
 * @param removeTag 删除当前每周常规活动
 * @param setActivityBars 设置活动条
 * @constructor  Tag
 */
function Tag({ regularActivity, index, singleView, removeTag, setActivityBars }) {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  let color = getColorByIndex(index);
  const onChange = (list) => {
    setCheckedList(list);
    let checked = [0, 0, 0, 0, 0, 0, 0];
    list.forEach((item) => {
      checked[getWeekDayByLabel(item)] = 1;
    });
    setActivityBars(regularActivity, JSON.stringify(checked));
  };
  useEffect(() => {
    if (regularActivity.checked) {
      const shotArr = JSON.parse(regularActivity.checked);
      let temp = [];
      shotArr.forEach((item, index) => {
        if (item === 1) {
          temp.push(getWeekDayByValue(index + 1)?.label);
        }
      });
      setCheckedList(temp);
    }
  }, [regularActivity]);

  return (
    <Badge
      count={
        <MinusCircleOutlined
          className={styles.closeIcon}
          onClick={(e) => {
            removeTag(regularActivity);
            e.stopPropagation();
          }}
        />
      }
    >
      <Popover
        autoAdjustOverflow
        placement={'bottomRight'}
        content={
          <Checkbox.Group
            value={checkedList}
            options={weekDays.map((item) => item.label)}
            onChange={onChange}
          />
        }
      >
        <Button
          className={styles.button}
          onClick={() => singleView('single', regularActivity)}
          style={{
            backgroundColor: color,
          }}
        >
          {regularActivity.tagName}
        </Button>
      </Popover>
    </Badge>
  );
}

/**
 * 标签选择器
 * @param addTags 添加标签的回调函数
 * @param options 标签选项
 * @constructor TagsSelector
 */
const TagsSelector: React.FC = ({ addTag, options }) => {
  const onChange: CascaderProps<Option, 'value', true>['onChange'] = (value, selectedOptions) => {
    console.log('value值：', value);
    const selectedCascader = selectedOptions[selectedOptions.length - 1];
    const currentSelected = selectedCascader[selectedCascader.length - 1];
    addTag({ id: currentSelected.id, name: currentSelected.name });
  };

  return (
    <Cascader
      options={options}
      expandTrigger="hover"
      onChange={onChange}
      fieldNames={{ label: 'name', value: 'id' }}
      multiple
    />
  );
};

function Bars({ regularActivities }) {
  const [dayBars, setDayBars] = useState([]);

  useEffect(() => {
    let tempArr = [[], [], [], [], [], [], []];
    regularActivities.forEach((item, activityIndex) => {
      if (item.checked) {
        let checked = JSON.parse(item.checked);
        checked.forEach((dayShot, dayIndex) => {
          if (dayShot === 1) {
            tempArr[dayIndex].push(getColorByIndex(activityIndex));
          }
        });
      }
    });
    console.log('regularActivities: ', tempArr);
    setDayBars(tempArr);
  }, [regularActivities]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {dayBars.map((day, dayIndex) => {
        return (
          <div
            key={dayIndex}
            style={{ width: '55px', height: '30px', display: 'flex', flexDirection: 'row' }}
          >
            {day.map((color, barIndex) => (
              <div
                key={barIndex}
                style={{ width: '7px', height: '30px', backgroundColor: color }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function RegularItems({ whichWeek }) {
  const [regularActivities, setRegularActivities] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    listRecursive({ name: '日课' }).then((data) => {
      setOptions(data[0].children);
    });
  }, []);

  useEffect(() => {
    if (whichWeek !== 0) {
      listWeeklyRegularActivities(whichWeek).then((res) => {
        setRegularActivities(res.rows);
      });
    }
  }, [whichWeek]);

  /**
   * 添加一个每周常规活动
   * @param tag 每周常规活动对象
   */
  const addRegularActivity = (tag) => {
    if (regularActivities.length >= 7) {
      message.warning('最多添加 7 个标签').then();
      return;
    }
    if (!regularActivities.some((item) => item.tagId === tag.id)) {
      let param = { tagId: tag.id, weekId: whichWeek, checked: '[0,0,0,0,0,0,0]' };
      addWeeklyRegularActivity(param).then((result) => {
        param['id'] = result.id;
        param['tagName'] = tag.name;
        setRegularActivities([...regularActivities, param]);
      });
    }
  };

  /**
   * 删除一个每周常规活动
   * @param regularActivity 每周常规活动对象
   */
  const removeTag = (regularActivity) => {
    deleteWeeklyRegularActivity(regularActivity.id).then(() =>
      setRegularActivities(regularActivities.filter((item) => item.id !== regularActivity.id)),
    );
  };

  /**
   * 控制标签活动条的显示
   * @param type 显示类型：all-显示所有；none-所有不显示；single-显示指定标签活动条；
   * @param tag 标签对象，可选
   */
  const handleTagView = (type, tag?) => {
    console.log('查看标签：', tag);
  };

  const setActivityBars = (tag, list) => {
    updateWeeklyRegularActivity(tag.id, list).then(() => {
      let temp = regularActivities.map((item) => {
        if (item.id === tag.id) {
          item.checked = list;
        }
        return item;
      });
      setRegularActivities(temp);
    });
  };

  return (
    <div className={styles.wrapper}>
      <Row wrap={false} align="middle">
        <Col flex={'auto'} style={{ display: 'flex', overflow: 'hidden' }}>
          {/* 图标容器 */}
          <div className={styles.iconContainer}>
            <Popover
              autoAdjustOverflow
              placement={'bottomRight'}
              destroyOnHidden
              content={<TagsSelector addTag={addRegularActivity} options={options} />}
            >
              {/* 添加标签 */}
              <PlusSquareOutlined className={styles.plusItem} />
            </Popover>
            {/* 导入到当天 */}
            <LoginOutlined className={styles.importIcon} />
            {/* 全部显示或不显示活动条 */}
            <KeyOutlined className={styles.aimIcon} />
          </div>
          {/* 标签容器 */}
          <div className={styles.tagsContainer}>
            <Space size={[8, 0]} wrap={false}>
              {regularActivities.map((regularActivity, index) => (
                <Tag
                  regularActivity={regularActivity}
                  key={index}
                  index={index}
                  singleView={handleTagView}
                  removeTag={removeTag}
                  setActivityBars={setActivityBars}
                />
              ))}
            </Space>
          </div>
        </Col>
        <Col style={{ width: 385, flex: '0 0 auto', minWidth: 385 }}>
          {/* 右侧活动条 */}
          <Bars regularActivities={regularActivities} />
        </Col>
      </Row>
    </div>
  );
}
