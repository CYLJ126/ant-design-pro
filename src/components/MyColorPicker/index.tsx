import React, {useMemo, useState} from 'react';
import {Popover, message, ColorPicker} from 'antd';
import type {ColorPickerProps, GetProp} from 'antd';
import styles from './index.less';
import {debounce} from 'lodash';

type Color = GetProp<ColorPickerProps, 'value'>;

const InnerPicker: React.FC = ({initColor, notify, initialColorOptions = []}) => {
    // 主题色
    const [themeColor, setThemeColor] = useState<Color>(initColor || '#81d3f8');
    const colorOptions =
        initialColorOptions.length !== 0
            ? initialColorOptions
            : ['#ce2416', '#f78922', '#f6c114', '#64bd89', '#59aec6', '#2484b6', '#7f3b83'];

    // 防抖颜色更新
    const debouncedSwitchThemeColor = useMemo(
        () =>
            debounce((color: string) => {
                try {
                    notify(color);
                } catch (error) {
                    message.error('颜色改变通知失败').then();
                }
            }, 300),
        [],
    );

    // 处理颜色变化
    const handleColorChange = (newColor) => {
        // 立即更新 UI 显示
        setThemeColor(newColor);
        // 使用防抖函数通知外部函数
        debouncedSwitchThemeColor(newColor);
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                outline: 'none',
                userSelect: 'none',
            }}
        >
            {/* 主题色选择 */}
            <ColorPicker
                className={styles.colorPicker}
                value={themeColor}
                onChange={(color) => handleColorChange(color.toHexString())}
                showText={false}
                size="small"
                style={{outline: 'none'}}
            />
            {colorOptions.map((color) => (
                <div
                    key={color}
                    style={{
                        height: 15,
                        width: 15,
                        backgroundColor: color,
                        cursor: 'pointer',
                        outline: 'none',
                        userSelect: 'none',
                        borderRadius: '2px',
                    }}
                    onClick={() => handleColorChange(color)}
                    tabIndex={-1}
                />
            ))}
        </div>
    );
};

const MyColorPicker: React.FC = ({
                                     initialColor = '#81d3f8',
                                     notify,
                                     initialStyle = {},
                                     initialColorOptions = [],
                                 }) => {
    // 主题色
    const [themeColor, setThemeColor] = useState<string>(initialColor);

    return (
        <Popover
            autoAdjustOverflow
            placement={'bottomRight'}
            content={
                <InnerPicker
                    initColor={themeColor}
                    initialColorOptions={initialColorOptions}
                    notify={(color) => {
                        setThemeColor(color);
                        notify(color);
                    }}
                />
            }
        >
            <div
                style={{
                    height: 18,
                    width: 18,
                    backgroundColor: '#ffffff',
                    borderRadius: '20%',
                    border: `1px solid ${themeColor}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    userSelect: 'none',
                    flexShrink: 0, // 防止收缩
                    whiteSpace: 'nowrap', // 防止内容换行
                    ...initialStyle,
                }}
                tabIndex={-1}
            >
                <div
                    id="innerColorBlock"
                    style={{
                        height: '75%',
                        width: '75%',
                        backgroundColor: themeColor,
                        borderRadius: '20%',
                        outline: 'none',
                        userSelect: 'none',
                    }}
                />
            </div>
        </Popover>
    );
};

export default MyColorPicker;
