import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Upload,
} from 'antd';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import './style.scss';
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { defaultMetadataStorage } from '../../util/DefaultMetadataStorage';
import { isDefined, isNullOrUndefined } from '../../util/assertion';
import { IS_DATE } from '../../util/TransformDate';
import { FIELD_LABEL } from '../../util/decorators/FieldLabel';
import { Constructable } from '../../util/Constructable';
import {
  GQL_ASSOCIATION,
  GqlAssociationProps,
} from '../../util/decorators/GqlAssociation';

import { getProperty, omitProperties } from '../../util/objects';
import { Flags } from './state/flags';
import {
  SupportedUnknownType,
  UnknownEntry,
  Unknowns,
  UnknownsActions,
} from './state/unknowns';
import { FieldPath } from './state/fieldpath';
import { CUSTOM_FORM_RENDER } from '../../util/decorators/CustomFormRender';
import { CLASS_CUSTOM_CONSTRUCTOR } from '../../util/decorators/ClassCustomConstructor';
import { isSortable } from '../../util/decorators/Sortable';
import { NestedObjectField } from './nested-object-field';
import { ArrayField } from './array-field';
import { SUPPORTED_FILE_FORMATS } from '../../util/decorators/SupportedFileFormats';
import { CustomAction } from '../custom-actions';
import { FIELD_CUSTOM_ACTIONS } from '../../util/decorators/FieldCustomActions';
import { useSelector } from 'react-redux';
import { FieldAnnotations } from '../data-model-table/editable';
import { HIDDEN_WHEN } from '../../util/decorators/HiddenWhen';

export enum ReflectType {
  array,
  string,
  date,
  number,
  boolean,
  object,
  unknown,
  unknownProperty,
  unknownProperties,
}

export enum SelectMode {
  multiple = 'multiple',
  tags = 'tags',
}

export enum FieldType {
  select,
  datetime,
  input,
  number,
  boolean,
  nestedObject,
  array,
  unknown,
  unknownProperty,
  unknownProperties,
  customRender,
  file,
}

export interface FieldSelectOption {
  label: string;
  value: string;
}

export interface FieldSchema {
  parentInstance: any;
  label: string;
  name: string;
  type: FieldType;
  options?: FieldSelectOption[];
  selectMode?: SelectMode;
  nestedFields?: FieldSchema[];
  isRequired?: boolean;
  customRender?: (record?: any) => any;
  dtoClass?: Constructable<any>;
  customConstructor?: () => any;
  gqlAssociationProps?: GqlAssociationProps;
  customActions?: CustomAction<any>[];
  sorter: boolean;
  supportedFileFormats?: string[];
}

export interface DynamicFieldSchema extends FieldSchema {
  position: number;
}

export function isDynamicFieldSchema(value: any): value is DynamicFieldSchema {
  return (
    isDefined(value.label) &&
    isDefined(value.name) &&
    isDefined(value.type) &&
    isDefined(value.position)
  );
}

export type FieldSchemaKeys = keyof FieldSchema;

