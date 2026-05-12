import React, {useState} from 'react';
import {Badge, Button, Cascader, CascaderProps} from 'antd';
import {Option} from 'commander';
import {MinusCircleOutlined} from '@ant-design/icons';
import styles from './index.less';

const MyTag: React.FC = ({tag, clickTag, removeTag, color, buttonStyle = {}}) => {
    const myButtonStyle = {
        height: 20,
        color: '#ffffff',
        backgroundColor: color,
        whiteSpace: 'nowrap',
        border: 'none',
        borderRadius: '20%',
        fontSize: 14,
        ...buttonStyle,
    };
    return (
        <Badge
            count={
                <MinusCircleOutlined
                    className={styles.closeIcon}
                    onClick={(e) => {
                        removeTag(tag);
                        e.stopPropagation();
                    }}
                />
            }
        >
            <Button onClick={() => clickTag(tag)} style={myButtonStyle}>
                {tag.name}
            </Button>
        </Badge>
    );
};

/**
 * 标签选择器
 * @param addTags 添加标签的回调函数
 * @param options 标签选项
 * @constructor TagsSelector
 */
const TagsSelector: React.FC = ({selectTag, options}) => {
    const [value, setValue] = useState<(string | number)[][]>([]);

    const onChange: CascaderProps<Option, 'value', true>['onChange'] = (value, selectedOptions) => {
        const selectedCascader = selectedOptions[selectedOptions.length - 1];
        if (!selectedCascader) {
            // 取消选择时也会触发，这时什么也不做
            return;
        }
        const currentSelected = selectedOptions[selectedOptions.length - 1];
        selectTag({id: currentSelected.id, name: currentSelected.name});
        // 由于在多选情况下，最后一次选择会出现选到了父级的情况，所以每次都将选中的值置清空，确保每次添加的都是选中的最末级标签
        setValue([]);
    };

    return (
        <Cascader
            className={styles.cascader}
            value={value}
            options={options}
            expandTrigger="hover"
            onChange={onChange}
            changeOnSelect
            fieldNames={{label: 'name', value: 'id'}}
        />
    );
};

export default TagsSelector;
export {MyTag};
