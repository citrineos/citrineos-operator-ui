import { FieldPath } from './state/fieldpath';
import { Button, Form } from 'antd';
import { AssociationSelection } from '../data-model-table/association-selection';
import { SelectionType } from '../data-model-table/editable';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { FieldSchema, FieldType, renderField, renderLabel } from './index';

export interface ArrayFieldProps {
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
  useSelector: any;
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
  } = props;
  if (schema.gqlAssociationProps) {
    const parentIdFieldName = schema.gqlAssociationProps.parentIdFieldName;
    const associatedIdFieldName =
      schema.gqlAssociationProps.associatedIdFieldName;
    const gqlListQuery = schema.gqlAssociationProps.gqlListQuery;
    const getGqlQueryVariables =
      schema.gqlAssociationProps?.getGqlQueryVariables;
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
            gqlQuery={gqlListQuery}
            gqlQueryVariables={gqlQueryVariables}
            parentRecord={parentRecord}
            associatedRecordClass={schema.dtoClass!}
            value={form.getFieldValue(fieldPath.keyPath)}
            onChange={(newValues: any[]) => {
              form.setFieldsValue({
                [fieldPath.keyPath as any]: newValues,
              });
            }}
            customActions={schema.customActions}
          />
        </Form.Item>
      </div>
    );
  }
  return (
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
                  <div className="array-item-content">
                    {schema.nestedFields
                      ? schema.nestedFields.map(
                          (nestedField) =>
                            renderField({
                              schema: nestedField,
                              preFieldPath: fieldPath
                                .clearNamePath()
                                .with(field.name),
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
                        )
                      : (renderField({
                          schema: {
                            label: `#${fieldIdx + 1} ${schema.label}`,
                            name: String(field.name),
                            type: FieldType.input,
                            isRequired: true,
                            sorter: schema.sorter,
                          },
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
                        }) as any)}
                  </div>
                </div>
              </Form.Item>
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
};
