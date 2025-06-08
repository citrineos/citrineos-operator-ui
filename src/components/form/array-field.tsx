// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Form } from 'antd';
import { AssociationSelection } from '../data-model-table/association-selection';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { ArrayItem } from './array-item';
import { ExpandableColumn } from '../data-model-table/expandable-column';
import { AssociatedTable } from '../data-model-table/associated-table';
import { getProperty } from '@util/objects';
import GenericTag from '../tag';
import { ArrayFieldProps } from '@interfaces';
import { renderLabel } from '@util/renderUtil';
import { SelectionType } from '@enums';

export const ArrayField: React.FC<ArrayFieldProps> = (
  props: ArrayFieldProps,
) => {
  const {
    fieldPath,
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
    useSelector,
    fieldAnnotations,
    setHasChanges,
    isInTable = false,
  } = props;
  if (schema.gqlAssociationProps) {
    const parentIdFieldName = schema.gqlAssociationProps.parentIdFieldName;
    const associatedIdFieldName =
      schema.gqlAssociationProps.associatedIdFieldName;
    if (disabled) {
      const gqlQuery = schema.gqlAssociationProps.gqlListSelectedQuery;
      const getGqlQueryVariables = gqlQuery?.getQueryVariables;
      let gqlQueryVariables = undefined;
      if (getGqlQueryVariables) {
        gqlQueryVariables = getGqlQueryVariables(parentRecord, useSelector);
      }
      return (
        <Form.Item name={fieldPath.keyPath}>
          <ExpandableColumn
            expandedContent={
              <AssociatedTable
                associatedRecordClass={schema.dtoClass!}
                gqlQuery={gqlQuery?.query}
                gqlQueryVariables={gqlQueryVariables}
                customActions={schema.customActions}
              />
            }
            viewTitle={`Associated Table: ${schema.dtoClass?.name}`}
          />
        </Form.Item>
      );
    } else {
      const gqlQuery = schema.gqlAssociationProps.gqlListQuery;
      const getGqlQueryVariables = gqlQuery?.getQueryVariables;
      let gqlQueryVariables = undefined;
      if (getGqlQueryVariables) {
        let record;
        try {
          record = form.getFieldValue(fieldPath.pop().keyPath);
        } catch (_e: any) {
          // ignore
        }
        if (!record) {
          record = parentRecord;
        }
        gqlQueryVariables = getGqlQueryVariables(record, useSelector);
      }
      return (
        <div className="editable-cell">
          <Form.Item name={fieldPath.keyPath}>
            <AssociationSelection
              fieldPath={fieldPath}
              selectable={SelectionType.MULTIPLE}
              parentIdFieldName={parentIdFieldName!}
              associatedIdFieldName={associatedIdFieldName!}
              gqlQuery={gqlQuery?.query}
              gqlQueryVariables={gqlQueryVariables}
              parentRecord={parentRecord}
              associatedRecordClass={schema.dtoClass!}
              value={form.getFieldValue(fieldPath.keyPath)}
              form={form}
              onChange={(newValues: any[]) => {
                form.setFieldsValue({
                  [fieldPath.keyPath as any]: newValues,
                });
                if (setHasChanges) {
                  setHasChanges(true);
                }
              }}
              customActions={
                fieldAnnotations &&
                fieldAnnotations[schema.name] &&
                fieldAnnotations[schema.name].customActions
                  ? fieldAnnotations![schema.name].customActions
                  : schema.customActions
              }
            />
          </Form.Item>
        </div>
      );
    }
  } else {
    let nonAssociationFieldContent;
    if (disabled) {
      const list = getProperty(parentRecord, fieldPath.namePath);
      if (list && list.length > 0) {
        nonAssociationFieldContent = list.map((item: any, idx: number) => (
          <GenericTag
            key={`nonAssociationFieldContent-${idx}`}
            stringValue={item}
          />
        ));
      }
    } else {
      nonAssociationFieldContent = (
        <Form.List key={`${fieldPath.key}-list`} name={fieldPath.namePath}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, fieldIdx) => (
                  <>
                    <ArrayItem
                      fieldPath={fieldPath}
                      field={field}
                      fieldIdx={fieldIdx}
                      schema={schema}
                      hideLabels={hideLabels || false}
                      disabled={disabled}
                      visibleOptionalFields={visibleOptionalFields}
                      enableOptionalField={enableOptionalField}
                      toggleOptionalField={toggleOptionalField}
                      unknowns={unknowns}
                      modifyUnknowns={modifyUnknowns}
                      form={form}
                      parentRecord={parentRecord}
                      remove={remove}
                      fieldAnnotations={fieldAnnotations}
                    />
                  </>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    if (schema.customConstructor) {
                      add(schema.customConstructor());
                    } else {
                      add();
                    }
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  Add {schema.label}
                </Button>
              </>
            );
          }}
        </Form.List>
      );
    }
    return (
      <Form.Item
        key={`${fieldPath.key}-list-wrapper`}
        label={
          hideLabels || isInTable
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
      >
        {disabled || !isInTable ? (
          nonAssociationFieldContent
        ) : (
          <ExpandableColumn expandedContent={nonAssociationFieldContent} />
        )}
      </Form.Item>
    );
  }
};
