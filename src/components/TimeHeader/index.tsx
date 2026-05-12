import React, {ReactNode, useEffect, useState} from 'react';
import {DatePicker, Row, Select} from 'antd';
import {VerticalLeftOutlined, VerticalRightOutlined} from '@ant-design/icons';
import dayjs, {Dayjs} from 'dayjs';
import {createStyles} from 'antd-style';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import styles from './index.less';
import {getWeekInfoList} from '@/services/ant-design-pro/dailyWork';

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);

// 时间单位类型
export type TimeUnit =
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'quarter'
    | 'half-year'
    | 'year';

/**
 * 时间表示类型
 */
export interface MyTime {
    type: TimeUnit; // 时间单位
    value: any; // 对应时间单位的时间值
    time: Dayjs; // 真实的时间值
    label: string; // 时间标签（用于显示）
}

// 主题配置接口
export interface ThemeConfig {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
}

// Header组件Props
export interface HeaderProps {
    myTime?: MyTime;
    onTimeChange?: (time: MyTime, type: 'set' | 'prev' | 'next') => void;
    children?: ReactNode;
    theme?: ThemeConfig;
    className?: string;
    style?: React.CSSProperties;
}

// 时间单位配置
const TIME_UNIT_CONFIG = {
    minute: {format: 'YYYY-MM-DD HH:mm', label: '分钟'},
    hour: {format: 'YYYY-MM-DD HH:00', label: '小时'},
    day: {format: 'YYYY-MM-DD', label: '日'},
    week: {format: 'YYYY-[第]w[周]', label: '周'},
    month: {format: 'YYYY-MM', label: '月'},
    quarter: {format: 'YYYY-[Q]Q', label: '季'},
    'half-year': {format: 'YYYY-[H]', label: '半年'},
    year: {format: 'YYYY', label: '年'},
};

// 样式定义 TODO 将主题色抽成全局变量
const useStyles = createStyles((theme: ThemeConfig) => ({
    switchButton: {
        svg: {
            color: theme.primaryColor || '#81d3f8',
        },
    },

    timePicker: {
        backgroundColor: theme.backgroundColor || '#81d3f8',
        '&:hover, &:focus-within': {
            backgroundColor: theme.backgroundColor || '#81d3f8',
        },
        '.ant-picker-input input': {
            color: theme.textColor || 'white',
            '&:hover, &:focus': {
                color: theme.textColor || 'white',
                backgroundColor: 'transparent',
            },
        },
    },

    timeSelect: {
        backgroundColor: `${theme.backgroundColor || '#81d3f8'} !important`,
        color: theme.textColor || '#ffffff',
    },
}));

