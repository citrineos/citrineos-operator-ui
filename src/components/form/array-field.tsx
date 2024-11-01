import { FieldPath } from './state/fieldpath';
import { Button, Form } from 'antd';
import { AssociationSelection } from '../data-model-table/association-selection';
import { FieldAnnotations, SelectionType } from '../data-model-table/editable';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { FieldSchema, renderLabel } from './index';
import { ArrayItem } from './array-item';
import { Flags } from './state/flags';
import { Unknowns } from './state/unknowns';
import { ExpandableColumn } from '../data-model-table/expandable-column';
import { AssociatedTable } from '../data-model-table/associated-table';

export interface ArrayFieldProps {
  fieldPath: FieldPath;
  schema: FieldSchema;
  hideLabels?: boolean;
  disabled: boolean;
  visibleOptionalFields?: Flags;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  setHasChanges?: any;
  modifyUnknowns?: any;
  form: any;
  parentRecord: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
  isInTable?: boolean;
}

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
        gqlQueryVariables = getGqlQueryVariables(parentRecord, useSelector);
      }
      return (
        <div className="editable-cell">
          <Form.Item name={fieldPath.keyPath}>
            <AssociationSelection
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
    const nonAssociationFieldContent = (
      <Form.Item
        key={`${fieldPath.key}-list-wrapper`}
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
      >
        <Form.List key={`${fieldPath.key}-list`} name={fieldPath.namePath}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, fieldIdx) => (
                <ArrayItem
                  fieldPath={fieldPath}
                  field={field}
                  fieldIdx={fieldIdx}
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
                  remove={remove}
                  fieldAnnotations={fieldAnnotations}
                />
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
          )}
        </Form.List>
      </Form.Item>
    );
    if (isInTable) {
      return <ExpandableColumn expandedContent={nonAssociationFieldContent} />;
    } else {
      return nonAssociationFieldContent;
    }
  }
};
