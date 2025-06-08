// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Button, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { extractSchema, getClassTransformerType, renderField } from '../form';
import { StatusIcon } from '../status-icon';
import GenericTag from '../tag';
import { TruncateDisplay } from '../truncate-display';
import { TimestampDisplay } from '../timestamp-display';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '@util/decorators/ClassResourceType';
import { CLASS_GQL_LIST_QUERY } from '@util/decorators/ClassGqlListQuery';
import { useForm } from '@refinedev/antd';
import {
  DataProvider,
  HttpError,
  useCustomMutation,
  useDataProvider,
} from '@refinedev/core';
import {
  FieldNameAndIsEditable,
  PRIMARY_KEY_FIELD_NAME,
} from '@util/decorators/PrimaryKeyFieldName';
import { GetFields, GetVariables } from '@refinedev/hasura';
import { CLASS_GQL_EDIT_MUTATION } from '@util/decorators/ClassGqlEditMutation';
import {
  CLASS_GQL_CREATE_MUTATION,
  MutationAndGetVariables,
} from '@util/decorators/ClassGqlCreateMutation';
import { CustomAction } from '../custom-actions';
import { FieldPath } from '../form/state/fieldpath';
import { AssociationSelection } from './association-selection';
import { ActionsColumnEnhanced } from './actions-column-enhanced';
import { Unknowns, UnknownsActions } from '../form/state/unknowns';
import { Flags } from '../form/state/flags';
import {
  getAssociatedFields,
  GQL_ASSOCIATION,
  GqlAssociationProps,
} from '@util/decorators/GqlAssociation';
import { TableWrapper } from './table-wrapper';
import { NEW_IDENTIFIER } from '@util/consts';
import { hasOwnProperty } from '../../message/util';
import { CLASS_CUSTOM_ACTIONS } from '@util/decorators/ClassCustomActions';
import { useSelector } from 'react-redux';
import { ArrayField } from '../form/array-field';
import { CLASS_CUSTOM_CONSTRUCTOR } from '@util/decorators/ClassCustomConstructor';
import NestedObjectField from '../form/nested-object-field';
import { DocumentNode } from 'graphql';
import { HIDDEN_WHEN, IsHiddenCheck } from '@util/decorators/HiddenWhen';
import {
  FieldSchema,
  GenericDataTableProps,
  RenderEditableCellProps,
  RenderViewContentProps,
  TableWrapperRef,
} from '@interfaces';
import { ColumnAction, FieldType } from '@enums';

