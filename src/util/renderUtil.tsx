// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Upload,
  DatePicker,
} from 'antd';
import { MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import { FieldSchema } from '@interfaces';
import { FieldPath } from '../components/form/state/fieldpath';
import {
  SupportedUnknownType,
  UnknownEntry,
} from '../components/form/state/unknowns';
import { FieldType } from '@enums';

export const renderUnknownValueField = (
  type: SupportedUnknownType,
  disabled: boolean = false,
) => {
  switch (type) {
    case 'string':
      return <Input placeholder="Enter text" disabled={disabled} />;
    case 'number':
      return <InputNumber placeholder="Enter number" disabled={disabled} />;
    case 'boolean':
      return <Switch defaultValue={true} disabled={disabled} />;
    default:
      return null;
  }
};

export const renderUploadField = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  disabled: boolean,
) => {
  return (
    <Form.Item
      label={schema.label}
      name={fieldPath.namePath}
      getValueFromEvent={(e) => {
        // Return the first file from the fileList array
        return e && e.fileList ? e.fileList[0]?.originFileObj : null;
      }}
    >
      <Upload
        name={'file'}
        disabled={disabled}
        maxCount={1}
        accept={
          schema.supportedFileFormats
            ? schema.supportedFileFormats.join(',')
            : undefined
        }
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  );
};

export const renderOptionalToggle = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  toggleOptionalField: any,
) => {
  return (
    <div
      key={`${fieldPath.key}-optional-toggle`}
      className="optional-field-toggle"
    >
      <span>{schema.label}</span>
      <Button
        type="link"
        onClick={() => toggleOptionalField && toggleOptionalField(fieldPath)}
      >
        (Optional) <PlusOutlined />
      </Button>
    </div>
  );
};

export const renderLabel = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  disabled: boolean,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) => {
  return (
    <div className="form-item-label">
      <span>{schema.label}</span>
      {tryRenderOptionalButton(
        schema,
        fieldPath,
        disabled,
        visibleOptionalFields,
        toggleOptionalField,
      )}
    </div>
  );
};

export const tryRenderOptionalButton = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  disabled: boolean,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) => {
  return (
    !disabled &&
    !schema.isRequired && (
      <Button type="link" onClick={() => toggleOptionalField(fieldPath)}>
        (Optional){' '}
        {visibleOptionalFields &&
        visibleOptionalFields.isEnabled(fieldPath.key) ? (
          <MinusOutlined />
        ) : (
          <PlusOutlined />
        )}
      </Button>
    )
  );
};

export const renderUnknownField = (
  unknown: any,
  schema: FieldSchema,
  fieldPath: FieldPath,
  hideLabels: boolean,
  disabled: boolean,
  modifyUnknowns: any,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) => {
  return (
    <Form.Item
      label={
        hideLabels
          ? undefined
          : renderLabel(
              schema,
              fieldPath,
              disabled,
              visibleOptionalFields,
              toggleOptionalField,
            )
      }
      required={schema.isRequired}
      layout={'vertical'}
      className="merged-ant-form-item"
    >
      <Form.Item label={'Type'}>
        <Select
          disabled={disabled}
          value={unknown.type}
          onChange={(value: SupportedUnknownType) => {
            modifyUnknowns('updateFirst', fieldPath, { type: value });
          }}
          options={[
            { value: 'string', label: 'String' },
            { value: 'number', label: 'Number' },
            { value: 'boolean', label: 'Boolean' },
          ]}
        />
      </Form.Item>
      {unknown.type && (
        <Form.Item name={fieldPath.namePath} label={'Value'}>
          {unknown.type === 'string' && (
            <Input placeholder="Enter text" disabled={disabled} />
          )}
          {unknown.type === 'number' && (
            <InputNumber placeholder="Enter number" disabled={disabled} />
          )}
          {unknown.type === 'boolean' && <Switch />}
        </Form.Item>
      )}
    </Form.Item>
  );
};

export const renderUnknownProperty = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  unknown: any,
  updateUnknown: (value: Partial<UnknownEntry>) => void,
  disabled: boolean,
) => {
  return (
    <Form.Item required={schema.isRequired} className="merged-ant-form-item">
      <Row gutter={32}>
        <Col span={4}>
          <Form.Item label="Key">
            <Input
              disabled={disabled}
              value={unknown?.name}
              onChange={(e) => updateUnknown({ name: e.target.value })}
              placeholder="Enter text"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Type" layout="horizontal">
            <Select
              disabled={disabled}
              value={unknown?.type}
              onChange={(value: SupportedUnknownType) =>
                updateUnknown({ type: value })
              }
              options={[
                { value: 'string', label: 'String' },
                { value: 'number', label: 'Number' },
                { value: 'boolean', label: 'Boolean' },
              ]}
            />
          </Form.Item>
        </Col>
        {unknown.type && unknown.name && (
          <Col span={16}>
            <Form.Item
              label={'Value'}
              layout="horizontal"
              name={[...fieldPath.namePath, unknown.name]}
            >
              {renderUnknownValueField(unknown.type, disabled)}
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form.Item>
  );
};

export const renderFieldContent = (field: FieldSchema, disabled = false) => {
  switch (field.type) {
    case FieldType.number:
      return <InputNumber disabled={disabled} />;
    case FieldType.boolean:
      return <Switch disabled={disabled} />;
    case FieldType.select:
      return (
        <Select mode={field.selectMode as any} disabled={disabled}>
          {field.options?.map((option, _ix) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    case FieldType.datetime:
      return <DatePicker showTime disabled={disabled} />;
    case FieldType.input:
    default:
      return <Input disabled={disabled} />;
  }
};

export const renderPrimitiveField = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  hideLabels: boolean,
  disabled: boolean,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) => {
  return (
    <Form.Item
      key={`${fieldPath.key}-primitive`}
      label={
        hideLabels
          ? undefined
          : renderLabel(
              schema,
              fieldPath,
              disabled,
              visibleOptionalFields,
              toggleOptionalField,
            )
      }
      name={fieldPath.namePath}
      required={schema.isRequired}
    >
      {renderFieldContent(schema, disabled)}
    </Form.Item>
  );
};

export const renderEnumSelectOptions = <T extends object>(enumType: T) => {
  const enumValues = Object.values(enumType);

  return enumValues.map((value) => (
    <Select.Option key={value} value={value}>
      {value}
    </Select.Option>
  ));
};
