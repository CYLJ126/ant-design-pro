import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Button,
    Cascader,
    Checkbox,
    Col,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Switch,
    Tabs,
    TreeSelect,
    Upload,
} from 'antd';
import {debounce} from 'lodash';
import {DynamicFormProps, FormFieldConfig} from './FormField';
import RegionPicker from './RegionPicker';
import NumberRange from './NumberRange';
import HistoryTab from './HistoryTab';

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const DynamicForm: React.FC<DynamicFormProps> = ({
                                                     fields,
                                                     initialValues = {},
                                                     onSubmit,
                                                     onCancel,
                                                     mode = 'create',
                                                     size = 'medium',
                                                     columns = 2,
                                                     submitText = '提交',
                                                     cancelText = '取消',
                                                     submitShortcut = 'Ctrl+S',
                                                     cancelShortcut = 'Escape',
                                                     loading = false,
                                                     historyData,
                                                 }) => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<Record<string, any>>(initialValues);
    const [optionsCache, setOptionsCache] = useState<Record<string, any[]>>({});
    const [submitConfirmVisible, setSubmitConfirmVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('form');

    // 样式配置
    const sizeConfig = useMemo(() => {
        const configs = {
            small: {height: 24, width: 240, fontSize: 13},
            medium: {height: 28, width: 280, fontSize: 16},
            large: {height: 32, width: 320, fontSize: 20},
        };
        return configs[size];
    }, [size]);

    // 计算栅格列宽
    const colSpan = 24 / columns;

    // 初始化表单数据
    useEffect(() => {
        form.setFieldsValue(initialValues);
        setFormData(initialValues);
    }, [form, initialValues]);

    const handleSubmitClick = () => {
        setSubmitConfirmVisible(true);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode === 'view') return;

            const isCtrlS = e.ctrlKey && e.key === 's';
            const isEscape = e.key === 'Escape';

            if (isCtrlS && submitShortcut === 'Ctrl+S') {
                e.preventDefault();
                handleSubmitClick();
            } else if (isEscape && cancelShortcut === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, submitShortcut, cancelShortcut]);

    // 加载选项数据
    const loadOptions = useCallback(
        async (field: FormFieldConfig, dependentValues?: Record<string, any>) => {
            if (!field.optionUrl) return;

            try {
                const params = dependentValues || {};
                const response = await fetch(`${field.optionUrl}?${new URLSearchParams(params)}`);
                const data = await response.json();

                const keyMap = field.optionKeyMap || {label: 'label', value: 'value'};
                const options = data.map((item: any) => ({
                    label: item[keyMap.label],
                    value: item[keyMap.value],
                    ...item,
                }));

                setOptionsCache((prev) => ({
                    ...prev,
                    [field.fieldName]: options,
                }));
            } catch (error) {
                console.error(`Failed to load options for ${field.fieldName}:`, error);
                message.error(`加载${field.label}选项失败`);
            }
        },
        [],
    );

    // 处理字段值变化
    const handleFieldChange = useCallback(
        (field: FormFieldConfig, value: any) => {
            const newFormData = {...formData, [field.fieldName]: value};
            setFormData(newFormData);

            // 执行自定义 onChange
            if (field.onChange) {
                field.onChange(value, field.fieldName, newFormData);
            }

            // 处理依赖字段
            fields.forEach((f) => {
                if (f.dependOn && f.dependOn.includes(field.fieldName)) {
                    const dependentValues = f.dependOn.reduce(
                        (acc, dep) => {
                            acc[dep] = newFormData[dep];
                            return acc;
                        },
                        {} as Record<string, any>,
                    );
                    loadOptions(f, dependentValues);
                }
            });
        },
        [formData, fields, loadOptions],
    );

    // 创建防抖处理函数
    const createDebouncedHandler = useCallback(
        (field: FormFieldConfig) => {
            if (!field.debounce) {
                return (value: any) => handleFieldChange(field, value);
            }
            return debounce((value: any) => handleFieldChange(field, value), field.debounce);
        },
        [handleFieldChange],
    );

    // 渲染表单控件
    const renderFormItem = (field: FormFieldConfig) => {
        const isDisabled = mode === 'view' || (mode === 'edit' && field.canEdit === false);
        const commonProps = {
            style: {
                height: sizeConfig.height,
                width: sizeConfig.width,
                fontSize: sizeConfig.fontSize,
                ...field.extraStyle,
            },
            className: field.extraClassName,
            disabled: isDisabled,
            placeholder: field.placeholder,
            ...field.extraProps,
        };

        const debouncedHandler = createDebouncedHandler(field);

        switch (field.fieldType) {
            case 'input':
                return (
                    <Input
                        {...commonProps}
                        onChange={(e) => debouncedHandler(e.target.value)}
                        allowClear={field.clearable}
                    />
                );

            case 'textarea':
                return (
                    <TextArea
                        {...commonProps}
                        style={{width: '100%'}}
                        rows={4}
                        onChange={(e) => debouncedHandler(e.target.value)}
                        allowClear={field.clearable}
                    />
                );

            case 'number':
                return (
                    <InputNumber
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        onChange={(value) => debouncedHandler(value)}
                    />
                );

            case 'password':
                return (
                    <Input.Password
                        {...commonProps}
                        onChange={(e) => debouncedHandler(e.target.value)}
                        allowClear={field.clearable}
                    />
                );

            case 'select':
                return (
                    <Select
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        onChange={(value) => handleFieldChange(field, value)}
                        allowClear={field.clearable}
                        options={field.options || optionsCache[field.fieldName] || []}
                        mode={field.extraProps?.multiple ? 'multiple' : undefined}
                    />
                );

            case 'checkbox-group':
                return (
                    <Checkbox.Group
                        {...commonProps}
                        options={field.options || optionsCache[field.fieldName] || []}
                        onChange={(value) => handleFieldChange(field, value)}
                    />
                );

            case 'tree-select':
                return (
                    <TreeSelect
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        treeData={field.options || optionsCache[field.fieldName] || []}
                        onChange={(value) => handleFieldChange(field, value)}
                        allowClear={field.clearable}
                    />
                );

            case 'cascader':
                return (
                    <Cascader
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        options={field.options || optionsCache[field.fieldName] || []}
                        onChange={(value) => handleFieldChange(field, value)}
                        allowClear={field.clearable}
                    />
                );

            case 'switch':
                return (
                    <Switch {...commonProps} onChange={(checked) => handleFieldChange(field, checked)}/>
                );

            case 'radio':
                return (
                    <Radio.Group
                        {...commonProps}
                        options={field.options || optionsCache[field.fieldName] || []}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                    />
                );

            case 'date-picker':
                return (
                    <DatePicker
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        onChange={(date, dateString) => handleFieldChange(field, dateString)}
                        format={field.extraProps?.format || 'YYYY-MM-DD'}
                        allowClear={field.clearable}
                    />
                );

            case 'date-range-picker':
                return (
                    <RangePicker
                        {...commonProps}
                        placeholder={['开始日期', '结束日期']}
                        style={{...commonProps.style, width: sizeConfig.width * 1.5}}
                        onChange={(dates, dateStrings) => handleFieldChange(field, dateStrings)}
                        format={field.extraProps?.format || 'YYYY-MM-DD'}
                        allowClear={field.clearable}
                    />
                );

            case 'number-range':
                return (
                    <NumberRange
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        onChange={(value) => handleFieldChange(field, value)}
                        placeholder={[field.placeholder || '最小值', field.placeholder || '最大值']}
                    />
                );

            case 'slider':
                return (
                    <div style={{width: sizeConfig.width}}>
                        <Slider
                            {...commonProps}
                            onChange={(value: any) => handleFieldChange(field, value)}
                            range={field.extraProps?.range}
                        />
                    </div>
                );

            case 'color-picker':
                return (
                    <ColorPicker
                        {...commonProps}
                        onChange={(color) => handleFieldChange(field, color.toHexString())}
                    />
                );

            case 'rate':
                return <Rate {...commonProps} onChange={(value) => handleFieldChange(field, value)}/>;

            case 'upload':
                return (
                    <Upload {...commonProps} onChange={(info) => handleFieldChange(field, info.fileList)}>
                        <Button>上传文件</Button>
                    </Upload>
                );

            case 'region-picker':
                return (
                    <RegionPicker
                        {...commonProps}
                        style={{...commonProps.style, width: sizeConfig.width}}
                        onChange={(value) => handleFieldChange(field, value)}
                        allowClear={field.clearable}
                    />
                );

            case 'custom':
                return field.render
                    ? field.render({
                        ...commonProps,
                        value: formData[field.fieldName],
                        onChange: (value: any) => handleFieldChange(field, value),
                    })
                    : null;

            default:
                return <Input {...commonProps} />;
        }
    };

    // 处理提交
    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            // 应用转换函数
            const transformedValues = {...values};
            fields.forEach((field) => {
                if (field.transformFunction && transformedValues[field.fieldName] !== undefined) {
                    transformedValues[field.fieldName] = field.transformFunction(
                        transformedValues[field.fieldName],
                    );
                }
            });

            if (onSubmit) {
                await onSubmit(transformedValues);
                message.success(`${mode === 'create' ? '创建' : '更新'}成功`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setSubmitConfirmVisible(false);
        }
    };

    // 渲染表单项
    const renderFormItems = () => {
        return fields
            .filter((field) => !field.visibleFunction || field.visibleFunction(formData))
            .map((field) => {
                const span = field.fullWidth ? 24 : field.span || colSpan;

                return (
                    <Col key={field.fieldName} span={span} style={{marginBottom: 16}}>
                        <Form.Item
                            name={field.fieldName}
                            label={
                                <div className={`dynamic-form-label dynamic-form-label-${size}`}>{field.label}</div>
                            }
                            rules={[
                                ...(field.required ? [{required: true, message: `请输入${field.label}`}] : []),
                                ...(field.rules || []),
                            ]}
                            initialValue={field.defaultValue}
                        >
                            {renderFormItem(field)}
                        </Form.Item>
                    </Col>
                );
            });
    };

    const tabItems = [
        {
            key: 'form',
            label: '基本信息',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    className={`dynamic-form dynamic-form-${size}`}
                    style={{fontSize: sizeConfig.fontSize}}
                >
                    <Row gutter={[16, 0]}>{renderFormItems()}</Row>
                </Form>
            ),
        },
    ];

    if (mode === 'view' && historyData) {
        tabItems.push({
            key: 'history',
            label: '历史记录',
            children: <HistoryTab data={historyData}/>,
        });
    }

    return (
        <div className="dynamic-form-container">
            {mode === 'view' ? (
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}/>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    className={`dynamic-form dynamic-form-${size}`}
                    style={{fontSize: sizeConfig.fontSize}}
                >
                    <Row gutter={[16, 0]}>{renderFormItems()}</Row>
                </Form>
            )}

            {mode !== 'view' && (
                <div className="dynamic-form-actions">
                    <Button
                        type="primary"
                        onClick={handleSubmitClick}
                        loading={loading}
                        size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'middle'}
                    >
                        {submitText} ({submitShortcut})
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'middle'}
                        style={{marginLeft: 8}}
                    >
                        {cancelText} ({cancelShortcut})
                    </Button>
                </div>
            )}

            <Modal
                title="确认提交"
                open={submitConfirmVisible}
                onOk={handleSubmit}
                onCancel={() => setSubmitConfirmVisible(false)}
                okText="确认"
                cancelText="取消"
            >
                确定要{mode === 'create' ? '创建' : '更新'}此记录吗？
            </Modal>
        </div>
    );
};

export default DynamicForm;
