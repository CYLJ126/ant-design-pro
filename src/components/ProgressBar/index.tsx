import React from 'react';
import {Progress} from 'antd';
import {createStyles} from 'antd-style';

interface ProgressBarProps {
    /** 进度百分比 */
    progress: number;
    /** 进度条高度，默认 18px */
    height?: number;
    /** 进度条宽度，默认 100% */
    width?: string | number;
    /** 进度条颜色，默认 #81d3f8 */
    strokeColor?: string;
    /** 轨道颜色，默认 #c6c6c6 */
    railColor?: string;
    /** 子组件，会覆盖在进度条上方 */
    children?: React.ReactNode;
    /** 额外的样式类名 */
    className?: string;
    /** 额外的样式 */
    style?: React.CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = createStyles(({token}, {height}: {
    height: number
}) => ({
    container: {
        width: '100%',
        height: `${height}px`,
        marginBottom: '5px',
        position: 'relative',
    },
    progress: {
        position: 'absolute',
        width: '100%',
        height: `${height}px`,
        zIndex: 1,
        borderRadius: '5px',

        '.ant-progress-rail': {
            borderRadius: '5px !important',
        },
    },
    childrenWrapper: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        width: '100%',
        height: `${height}px`,
        borderRadius: '5px',

        '&:hover': {
            borderRadius: '5px',
        },
    },
}));

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                     progress, // 进度百分比
                                                     showInfo = true, // 是否显示进度百分比
                                                     height = 18, // 进度条高度
                                                     width = '100%', // 进度条宽度
                                                     strokeColor = '#81d3f8', // 进度条颜色（占比）
                                                     railColor = '#c6c6c6', // 轨道颜色
                                                     children, // 子组件，会覆盖在进度条上方
                                                     className, // 额外的样式类名
                                                     style, // 额外的样式
                                                 }) => {
    const {styles, cx} = useStyles({height});

    const containerStyle: React.CSSProperties = {
        ...style,
        ...(typeof width === 'number' ? {width: `${width}px`} : {width}),
    };

    return (
        <div className={cx(styles.container, className)} style={containerStyle}>
            <Progress
                percent={progress}
                showInfo={showInfo}
                strokeColor={strokeColor}
                railColor={railColor}
                strokeWidth={height}
                className={styles.progress}
            />
            {children && <div className={styles.childrenWrapper}>{children}</div>}
        </div>
    );
};

export default ProgressBar;