export const renderViewContent = (props: RenderViewContentProps) => {
  const {
    field,
    preFieldPath = FieldPath.empty(),
    value: _value,
    record,
    hideLabels,
    disabled: _disabled,
    parentRecord,
    form,
    setHasChanges,
    visibleOptionalFields,
    enableOptionalField,
    toggleOptionalField,
    unknowns,
    modifyUnknowns,
    useSelector,
    fieldAnnotations,
  } = props;

  const fieldPath = preFieldPath.with(field.name);
  const value = record[field.name];
  const fieldType = field.type;
  const fieldOptions = field.options;

  if (field.type === FieldType.customRender && field.customRender) {
    return field.customRender(record);
  }
  switch (fieldType) {
    case FieldType.boolean:
      return <StatusIcon value={value} />;
    case FieldType.select: {
      const selectedOption = fieldOptions?.find(
        (option: any) => option.value === value,
      );
      return <GenericTag stringValue={selectedOption?.label || value} />;
    }
    case FieldType.datetime:
      return <TimestampDisplay isoTimestamp={value} />;
    case FieldType.nestedObject:
      return (
        <NestedObjectField
          fieldPath={fieldPath}
          schema={field}
          hideLabels={true}
          disabled={true}
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
    case FieldType.array:
      return (
        <ArrayField
          fieldPath={fieldPath}
          schema={field}
          hideLabels={hideLabels}
          disabled={true}
          visibleOptionalFields={visibleOptionalFields}
          enableOptionalField={enableOptionalField}
          toggleOptionalField={toggleOptionalField}
          unknowns={unknowns}
          modifyUnknowns={modifyUnknowns}
          form={form}
          parentRecord={parentRecord}
          useSelector={useSelector}
          fieldAnnotations={fieldAnnotations}
          setHasChanges={setHasChanges}
          isInTable={true}
        />
      );
    case FieldType.input:
    default:
      return value && value.length > 15 ? (
        <TruncateDisplay id={value} />
      ) : (
        value
      );
  }
};

// todo add generic types
export const GenericDataTable: React.FC<GenericDataTableProps> = (
  props: GenericDataTableProps,
) => {
  const {
    dtoClass,
    selectable = null,
    filters = null,
    useTableProps: useTableProps = null,
    onSelectionChange,
    editable = true,
    customActions,
    fieldAnnotations,
  } = props;

  const getDataProvider = useDataProvider();
  const dataProvider: DataProvider = getDataProvider();

  const dtoClassInstance = useMemo(() => {
    return plainToInstance(dtoClass, {});
  }, [dtoClass]);

  const dtoResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    dtoClassInstance,
  );

  const dtoGqlListQuery = Reflect.getMetadata(
    CLASS_GQL_LIST_QUERY,
    dtoClassInstance,
  );

  const dtoGqlCreateMutation: MutationAndGetVariables = Reflect.getMetadata(
    CLASS_GQL_CREATE_MUTATION,
    dtoClassInstance,
  );

  const classCustomConstructor = Reflect.getMetadata(
    CLASS_CUSTOM_CONSTRUCTOR,
    dtoClassInstance,
  );

  const primaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable =
    Reflect.getMetadata(PRIMARY_KEY_FIELD_NAME, dtoClassInstance as object);

  const primaryKeyFieldName = primaryKeyFieldNameAndIsEditable.fieldName;
  const primaryKeyFieldEditable =
    primaryKeyFieldNameAndIsEditable.editableDuringCreate;

  const classCustomActions = Reflect.getMetadata(
    CLASS_CUSTOM_ACTIONS,
    dtoClassInstance as object,
  );

  const tableWrapperRef = useRef<TableWrapperRef<any>>(null);

  const [visibleOptionalFields, setVisibleOptionalFields] = useState<Flags>(
    Flags.empty(),
  );
  const [unknowns, setUnknowns] = useState<Unknowns>(Unknowns.empty());
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [editingNewRecord, setEditingNewRecord] = useState<boolean>(false);

  const {
    form,
    formProps,
    queryResult: _formQueryResult,
  } = useForm<GetFields<any>, HttpError, GetVariables<any>>({
    id: editingRecord ? editingRecord?.[primaryKeyFieldName] : undefined,
    resource: dtoResourceType,
  } as any);

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
      });
    } else {
      form.resetFields(); // Reset form when editing ends
    }
  }, [editingRecord, form]);

  const schema: FieldSchema[] = useMemo(
    () => extractSchema(dtoClass, fieldAnnotations),
    [dtoClass, fieldAnnotations],
  );

  const onEdit = useCallback(
    (record: any) => {
      if (hasChanges) {
        Modal.confirm({
          title: 'Unsaved changes',
          content: 'You have unsaved changes. Do you want to discard them?',
          onOk: () => {
            setHasChanges(false);
            form.setFieldsValue({ ...record });
            setEditingRecord(record);
            setEditingNewRecord(false);
          },
        });
      } else {
        form.setFieldsValue({ ...record });
        setEditingRecord(record);
        setEditingNewRecord(false);
      }
    },
    [hasChanges],
  );

  const handleCreate = useCallback(() => {
    if (editingRecord) return; // Prevent multiple creations/editing

    const newRecord = classCustomConstructor
      ? classCustomConstructor()
      : {
          [primaryKeyFieldName]: primaryKeyFieldEditable
            ? undefined
            : NEW_IDENTIFIER, // Unique key for the new record
        };

    if (
      filters &&
      filters.permanent &&
      filters.permanent[0] &&
      filters.permanent[0].field
    ) {
      newRecord[filters.permanent[0].field] = filters.permanent[0].value;
    }

    tableWrapperRef.current?.addRecordToTable(newRecord);
    setEditingRecord(newRecord as any);
    setEditingNewRecord(true);
  }, [editingRecord, primaryKeyFieldName]);

  const {
    data: mutationData,
    error: mutationError,
    mutate,
  } = useCustomMutation();

  useEffect(() => {
    if (mutationError) {
      Modal.error({
        title: 'Save Failed',
        content: `There was an error performing mutation: ${JSON.stringify(mutationError)}`,
      });
    } else if (mutationData) {
      Modal.success({
        title: 'Save Successful',
        content: `The ${dtoResourceType} record has been updated successfully.`,
      });
      setHasChanges(false);
      setEditingRecord(null);
      setEditingNewRecord(false);
    }
  }, [mutationData, mutationError]);

  const getVariables = (valuesClass: any, associatedFields: Set<string>) => {
    let vars;
    if (dtoGqlCreateMutation.getVariables) {
      vars = dtoGqlCreateMutation.getVariables(valuesClass);
    } else {
      const record = structuredClone(instanceToPlain(valuesClass));
      if (associatedFields && associatedFields.size > 0) {
        for (const associatedField of associatedFields) {
          const associatedClass = getClassTransformerType(
            valuesClass,
            associatedField,
          );
          const associatedInstance: any = plainToInstance(associatedClass, {});
          const associatedPrimaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable =
            Reflect.getMetadata(PRIMARY_KEY_FIELD_NAME, associatedInstance);
          const associatedPrimaryKeyFieldName =
            associatedPrimaryKeyFieldNameAndIsEditable.fieldName;
          if (
            record[associatedField] &&
            typeof record[associatedField] === 'object'
          ) {
            if (
              record[associatedField][associatedPrimaryKeyFieldName] ===
              NEW_IDENTIFIER
            ) {
              delete record[associatedField];
            } else {
              record[associatedField] =
                record[associatedField][associatedPrimaryKeyFieldName];
            }
          }
        }
      }
      vars = record;
    }
    return vars;
  };

  const handleSave = useCallback(async () => {
    const plainValues = await form.validateFields();

    const valuesClass: any = plainToInstance(dtoClass, plainValues);
    delete valuesClass['customData']; // todo real custom data

    if (hasOwnProperty(valuesClass, 'createdAt') && !valuesClass.createdAt) {
      valuesClass.createdAt = new Date().toISOString();
    }
    valuesClass.updatedAt = new Date().toISOString();
    const associatedFields = getAssociatedFields(dtoClass);
    if (editingRecord && editingNewRecord) {
      // Handle create operation
      try {
        if (editingNewRecord && !primaryKeyFieldEditable) {
          delete valuesClass[primaryKeyFieldName];
        }
        const vars = getVariables(valuesClass, associatedFields);
        const response = await (dataProvider as any).create({
          resource: dtoResourceType,
          variables: vars,
          meta: {
            gqlMutation: dtoGqlCreateMutation.mutation,
          },
        });

        Modal.success({
          title: 'Create Successful',
          content: `A new ${dtoResourceType} record has been created successfully.`,
        });

        // Remove the new row
        tableWrapperRef.current?.removeNewRow();

        // refresh table
        tableWrapperRef.current?.refreshTable();

        setHasChanges(false);
        setEditingRecord(null);
        setEditingNewRecord(false);
      } catch (error: any) {
        console.error('Create failed:', error);
        Modal.error({
          title: 'Create Failed',
          content: `There was an error creating the ${dtoResourceType} record with message: ${error.message}`,
        });
      }
    } else {
      const id = valuesClass[primaryKeyFieldName];
      try {
        const dtoGqlEditMutation: DocumentNode = Reflect.getMetadata(
          CLASS_GQL_EDIT_MUTATION,
          valuesClass,
        );

        const meta: any = {
          gqlMutation: dtoGqlEditMutation,
        };

        if (associatedFields && associatedFields.size > 0) {
          for (const associatedField of associatedFields) {
            const gqlAssociation: GqlAssociationProps = Reflect.getMetadata(
              GQL_ASSOCIATION,
              valuesClass,
              associatedField,
            );
            if (gqlAssociation && gqlAssociation.hasNewAssociatedIdsVariable) {
              meta.variables = {
                id: id,
                object: {
                  ...instanceToPlain(valuesClass),
                  [associatedField]: undefined,
                },
                newAssociatedIds: valuesClass[associatedField].map(
                  (item: any) => {
                    const primaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable =
                      Reflect.getMetadata(PRIMARY_KEY_FIELD_NAME, valuesClass);
                    const primaryKeyFieldName =
                      primaryKeyFieldNameAndIsEditable.fieldName;
                    return item[primaryKeyFieldName] || item.id;
                  },
                ),
              };
              break;
            }
          }
        }
        if (!meta.variables) {
          const vars = getVariables(valuesClass, associatedFields);
          meta.variables = {
            id: editingRecord[primaryKeyFieldName],
            object: vars,
          };
        }
        mutate({
          meta,
        } as any);
      } catch (error: any) {
        console.error('Update failed:', error);
        Modal.error({
          title: 'Save Failed',
          content: `There was an error saving the ${dtoResourceType} record ${id} with message: ${error.message}`,
        });
      }
    }
  }, [form, formProps, editingRecord]);

  const handleRowSave = useCallback(
    (_record: any) => {
      handleSave().then();
    },
    [handleSave],
  );

  const cancel = useCallback(() => {
    if (editingRecord && editingNewRecord) {
      tableWrapperRef.current?.removeNewRow();
    } else {
      // Handle cancelling edit on existing record
      setHasChanges(false);
      form.resetFields();
    }
    setEditingRecord(null);
    setEditingNewRecord(false);
  }, [editingRecord, form, primaryKeyFieldName]);

  const onDeleteSuccess = () => {};

  const enableOptionalField = useCallback(
    (path: FieldPath) =>
      setVisibleOptionalFields((prev: any) => prev.enable(path.key)),
    [setVisibleOptionalFields],
  );
  const toggleOptionalField = useCallback(
    (path: FieldPath) =>
      setVisibleOptionalFields((prev: any) => prev.toggle(path.key)),
    [setVisibleOptionalFields],
  );

  const modifyUnknowns = useCallback(
    <K extends UnknownsActions>(method: K, ...args: Parameters<Unknowns[K]>) =>
      setUnknowns((prev: any) => prev[method](...args)),
    [setUnknowns],
  );

  const renderActionsColumn = (
    record: any,
    editingRecord: any,
    primaryKeyFieldName: any,
    editable: boolean,
    onEdit: ((record: any) => void) | undefined,
    handleRowSave: (_record: any) => void,
    cancel: () => void,
    onDeleteSuccess: () => void,
    customActions: CustomAction<any>[] | undefined,
    classCustomActions: any,
  ) => {
    const isCurrentlyEditing =
      editingRecord &&
      record[primaryKeyFieldName] === editingRecord[primaryKeyFieldName];
    const actions = !isCurrentlyEditing
      ? editable
        ? [ColumnAction.EDIT, ColumnAction.DELETE, ColumnAction.SHOW]
        : [ColumnAction.SHOW, ColumnAction.DELETE]
      : [ColumnAction.SAVE, ColumnAction.CANCEL, ColumnAction.DELETE];

    return (
      <ActionsColumnEnhanced
        record={record}
        dtoClass={dtoClass}
        onEdit={
          editable && !isCurrentlyEditing && !editingNewRecord
            ? onEdit
            : undefined
        }
        onSave={isCurrentlyEditing ? handleRowSave : undefined}
        onCancel={isCurrentlyEditing ? cancel : undefined}
        onDeleteSuccess={onDeleteSuccess}
        actions={actions}
        customActions={customActions || classCustomActions}
      />
    );
  };

  const renderEditableCell = (props: RenderEditableCellProps) => {
    const {
      field,
      preFieldPath = FieldPath.empty(),
      hideLabels,
      disabled,
      parentRecord,
      form,
      setHasChanges,
      visibleOptionalFields,
      enableOptionalField,
      toggleOptionalField,
      unknowns,
      modifyUnknowns,
      useSelector,
      fieldAnnotations,
    } = props;

    const fieldPath = preFieldPath.with(field.name);

    if (field.type === FieldType.array) {
      return (
        <>
          <ArrayField
            fieldPath={fieldPath}
            schema={field}
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
            setHasChanges={setHasChanges}
            isInTable={true}
          />
        </>
      );
    }
    if (field.type === FieldType.nestedObject && field.gqlAssociationProps) {
      let gqlAssociationProps;
      if (
        fieldAnnotations &&
        fieldAnnotations[field.name]?.gqlAssociationProps
      ) {
        gqlAssociationProps = fieldAnnotations[field.name]?.gqlAssociationProps;
      } else if (field.gqlAssociationProps) {
        gqlAssociationProps = field.gqlAssociationProps;
      }
      if (!gqlAssociationProps) {
        return <Alert message="Missing gqlAssociationProps" type="error" />;
      }
      const parentIdFieldName = gqlAssociationProps.parentIdFieldName;
      const associatedIdFieldName = gqlAssociationProps.associatedIdFieldName;
      const gqlListQuery = gqlAssociationProps.gqlListQuery;
      const getGqlQueryVariables = gqlListQuery?.getQueryVariables;
      let gqlQueryVariables = undefined;
      if (getGqlQueryVariables) {
        gqlQueryVariables = getGqlQueryVariables(parentRecord, useSelector);
      }
      return (
        <div className="editable-cell">
          <Form.Item name={fieldPath.namePath}>
            <AssociationSelection
              fieldPath={fieldPath}
              parentIdFieldName={parentIdFieldName!}
              associatedIdFieldName={associatedIdFieldName!}
              gqlQuery={gqlListQuery?.query}
              parentRecord={parentRecord}
              associatedRecordClass={field.dtoClass!}
              value={form.getFieldValue(fieldPath.namePath)}
              gqlQueryVariables={gqlQueryVariables}
              form={form}
              onChange={(newValues: any[]) => {
                form.setFieldValue(fieldPath.namePath, newValues[0]);
                setHasChanges(true);
              }}
              customActions={
                fieldAnnotations &&
                fieldAnnotations[field.name] &&
                fieldAnnotations[field.name].customActions
                  ? fieldAnnotations![field.name].customActions
                  : field.customActions
              }
            />
          </Form.Item>
        </div>
      );
    }
    return renderField({
      schema: field,
      preFieldPath: FieldPath.empty(),
      disabled:
        parentRecord[primaryKeyFieldName] === NEW_IDENTIFIER &&
        field.name === primaryKeyFieldName &&
        !primaryKeyFieldEditable,
      visibleOptionalFields: visibleOptionalFields,
      hideLabels: true,
      enableOptionalField: enableOptionalField,
      toggleOptionalField: toggleOptionalField,
      unknowns: unknowns,
      modifyUnknowns: modifyUnknowns,
      form,
      parentRecord,
      useSelector,
      fieldAnnotations,
    });
  };

  const columns: FieldSchema[] = useMemo(() => {
    const actionsColumn = {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'left' as const,
      className: 'actions-column',
      render: (_: any, record: any) =>
        renderActionsColumn(
          record,
          editingRecord,
          primaryKeyFieldName,
          editable,
          onEdit,
          handleRowSave,
          cancel,
          onDeleteSuccess,
          customActions,
          classCustomActions,
        ),
    } as any;

    const columnsArray: any[] = [actionsColumn];
    for (const field of schema) {
      const isHiddenCheck: IsHiddenCheck = Reflect.getMetadata(
        HIDDEN_WHEN,
        field.parentInstance as any,
        field.name,
      );

      if (isHiddenCheck && isHiddenCheck(editingRecord)) {
        continue;
      }

      columnsArray.push({
        title: field.label,
        dataIndex: primaryKeyFieldName,
        sorter: field.sorter,
        editable: true,
        render: (value: any, record: any) => {
          const isCurrentlyEditing =
            editingRecord &&
            record[primaryKeyFieldName] === editingRecord[primaryKeyFieldName];
          if (isCurrentlyEditing) {
            return renderEditableCell({
              field,
              hideLabels: false,
              disabled: false,
              parentRecord: record,
              form,
              setHasChanges,
              visibleOptionalFields,
              enableOptionalField,
              toggleOptionalField,
              unknowns,
              modifyUnknowns,
              useSelector,
              fieldAnnotations,
            });
          }
          return (
            <div className="editable-cell">
              {renderViewContent({
                field,
                value,
                record,
                hideLabels: false,
                disabled: false,
                parentRecord: record,
                form,
                setHasChanges,
                visibleOptionalFields,
                enableOptionalField,
                toggleOptionalField,
                unknowns,
                modifyUnknowns,
                useSelector,
                fieldAnnotations,
              })}
            </div>
          );
        },
      });
    }
    return columnsArray;
  }, [schema, editingRecord, visibleOptionalFields]) as FieldSchema[];

  const missingItems: string[] = [];
  const itemsToCheck = [
    { name: 'dtoResourceType', value: dtoResourceType },
    { name: 'dtoGqlListQuery', value: dtoGqlListQuery },
    { name: 'dtoGqlCreateMutation', value: dtoGqlCreateMutation },
    { name: 'primaryKeyFieldName', value: primaryKeyFieldName },
    { name: 'dataProvider', value: dataProvider },
  ];

  for (let i = 0; i < itemsToCheck.length; i++) {
    if (!itemsToCheck[i].value) {
      missingItems.push(itemsToCheck[i].name);
    }
  }

  if (missingItems.length > 0) {
    return (
      <Alert
        message={`Error: GenericDataTable cannot find ${missingItems.join(', ')}`}
        type="error"
      />
    );
  }

  return (
    <Form
      form={form}
      component={false}
      onValuesChange={() => setHasChanges(true)}
    >
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          disabled={!!editingRecord}
        >
          Create
        </Button>
      </div>
      <TableWrapper
        ref={tableWrapperRef}
        selectable={selectable}
        onSelectionChange={onSelectionChange}
        primaryKeyFieldName={primaryKeyFieldName}
        columns={columns}
        editingRecord={editingRecord}
        dtoClass={dtoClass}
        useTableProps={useTableProps}
        filters={filters}
        dtoResourceType={dtoResourceType}
        dtoGqlListQuery={dtoGqlListQuery}
      />
    </Form>
  );
};
