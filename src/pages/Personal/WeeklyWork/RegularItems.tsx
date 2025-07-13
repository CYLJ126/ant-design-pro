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
  addFromRegularActivities,
  addWeeklyRegularActivity,
  deleteWeeklyRegularActivity,
  listWeeklyRegularActivities,
  updateWeeklyRegularActivity,
} from '@/services/ant-design-pro/dailyWork';
import { getWeekDayByLabel, getWeekDayByValue, weekDays } from '@/common/calendarUtil';
import { useModel } from 'umi';

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

function Bars({ visibleActivities }) {
  const [dayBars, setDayBars] = useState([]);

  useEffect(() => {
    let tempArr = [[], [], [], [], [], [], []];
    visibleActivities.forEach((item) => {
      if (item.checked) {
        let checked = JSON.parse(item.checked);
        checked.forEach((dayShot, dayIndex) => {
          if (dayShot === 1) {
            tempArr[dayIndex].push(getColorByIndex(item.colorIndex));
          }
        });
      }
    });
    setDayBars(tempArr);
  }, [visibleActivities]);

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

/**
 * 导入到当日活动
 * @param activities 待导入的事项
 * @constructor
 */
function ImportActivities({ activities }) {
  const [selectedTags, setSelectedTags] = useState<[]>([]);
  const { whichDay, initialActivities } = useModel('activitiesModel');

  return (
    <div>
      <Checkbox.Group
        options={activities.map((item) => ({
          label: item.tagName, // 显示 tagName
          value: item.tagId, // 使用 tagId 作为值
        }))}
        onChange={(checkedValues) =>
          setSelectedTags(activities.filter((item) => checkedValues.includes(item.tagId)))
        }
      />
      <Button
        onClick={() => {
          if (selectedTags.length === 0) {
            return;
          }
          addFromRegularActivities(selectedTags).then((res) => {
            initialActivities(whichDay);
            message
              .success(
                '总 ' + res.total + ' 条，成功 ' + res.success + ' 条，失败 ' + res.fail + ' 条',
              )
              .then();
          });
        }}
      >
        确定
      </Button>
    </div>
  );
}

export default function RegularItems({ whichWeek }) {
  const [regularActivities, setRegularActivities] = useState([]);
  const [visibleActivities, setVisibleActivities] = useState([]);
  const [options, setOptions] = useState([]);
  const [showAllBars, setShowAllBars] = useState(true);

  useEffect(() => {
    listRecursive({ name: '日课' }).then((data) => {
      setOptions(data[0].children);
    });
  }, []);

  useEffect(() => {
    if (whichWeek !== 0) {
      listWeeklyRegularActivities(whichWeek).then((res) => {
        let activities = res.rows.map((item, index) => {
          item.colorIndex = index;
          return item;
        });
        setRegularActivities(activities);
        setVisibleActivities(activities);
      });
    }
  }, [whichWeek]);

  // 重新设置可见的活动条
  const changeVisibleActivities = (param, included, excluded) => {
    const existIds = visibleActivities.map((item) => item.id).filter((id) => id !== excluded);
    existIds.push(included);
    let filter = param.filter((item) => existIds.includes(item.id));
    setVisibleActivities(filter);
  };

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
        param['colorIndex'] = regularActivities.length === 0 ? 0 : regularActivities.length;
        let temp = [...regularActivities, param];
        setRegularActivities(temp);
        changeVisibleActivities(temp, result.id, null);
      });
    }
  };

  /**
   * 删除一个每周常规活动
   * @param regularActivity 每周常规活动对象
   */
  const removeTag = (regularActivity) => {
    deleteWeeklyRegularActivity(regularActivity.id).then(() => {
      let rest = regularActivities.filter((item) => item.id !== regularActivity.id);
      // 对活动条颜色进行重新设置
      rest.forEach((item, index) => {
        item.colorIndex = index;
      });
      setRegularActivities(rest);
      changeVisibleActivities(rest, null, regularActivity.id);
    });
  };

  /**
   * 控制标签活动条的显示
   * @param type 显示类型：all-显示所有；none-所有不显示；single-显示指定标签活动条；
   * @param regularActivity 标签对象，可选
   */
  const handleTagView = (type, regularActivity?) => {
    if (type === 'all') {
      changeVisibleActivities(regularActivities, null, null);
    } else if (type === 'none') {
      setVisibleActivities([]);
    } else {
      if (!regularActivity) {
        return;
      }
      const exist = visibleActivities.some((item) => item.tagId === regularActivity.tagId);
      if (exist) {
        // 去除当前点击的标签的活动条
        changeVisibleActivities(regularActivities, null, regularActivity.id);
      } else {
        // 添加当前点击的标签的活动条
        changeVisibleActivities(regularActivities, regularActivity.id, null);
      }
    }
  };

  const setActivityBars = (tag, list) => {
    updateWeeklyRegularActivity(tag.id, list).then(() => {
      // 重新设置本周所有标签
      let temp = regularActivities.map((item) => {
        if (item.id === tag.id) {
          item.checked = list;
        }
        return item;
      });
      setRegularActivities(temp);
      // 重新设置显示的活动条
      changeVisibleActivities(temp, null, null);
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
            <Popover
              autoAdjustOverflow
              placement={'bottomRight'}
              destroyOnHidden
              content={<ImportActivities activities={regularActivities} />}
            >
              {/* 导入到当天 */}
              <LoginOutlined className={styles.importIcon} />
            </Popover>
            {/* 全部显示或不显示活动条 */}
            <KeyOutlined
              className={styles.aimIcon}
              onClick={() => {
                if (showAllBars) {
                  setShowAllBars(false);
                  setVisibleActivities([]);
                } else {
                  setShowAllBars(true);
                  setVisibleActivities([...regularActivities]);
                }
              }}
            />
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
          <Bars visibleActivities={visibleActivities} />
        </Col>
      </Row>
    </div>
  );
}