const TimeHeader: React.FC<HeaderProps> = ({
                                               myTime,
                                               onTimeChange,
                                               children,
                                               theme = {},
                                               className,
                                               style,
                                           }) => {
    const {styles: colorStyle} = useStyles(theme);
    const [currentTime, setCurrentTime] = useState<MyTime>(
        myTime || {
            type: 'day',
            value: dayjs(),
            time: dayjs(),
            label: dayjs().format(TIME_UNIT_CONFIG['day']['format']),
        },
    );
    const format = TIME_UNIT_CONFIG[currentTime.type].format;

    const [timeOptions, setTimeOptions] = useState<MyTime[]>([]);

    // 时间偏移函数
    const offsetTime = (current: MyTime, direction: 'prev' | 'next'): MyTime => {
        const amount = direction === 'prev' ? -1 : 1;
        const format = TIME_UNIT_CONFIG[current.type].format;
        switch (current.type) {
            case 'day': {
                const tempDate = current.time.add(amount, current.type);
                return {
                    type: current.type,
                    time: tempDate,
                    value: tempDate,
                    label: tempDate.format(format),
                };
            }
            case 'week': {
                let currentIndex = -1;
                for (let i = 0; i < timeOptions.length; i++) {
                    if (timeOptions[i].value === current.value) {
                        currentIndex = i;
                    }
                }
                return timeOptions[currentIndex + (direction === 'prev' ? -1 : 1)];
            }
            case 'quarter':
                return {...current, time: current.time.add(amount * 3, 'month')};
            case 'half-year':
                return {...current, time: current.time.add(amount * 6, 'month')};
            default: {
                const tempTime = current.time.add(amount, current.type);
                return {
                    type: current.type,
                    time: tempTime,
                    value: tempTime,
                    label: tempTime.format(format),
                };
            }
        }
    };

    useEffect(() => {
        // 获取时间选项（用于周、月等选择器）
        let options: Array<MyTime> = [];
        switch (currentTime.type) {
            case 'week': {
                getWeekInfoList(currentTime.time || dayjs(), 7).then((weekList) => {
                    weekList?.forEach((weekInfo) => {
                        options.push({
                            value: weekInfo.value,
                            label: weekInfo.label,
                            time: weekInfo.time,
                            type: 'week',
                        });
                    });
                    setTimeOptions(options);
                });
                break;
            }
            case 'month': {
                break;
            }
            case 'quarter': {
                break;
            }
            case 'half-year': {
                break;
            }
            default:
                break;
        }
    }, [currentTime]);

    // 当外部 value 变化时更新内部状态
    useEffect(() => {
        if (myTime) {
            setCurrentTime(myTime);
        }
    }, [myTime]);

    // 处理时间变化
    const handleTimeChange = (newTime: MyTime, type: 'set' | 'prev' | 'next') => {
        setCurrentTime(newTime);
        onTimeChange?.(newTime, type);
    };

    // 处理前进/后退按钮点击
    const handleNavigation = (direction: 'prev' | 'next') => {
        const newTime = offsetTime(currentTime, direction);
        handleTimeChange(newTime, direction);
    };

    // 渲染时间选择器
    const renderTimeSelector = () => {
        // 对于需要下拉选择的时间单位
        if (['week', 'month', 'quarter', 'half-year'].includes(currentTime?.type || 'week')) {
            return (
                <Select
                    className={`${styles.timeSelect} ${colorStyle.timeSelect}`}
                    options={timeOptions}
                    value={currentTime}
                    onSelect={(_, option) => handleTimeChange(option, 'set')}
                />
            );
        }

        // 时间面板是否显示小时、分钟选择栏
        let showTime;
        switch (myTime?.type) {
            case 'minute': {
                showTime = 'HH:mm';
                break;
            }
            case 'hour': {
                showTime = 'HH';
                break;
            }
            default:
                showTime = '';
        }

        // 对于日期选择器：minute, hour, day
        return (
            <DatePicker
                className={`${styles.timePicker} ${colorStyle.timePicker}`}
                style={{width: myTime?.type === 'day' ? '142px' : '193px'}}
                value={currentTime.time}
                showTime={showTime}
                format={format}
                onChange={(value) => {
                    if (value) {
                        handleTimeChange(
                            {
                                value: value,
                                time: value,
                                type: myTime?.type || 'day',
                                label: value.format(format),
                            },
                            'set',
                        );
                    }
                }}
            />
        );
    };

    return (
        <div className={`${styles.headerContainer} ${className}`} style={style}>
            <Row align="middle" wrap={false} style={{width: '100%'}}>
                {/* 向前按钮 */}
                <VerticalRightOutlined
                    className={`${styles.switchButton} ${colorStyle.switchButton}`}
                    onClick={() => handleNavigation('prev')}
                />

                {/* 时间选择器 */}
                {renderTimeSelector()}

                {/* 向后按钮 */}
                <VerticalLeftOutlined
                    className={`${styles.switchButton} ${colorStyle.switchButton}`}
                    onClick={() => handleNavigation('next')}
                />

                {/* 子组件容器 */}
                <div className={styles.childrenContainer}>{children}</div>
            </Row>
        </div>
    );
};

export default TimeHeader;
