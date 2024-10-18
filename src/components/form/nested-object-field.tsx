import { FieldPath } from './state/fieldpath';
import { Form } from 'antd';
import React from 'react';
import { FieldSchema, renderField, renderLabel } from './index';
import { AssociationSelection } from '../data-model-table/association-selection';
import { setProperty } from '../../util/objects';

export interface NestedObjectFieldProps {
  fieldPath: FieldPath;
  schema: FieldSchema;
  hideLabels: boolean;
  disabled: boolean;
  visibleOptionalFields: any;
  enableOptionalField: any;
  toggleOptionalField: any;
  unknowns: any;
  modifyUnknowns: any;
  form: any;
  parentRecord: any;
  gqlQueryVariablesMap?: any;
}

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
    gqlQueryVariablesMap,
  } = props;

  if (schema.gqlAssociationProps) {
    const parentIdFieldName = schema.gqlAssociationProps.parentIdFieldName;
    const associatedIdFieldName =
      schema.gqlAssociationProps.associatedIdFieldName;
    const gqlListQuery = schema.gqlAssociationProps.gqlListQuery;
    const gqlUseQueryVariablesKey =
      schema.gqlAssociationProps.gqlUseQueryVariablesKey;
    let gqlQueryVariables = undefined;
    if (
      gqlUseQueryVariablesKey &&
      gqlQueryVariablesMap &&
      gqlQueryVariablesMap[gqlUseQueryVariablesKey]
    ) {
      gqlQueryVariables = gqlQueryVariablesMap[gqlUseQueryVariablesKey];
    }

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
            parentIdFieldName={parentIdFieldName!}
            associatedIdFieldName={associatedIdFieldName!}
            gqlQuery={gqlListQuery}
            gqlQueryVariables={gqlQueryVariables}
            parentRecord={parentRecord}
            associatedRecordClass={schema.dtoClass!}
            value={form.getFieldValue(fieldPath.keyPath)}
            onChange={(newValues: any[]) => {
              const currentValues = form.getFieldsValue(true);
              setProperty(currentValues, fieldPath.keyPath, newValues[0]);
              form.setFieldsValue(currentValues);
            }}
          />
        </Form.Item>
      </div>
    );
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
              gqlQueryVariablesMap,
            }) as any,
        )}
      </div>
    </Form.Item>
  );
};

export default NestedObjectField;
