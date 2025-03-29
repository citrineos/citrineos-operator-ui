import { Form } from 'antd';
import React from 'react';
import { renderField } from './index';
import { AssociationSelection } from '../data-model-table/association-selection';
import { getProperty, setProperty } from '@util/objects';
import { AssociatedView } from '../data-model-table/associated-view';
import { NestedObjectFieldProps } from '@interfaces';
import { renderLabel } from '@util/renderUtil';

export const NestedObjectField: (
  props: NestedObjectFieldProps,
) => React.JSX.Element = (props: NestedObjectFieldProps) => {
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
  } = props;

  if (schema.gqlAssociationProps) {
    const parentIdFieldName = schema.gqlAssociationProps.parentIdFieldName;
    const associatedIdFieldName =
      schema.gqlAssociationProps.associatedIdFieldName;
    let gqlQuery: any | ((parentRecord: any) => any) =
      schema.gqlAssociationProps.gqlQuery;
    let gqlListQuery: any | ((parentRecord: any) => any) =
      schema.gqlAssociationProps.gqlListQuery;
    const getGqlQueryVariables = gqlListQuery?.getQueryVariables;
    let gqlQueryVariables = undefined;

    // Getting record
    let record;
    try {
      record = form.getFieldValue(fieldPath.pop().keyPath);
    } catch (_e: any) {
      // ignore
    }
    if (!record) {
      record = parentRecord;
    }

    // Setting query value
    const gqlDocumentQuery =
      typeof gqlQuery?.query === 'function'
        ? gqlQuery?.query(record, useSelector)
        : gqlQuery?.query;
    const gqlDocumentListQuery =
      typeof gqlListQuery?.query === 'function'
        ? gqlListQuery?.query(record, useSelector)
        : gqlListQuery?.query;

    if (getGqlQueryVariables) {
      gqlQueryVariables = getGqlQueryVariables(record, useSelector);
    }
    if (disabled) {
      return (
        <AssociatedView
          parentRecord={parentRecord}
          associatedRecordClass={schema.dtoClass!}
          parentIdFieldName={parentIdFieldName!}
          associatedIdFieldName={associatedIdFieldName!}
          gqlQuery={gqlDocumentQuery}
          gqlListQuery={gqlDocumentListQuery}
        />
      );
    } else {
      return (
        <div className="editable-cell">
          <Form.Item
            name={fieldPath.namePath}
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
          >
            <AssociationSelection
              fieldPath={fieldPath}
              parentIdFieldName={parentIdFieldName!}
              associatedIdFieldName={associatedIdFieldName!}
              gqlQuery={gqlDocumentListQuery}
              gqlQueryVariables={gqlQueryVariables}
              parentRecord={parentRecord}
              associatedRecordClass={schema.dtoClass!}
              value={form.getFieldValue(fieldPath.keyPath)}
              form={form}
              onChange={(newValues: any[]) => {
                const currentValues = form.getFieldsValue(true);
                if (newValues.length > 0) {
                  setProperty(currentValues, fieldPath.keyPath, newValues[0]);
                } else {
                  setProperty(
                    currentValues,
                    fieldPath.keyPath,
                    getProperty(parentRecord, fieldPath.keyPath),
                  );
                }
                form.setFieldsValue(currentValues);
              }}
              customActions={schema.customActions}
            />
          </Form.Item>
        </div>
      );
    }
  }

  return (
    <Form.Item
      key={`${fieldPath.key}-nested-object`}
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
    >
      <div className="nested-object">
        {schema.nestedFields?.map(
          (nestedField) =>
            renderField({
              schema: nestedField,
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
            }) as any,
        )}
      </div>
    </Form.Item>
  );
};

export default NestedObjectField;