export interface GenericProps {
  dtoClass: Constructable<any>;
  parentRecord?: any;
  formProps?: any;
  overrides?: { [key in FieldSchemaKeys]: Partial<FieldSchema> };
  onFinish?: (values: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  disabled?: boolean;
  submitDisabled?: boolean;
}

export interface GenericFormProps extends GenericProps {
  ref?: React.Ref<FormInstance>;
  initialValues?: any;
  fieldAnnotations?: FieldAnnotations;
}

export const getReflectTypeFromString = (type: string): ReflectType => {
  switch (type) {
    case 'array':
      return ReflectType.array;
    case 'date':
      return ReflectType.date;
    case 'number':
      return ReflectType.number;
    case 'boolean':
      return ReflectType.boolean;
    case 'string':
      return ReflectType.string;
    case 'unknown':
      return ReflectType.unknown;
    case 'unknownproperty':
      return ReflectType.unknownProperty;
    case 'unknownproperties':
      return ReflectType.unknownProperties;
    default:
    case 'object':
      return ReflectType.object;
  }
};

export const getFieldType = (type: ReflectType): FieldType => {
  switch (type) {
    case ReflectType.array:
      return FieldType.array;
    case ReflectType.date:
      return FieldType.datetime;
    case ReflectType.number:
      return FieldType.number;
    case ReflectType.boolean:
      return FieldType.boolean;
    case ReflectType.object:
      return FieldType.nestedObject;
    case ReflectType.unknown:
      return FieldType.unknown;
    case ReflectType.unknownProperty:
      return FieldType.unknownProperty;
    case ReflectType.unknownProperties:
      return FieldType.unknownProperties;
    case ReflectType.string:
    default:
      return FieldType.input;
  }
};

export const getClassTransformerType = (instance: any, key: string): any => {
  const metadata = defaultMetadataStorage.findTypeMetadata(
    instance.constructor,
    key,
  );
  if (metadata && metadata.typeFunction) {
    return metadata.typeFunction();
  }
  return undefined;
};

export const label = (instance: any, key: string) => {
  const label = Reflect.getMetadata(FIELD_LABEL, instance, key);
  if (label) {
    return label;
  }
  return keyToLabel(key);
};

export const keyToLabel = (key: string) => {
  return key
    .replace('_', '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export const getSchemaForInstanceAndKey = (
  instance: any,
  key: string,
  requiredFields: string[],
  fieldAnnotations?: FieldAnnotations,
): FieldSchema => {
  const sorter = isSortable(instance.constructor, key);

  const customActions = Reflect.getMetadata(
    FIELD_CUSTOM_ACTIONS,
    instance,
    key,
  );

  const customFormRender = Reflect.getMetadata(
    CUSTOM_FORM_RENDER,
    instance,
    key,
  );

  if (customFormRender) {
    return {
      parentInstance: instance,
      label: label(instance, key),
      name: key,
      type: FieldType.customRender,
      customRender: customFormRender,
      isRequired: requiredFields.includes(key),
      sorter,
      customActions,
    };
  }

  const metadata = Reflect.getMetadata('design:type', instance, key);
  let type, fieldType;
  let options: FieldSelectOption[] | undefined = undefined;
  // enum
  if (typeof metadata === 'object') {
    type = ReflectType.string;
    fieldType = FieldType.select;
    options = Object.keys(metadata).map((key: any) => {
      const value = metadata[key];
      return {
        label: key,
        value: value,
      } as FieldSelectOption;
    });
  } else {
    const isDate = Reflect.getMetadata(IS_DATE, instance, key);
    if (isDate) {
      type = ReflectType.date;
      fieldType = FieldType.datetime;
    } else {
      // === 'function'
      type = getReflectTypeFromString(metadata.name.toLowerCase());
      fieldType = getFieldType(type);
    }
  }

  if (fieldType === FieldType.nestedObject) {
    const classTransformerType = getClassTransformerType(instance, key);
    if (classTransformerType === File) {
      const supportedFileFormats: string[] = Reflect.getMetadata(
        SUPPORTED_FILE_FORMATS,
        instance,
        key,
      );
      return {
        parentInstance: instance,
        label: label(instance, key),
        name: key,
        type: FieldType.file,
        isRequired: requiredFields.includes(key),
        dtoClass: classTransformerType,
        sorter,
        supportedFileFormats,
      };
    }
    const nestedInstance: any = plainToInstance(metadata, {});
    const nestedFields = extractSchema(nestedInstance.constructor);
    const gqlAssociationProps: GqlAssociationProps = Reflect.getMetadata(
      GQL_ASSOCIATION,
      instance,
      key,
    );
    const customConstructor = Reflect.getMetadata(
      CLASS_CUSTOM_CONSTRUCTOR,
      nestedInstance,
    );
    return {
      parentInstance: instance,
      label: label(instance, key),
      name: key,
      type: FieldType.nestedObject,
      isRequired: requiredFields.includes(key),
      nestedFields,
      dtoClass: classTransformerType,
      customConstructor,
      gqlAssociationProps,
      sorter,
      customActions,
    };
  }

  if (fieldType === FieldType.array) {
    const classTransformerType = getClassTransformerType(instance, key);
    if (typeof classTransformerType === 'object') {
      // enum
      options = Object.keys(classTransformerType).map((key: any) => {
        const value = classTransformerType[key];
        return {
          label: key,
          value: value,
        } as FieldSelectOption;
      });
      return {
        parentInstance: instance,
        label: label(instance, key),
        name: key,
        type: FieldType.array,
        isRequired: requiredFields.includes(key),
        options,
        sorter,
        customActions,
      };
    } else {
      const nestedInstance: any = plainToInstance(classTransformerType, {});
      const annotatedGqlAssociationProps: GqlAssociationProps =
        Reflect.getMetadata(GQL_ASSOCIATION, instance, key);
      let gqlAssociationProps;
      if (fieldAnnotations && fieldAnnotations[key]?.gqlAssociationProps) {
        gqlAssociationProps = fieldAnnotations[key]?.gqlAssociationProps;
      } else if (annotatedGqlAssociationProps) {
        gqlAssociationProps = annotatedGqlAssociationProps;
      }
      const customConstructor = Reflect.getMetadata(
        CLASS_CUSTOM_CONSTRUCTOR,
        nestedInstance,
      );
      return {
        parentInstance: instance,
        label: label(instance, key),
        name: key,
        type: FieldType.array,
        isRequired: requiredFields.includes(key),
        nestedFields: classTransformerType
          ? extractSchema(classTransformerType, fieldAnnotations)
          : undefined,
        dtoClass: classTransformerType,
        customConstructor,
        gqlAssociationProps,
        sorter,
        customActions,
      };
    }
  }

  if (fieldType === FieldType.unknownProperty) {
    return {
      parentInstance: instance,
      label: label(instance, key),
      name: key,
      type: FieldType.unknownProperty,
      isRequired: requiredFields.includes(key),
      sorter,
      customActions,
    };
  }

  if (fieldType === FieldType.unknownProperties) {
    return {
      parentInstance: instance,
      label: label(instance, key),
      name: key,
      type: FieldType.unknownProperties,
      isRequired: requiredFields.includes(key),
      sorter,
      customActions,
    };
  }

  return {
    parentInstance: instance,
    label: label(instance, key),
    name: key,
    type: fieldType,
    isRequired: requiredFields.includes(key),
    selectMode: type === ReflectType.array ? SelectMode.multiple : undefined,
    selectValues: type === ReflectType.array ? instance[key] : undefined,
    options: options,
    sorter,
    customActions,
  };
};

export const extractSchema = (
  dtoClass: any,
  fieldAnnotations?: FieldAnnotations,
): FieldSchema[] => {
  const instance = plainToInstance(
    dtoClass,
    {},
    {
      excludeExtraneousValues: false,
    },
  );
  const errors = validateSync(instance as any);
  const requiredFields = errors
    .filter((error) => error.constraints)
    .map((error) => error.property);
  const schema: FieldSchema[] = [];

  Object.keys(instance as any).forEach((key) => {
    try {
      schema.push(
        getSchemaForInstanceAndKey(
          instance,
          key,
          requiredFields,
          fieldAnnotations,
        ),
      );
    } catch (e: any) {
      console.error('Error extracting key: %s', key, e);
    }
  });
  return schema;
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

export interface RenderFieldProps {
  schema: FieldSchema;
  preFieldPath: FieldPath;
  disabled: boolean;
  visibleOptionalFields?: Flags;
  hideLabels?: boolean;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  modifyUnknowns?: any;
  form?: any;
  parentRecord?: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
}

export const renderField = (props: RenderFieldProps) => {
  const {
    schema,
    preFieldPath = FieldPath.empty(),
    disabled = false,
    visibleOptionalFields,
    hideLabels = false,
    enableOptionalField,
    toggleOptionalField,
    unknowns,
    modifyUnknowns,
    form,
    parentRecord,
    useSelector,
    fieldAnnotations,
  } = props;

  const isHiddenCheck = Reflect.getMetadata(
    HIDDEN_WHEN,
    schema.parentInstance as any,
    schema.name,
  );

  if (
    isHiddenCheck &&
    isHiddenCheck(form.getFieldValue(preFieldPath.keyPath))
  ) {
    return;
  }

  let fieldPath = preFieldPath.with(schema.name);
  if (schema.type === FieldType.customRender && schema.customRender) {
    return schema.customRender(parentRecord);
  }

  if (
    !hideLabels &&
    !disabled &&
    !schema.isRequired &&
    visibleOptionalFields &&
    !visibleOptionalFields.isEnabled(fieldPath.key)
  ) {
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
  }
  if (schema.type === FieldType.file) {
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
  }

  if (schema.type === FieldType.array) {
    return (
      <ArrayField
        fieldPath={fieldPath}
        schema={schema}
        hideLabels={hideLabels}
        disabled={disabled}
        visibleOptionalFields={visibleOptionalFields}
        enableOptionalField={enableOptionalField}
        toggleOptionalField={toggleOptionalField}
        unknowns={unknowns}
        modifyUnknowns={modifyUnknowns}
        form={form}
        parentRecord={parentRecord}
        useSelector={useSelector}
        fieldAnnotations={fieldAnnotations}
      />
    );
  }

  if (schema.type === FieldType.nestedObject) {
    return (
      <NestedObjectField
        fieldPath={fieldPath}
        schema={schema}
        hideLabels={hideLabels}
        disabled={disabled}
        visibleOptionalFields={visibleOptionalFields}
        enableOptionalField={enableOptionalField}
        toggleOptionalField={toggleOptionalField}
        unknowns={unknowns}
        modifyUnknowns={modifyUnknowns}
        form={form}
        parentRecord={parentRecord}
        useSelector={useSelector}
      />
    );
  }

  if (schema.type === FieldType.unknown) {
    const unknown = unknowns?.findFirst(fieldPath);
    if (isNullOrUndefined(unknown)) {
      return modifyUnknowns('registerFirst', fieldPath);
    }

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
  }

  if (schema.type === FieldType.unknownProperty) {
    let unknown: UnknownEntry | undefined;
    let updateUnknown: (value: Partial<UnknownEntry>) => void;

    if (isDynamicFieldSchema(schema)) {
      fieldPath = fieldPath.pop().popName();
      unknown = unknowns?.find(fieldPath, schema.position)!;
      updateUnknown = (value: Partial<UnknownEntry>) =>
        modifyUnknowns('update', fieldPath, schema.position, value);
    } else {
      fieldPath = fieldPath.popName();
      unknown = unknowns?.findFirst(fieldPath);
      if (isNullOrUndefined(unknown)) {
        return modifyUnknowns('registerFirst', fieldPath);
      }
      updateUnknown = (value: Partial<UnknownEntry>) =>
        modifyUnknowns('updateFirst', fieldPath, value);
    }

    return (
      <Form.Item required={schema.isRequired} className="merged-ant-form-item">
        <Row gutter={32}>
          <Col span={4}>
            <Form.Item label={'Key'}>
              <Input
                disabled={disabled}
                value={unknown?.name}
                onChange={(e) => updateUnknown({ name: e.target.value })}
                placeholder="Enter text"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'Type'} layout="horizontal">
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

          {unknown && unknown.type && unknown.name && (
            <Col span={16}>
              <Form.Item
                label={'Value'}
                layout="horizontal"
                name={[...fieldPath.namePath, unknown.name]}
              >
                {unknown.type === 'string' && (
                  <Input disabled={disabled} placeholder="Enter text" />
                )}
                {unknown.type === 'number' && (
                  <InputNumber disabled={disabled} placeholder="Enter number" />
                )}
                {unknown.type === 'boolean' && (
                  <Switch disabled={disabled} defaultValue={true} />
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form.Item>
    );
  }

  if (schema.type === FieldType.unknownProperties) {
    return (
      <Form.Item required={schema.isRequired}>
        {!hideLabels &&
          renderLabel(
            schema,
            fieldPath,
            disabled,
            visibleOptionalFields,
            toggleOptionalField,
          )}
        <div>
          {unknowns?.findAll(fieldPath)?.map((_: any, arrayIndex: any) => (
            <Row key={fieldPath.key + arrayIndex} align="middle">
              <Col span={23}>
                {
                  renderField({
                    schema: {
                      label: `#${arrayIndex}`,
                      name: arrayIndex,
                      type: FieldType.unknownProperty,
                      isRequired: true,
                      position: arrayIndex,
                    } as any,
                    preFieldPath: fieldPath,
                    disabled: disabled,
                    visibleOptionalFields: visibleOptionalFields,
                    hideLabels: hideLabels,
                    enableOptionalField: enableOptionalField,
                    toggleOptionalField: toggleOptionalField,
                    unknowns: unknowns,
                    modifyUnknowns: modifyUnknowns,
                    form,
                    parentRecord,
                    useSelector,
                    fieldAnnotations,
                  }) as any
                }
              </Col>
              <Col span={1}>
                <CloseOutlined
                  style={{ marginLeft: '24px' }}
                  onClick={() => {
                    modifyUnknowns('remove', fieldPath, arrayIndex);
                  }}
                />
              </Col>
            </Row>
          ))}
        </div>
        <Button
          type="dashed"
          onClick={() => modifyUnknowns('registerLast', fieldPath)}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
        >
          Add {schema.label}
        </Button>
      </Form.Item>
    );
  }

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

export const renderLabel = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  disabled: boolean,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) => (
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

export const recreateState = (
  values: any,
  fieldSchema: FieldSchema,
  enableOptionalField: any,
  modifyUnknowns: any,
  preFieldPath: FieldPath = FieldPath.empty(),
  parentSchema?: FieldSchema,
) => {
  const fieldPath = preFieldPath.with(fieldSchema.name);
  const fieldValue = getProperty(values, fieldPath.namePath);

  if (!fieldSchema.isRequired && isDefined(fieldValue)) {
    enableOptionalField(fieldPath);
  }

  if (
    fieldSchema.type === FieldType.unknown ||
    fieldSchema.type === FieldType.unknownProperty ||
    fieldSchema.type === FieldType.unknownProperties
  ) {
    const fieldOwner = getProperty(values, fieldPath.popName().namePath);

    if (isDefined(fieldOwner)) {
      const knownFields = (parentSchema?.nestedFields || [])
        .filter((fs) => fs.type !== FieldType.unknown)
        .filter((fs) => fs.type !== FieldType.unknownProperty)
        .filter((fs) => fs.type !== FieldType.unknownProperties)
        .map((fs) => fs.name);
      const unknownFields = omitProperties(fieldOwner, knownFields);
      modifyUnknowns('override', {
        [fieldPath.key]: Object.entries(unknownFields)
          .filter(([_, value]) => isDefined(value))
          .map(
            ([name, value]) => ({ name, type: typeof value }) as UnknownEntry,
          ),
      });
    }
  }

  fieldSchema?.nestedFields?.forEach((fs) =>
    recreateState(
      values,
      fs,
      enableOptionalField,
      modifyUnknowns,
      fieldPath,
      fieldSchema,
    ),
  );
};

export const tryRenderOptionalButton = (
  schema: FieldSchema,
  fieldPath: FieldPath,
  disabled: boolean,
  visibleOptionalFields: any,
  toggleOptionalField: any,
) =>
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
  );

export const GenericForm = forwardRef(function GenericForm(
  props: GenericFormProps,
  ref,
) {
  const {
    formProps,
    dtoClass,
    overrides,
    onFinish,
    onValuesChange,
    disabled = false,
    initialValues = undefined,
    submitDisabled = false,
    parentRecord,
    fieldAnnotations,
  } = props;

  const [visibleOptionalFields, setVisibleOptionalFields] = useState<Flags>(
    Flags.empty(),
  );
  const enableOptionalField = (path: FieldPath) =>
    setVisibleOptionalFields((prev) => prev.enable(path.key));
  const toggleOptionalField = (path: FieldPath) =>
    setVisibleOptionalFields((prev) => prev.toggle(path.key));

  const [unknowns, setUnknowns] = useState<Unknowns>(Unknowns.empty());
  const modifyUnknowns = <K extends UnknownsActions>(
    method: K,
    ...args: Parameters<Unknowns[K]>
  ) => {
    // @ts-expect-error spread error
    return setUnknowns((prev) => prev[method](...args));
  };

  const schema: FieldSchema[] = extractSchema(dtoClass, fieldAnnotations).map(
    (field) => ({
      ...field,
      ...(overrides?.[field.name as FieldSchemaKeys]
        ? overrides[field.name as FieldSchemaKeys]
        : {}),
    }),
  );

  const setFieldsValues = (values: any) => {
    schema.forEach((fs) =>
      recreateState(values, fs, enableOptionalField, modifyUnknowns),
    );
    formProps.form.setFieldsValue(values);
  };

  useImperativeHandle(ref, (() => ({
    setFieldsValues,
  })) as any);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      initialValues={initialValues}
    >
      {schema.map((field) => {
        return renderField({
          schema: field,
          preFieldPath: FieldPath.empty(),
          disabled: disabled,
          visibleOptionalFields: visibleOptionalFields,
          hideLabels: false,
          enableOptionalField: enableOptionalField,
          toggleOptionalField: toggleOptionalField,
          unknowns: unknowns,
          modifyUnknowns: modifyUnknowns,
          form: formProps.form,
          parentRecord,
          useSelector,
          fieldAnnotations,
        });
      })}
      <Form.Item>
        <Button disabled={submitDisabled} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
});
