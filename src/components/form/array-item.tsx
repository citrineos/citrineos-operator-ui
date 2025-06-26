// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button, Form } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { renderField } from './index';
import { useSelector } from 'react-redux';
import { ArrayItemProps, FieldSchema } from '@interfaces';
import { FieldType } from '@enums';

export const ArrayItem: React.FC<ArrayItemProps> = (props: ArrayItemProps) => {
  const {
    fieldPath,
    field,
    fieldIdx,
    schema,
    hideLabels,
    disabled,
    visibleOptionalFields,
    enableOptionalField,
    toggleOptionalField,
    unknowns,
    modifyUnknowns,
    form,
    parentRecord,
    remove,
    fieldAnnotations,
  } = props;

  let itemContent;
  if (schema.nestedFields) {
    itemContent = schema.nestedFields.map(
      (nestedField) =>
        renderField({
          schema: nestedField,
          preFieldPath: fieldPath.clearNamePath().with(field.name),
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
        }) as any,
    );
  } else {
    const nestedSchema: FieldSchema = {
      label: `#${fieldIdx + 1} ${schema.label}`,
      name: String(field.name),
      type: FieldType.input,
      isRequired: true,
      sorter: schema.sorter,
      parentInstance: schema.parentInstance,
    };
    if (schema.options) {
      nestedSchema.options = schema.options;
      nestedSchema.type = FieldType.select;
    }
    itemContent = renderField({
      schema: nestedSchema,
      preFieldPath: fieldPath.clearNamePath(),
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
    }) as any;
  }

  return (
    <Form.Item
      key={`${fieldPath.key}-${fieldIdx}`}
      label={
        <div className="form-item-label">
          <span>{`#${fieldIdx + 1} ${schema.label}`}</span>
          <Button
            type="link"
            icon={<MinusOutlined />}
            onClick={() => remove(field.name)}
          />
        </div>
      }
    >
      <div className="array-item">
        <div className="array-item-content">{itemContent}</div>
      </div>
    </Form.Item>
  );
};
