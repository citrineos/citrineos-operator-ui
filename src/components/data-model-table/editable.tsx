import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Button, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  extractSchema,
  FieldSchema,
  FieldType,
  getClassTransformerType,
  renderField,
} from '../form';
import { StatusIcon } from '../status-icon';
import GenericTag from '../tag';
import { TruncateDisplay } from '../truncate-display';
import { TimestampDisplay } from '../timestamp-display';
import { ExpandableColumn } from './expandable-column';
import { AssociatedTable } from './associated-table';
import { AssociatedView } from './associated-view';
import { Constructable } from '../../util/Constructable';
import { plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { CLASS_GQL_LIST_QUERY } from '../../util/decorators/ClassGqlListQuery';
import { CLASS_GQL_DELETE_MUTATION } from '../../util/decorators/ClassGqlDeleteMutation';
import { useForm } from '@refinedev/antd';
import {
  DataProvider,
  HttpError,
  useCustomMutation,
  useDataProvider,
} from '@refinedev/core';
import { PRIMARY_KEY_FIELD_NAME } from '../../util/decorators/PrimaryKeyFieldName';
import { GetFields, GetVariables } from '@refinedev/hasura';
import { CLASS_GQL_EDIT_MUTATION } from '../../util/decorators/ClassGqlEditMutation';
import { CLASS_GQL_GET_QUERY } from '../../util/decorators/ClassGqlGetQuery';
import { CLASS_GQL_CREATE_MUTATION } from '../../util/decorators/ClassGqlCreateMutation';
import { ColorModeContext } from '../../contexts/color-mode';
import { CustomAction } from '../custom-actions';
import { FieldPath } from '../form/state/fieldpath';
import { AssociationSelection } from './association-selection';
import { ActionsColumnEnhanced, ColumnAction } from './actions-column-enhanced';
import { Unknowns, UnknownsActions } from '../form/state/unknowns';
import { Flags } from '../form/state/flags';
import { EvseProps } from '../../pages/evses/Evse';
import {
  GQL_ASSOCIATION,
  GqlAssociationProps,
} from '../../util/decorators/GqlAssociation';
import { TableWrapper, TableWrapperRef } from './table-wrapper';
import { NEW_IDENTIFIER } from '../../util/consts';

const renderViewContent = (
  field: FieldSchema,
  _value: any, // todo may not be needed, seems that `render()` in the columns that are passed to table doesnt include a valid value?
  record: any, // todo type
  editable = false,
) => {
  const value = record[field.name];
  const fieldType = field.type;
  const fieldOptions = field.options;
  let parentIdFieldName, associatedIdFieldName, gqlQuery, gqlListQuery;
  if (field.gqlAssociationProps) {
    parentIdFieldName = field.gqlAssociationProps.parentIdFieldName;
    associatedIdFieldName = field.gqlAssociationProps.associatedIdFieldName;
    gqlQuery = field.gqlAssociationProps.gqlQuery;
    gqlListQuery = field.gqlAssociationProps.gqlListQuery;
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
        <>
          <AssociatedView
            parentRecord={record}
            associatedRecordClass={field.dtoClass!}
            parentIdFieldName={parentIdFieldName!}
            associatedIdFieldName={associatedIdFieldName!}
            gqlQuery={gqlQuery}
            gqlListQuery={gqlListQuery}
          // editable={editable} todo do we want to have associated detail view show in editable state?
          />
        </>
      );
    case FieldType.array:
      if (!field.gqlAssociationProps) {
        return 'Error: No gqlAssociationProps provided when rendering GenericDataTable';
      }

      return (
        <ExpandableColumn
          expandedContent={
            <AssociatedTable
              parentRecord={record}
              associatedRecordClass={field.dtoClass!}
              parentIdFieldName={parentIdFieldName!}
              associatedIdFieldName={associatedIdFieldName!}
              gqlQuery={gqlQuery}
            />
          }
          viewTitle={`Associated Table: ${field.dtoClass?.name}`}
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

export enum SelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export interface GenericDataTableProps {
  // todo make generic / typed
  gqlDeleteMutation?: any;
  dtoClass: Constructable<any>;
  filters?: any;
  selectable?: SelectionType | null;
  useTableProps?: any;
  onSelectionChange?: (selectedRows: any[]) => void;
  editable?: boolean;
  customActions?: CustomAction<any>[];
}

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
    editable: passedEditable,
    customActions,
  } = props;

  let editable = false;

  const getDataProvider = useDataProvider();
  const dataProvider: DataProvider = getDataProvider();

  if (!passedEditable) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { mode } = useContext(ColorModeContext);

    const isDarkMode = mode === 'dark';
    editable = isDarkMode;
  }

  const dtoClassInstance = useMemo(() => {
    return plainToInstance(dtoClass, {});
  }, [dtoClass]);

  const dtoResourceType = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_RESOURCE_TYPE,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find ResourceType for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const dtoGqlListQuery = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_GQL_LIST_QUERY,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find GqlListQuery for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const dtoGqlGetQuery = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_GQL_GET_QUERY,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find GqlGetQuery for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const dtoGqlCreateMutation = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_GQL_CREATE_MUTATION,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find GqlCreateMutation for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const dtoGqlEditMutation = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_GQL_EDIT_MUTATION,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find GqlEditMutation for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const dtoGqlDeleteMutation = useMemo(() => {
    const result = Reflect.getMetadata(
      CLASS_GQL_DELETE_MUTATION,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find GqlDeleteMutation for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const primaryKeyFieldName = useMemo(() => {
    const result = Reflect.getMetadata(
      PRIMARY_KEY_FIELD_NAME,
      dtoClassInstance as Object, //eslint-disable-line
    );
    if (!result) {
      return (
        <Alert
          message="Error: GenericDataTable cannot find primaryKeyFieldName for dtoClass"
          type="error"
        />
      );
    }
    return result;
  }, [dtoClassInstance]);

  const tableWrapperRef = useRef<TableWrapperRef<any>>(null);

  const [visibleOptionalFields, setVisibleOptionalFields] = useState<Flags>(
    Flags.empty(),
  );
  const [unknowns, setUnknowns] = useState<Unknowns>(Unknowns.empty());
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

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
  }, [editingRecord, form, primaryKeyFieldName]);

  const schema: FieldSchema[] = useMemo(
    () => extractSchema(dtoClass),
    [dtoClass],
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
          },
        });
      } else {
        form.setFieldsValue({ ...record });
        setEditingRecord(record);
      }
    },
    [hasChanges],
  );

  const handleCreate = useCallback(() => {
    if (editingRecord) return; // Prevent multiple creations/editing

    const newRecord = {
      [primaryKeyFieldName]: NEW_IDENTIFIER, // Unique key for the new record
      [EvseProps.customData]: {}, // todo real custom data
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
      console.log('mutation result', mutationData, mutationError);

      console.log('Update successful:');
      Modal.success({
        title: 'Save Successful',
        content: `The ${dtoResourceType} record has been updated successfully.`,
      });
      setHasChanges(false);
      setEditingRecord(null);
    }
  }, [mutationData, mutationError]);

  const handleSave = useCallback(async () => {
    const plainValues = await form.validateFields();

    const valuesClass: any = plainToInstance(dtoClass, plainValues);
    delete valuesClass['customData']; // todo real custom data

    let associatedIdFieldName;
    // prepare data
    Object.keys(valuesClass).forEach((key) => {
      const value = valuesClass[key];
      const classTransformerType = getClassTransformerType(valuesClass, key);
      const gqlAssociationProps: GqlAssociationProps = Reflect.getMetadata(
        GQL_ASSOCIATION,
        valuesClass,
        key,
      );
      if (gqlAssociationProps && classTransformerType) {
        associatedIdFieldName = key;
      }
    });

    // eslint-disable-next-line no-prototype-builtins
    if (valuesClass.hasOwnProperty('createdAt') && !valuesClass.createdAt) {
      valuesClass.createdAt = new Date().toISOString();
    }
    valuesClass.updatedAt = new Date().toISOString();

    if (
      !!editingRecord &&
      editingRecord[primaryKeyFieldName] === NEW_IDENTIFIER
    ) {
      // Handle create operation
      if (dataProvider == null || dataProvider == undefined) return;

      try {
        const response = await (dataProvider as any).create({
          resource: dtoResourceType,
          variables: {
            ...valuesClass,
          },
          meta: {
            gqlMutation: dtoGqlCreateMutation,
          },
        });

        console.log('Create successful:', response);

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
        const dtoGqlEditMutation = Reflect.getMetadata(
          CLASS_GQL_EDIT_MUTATION,
          valuesClass,
        );

        console.log(`Saving values for id: ${id}`, valuesClass);
        const meta: any = {
          gqlMutation: dtoGqlEditMutation,
        };
        if (associatedIdFieldName) {
          (meta as any).variables = {
            id: id,
            object: {
              ...valuesClass,
              [associatedIdFieldName]: undefined,
            },
            newAssociatedIds: valuesClass[associatedIdFieldName].map(
              (item: any) => {
                const primaryKeyFieldName = Reflect.getMetadata(
                  PRIMARY_KEY_FIELD_NAME,
                  valuesClass,
                );
                return item[primaryKeyFieldName] || item.id;
              },
            ),
          };
        }
        await mutate({
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
  }, [form, formProps]);

  const handleRowSave = useCallback(
    (_record: any) => {
      handleSave().then();
    },
    [handleSave],
  );

  const cancel = useCallback(() => {
    if (
      !!editingRecord &&
      editingRecord[primaryKeyFieldName] === NEW_IDENTIFIER
    ) {
      tableWrapperRef.current?.removeNewRow();
    } else {
      // Handle cancelling edit on existing record
      setHasChanges(false);
      form.resetFields();
    }
    setEditingRecord(null);
  }, [editingRecord, form, primaryKeyFieldName]);

  const onDeleteSuccess = () => {
    console.log('success');
  };

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

  const columns: FieldSchema[] = useMemo(() => {
    const actionsColumn = {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'left' as const,
      className: 'actions-column',
      render: (_: any, record: any) => {
        const isCurrentlyEditing =
          editingRecord &&
          record[primaryKeyFieldName] === editingRecord[primaryKeyFieldName];
        const actions = !isCurrentlyEditing
          ? editable
            ? [ColumnAction.EDIT, ColumnAction.DELETE]
            : [ColumnAction.SHOW, ColumnAction.DELETE]
          : [ColumnAction.SAVE, ColumnAction.CANCEL, ColumnAction.DELETE];
        return (
          <ActionsColumnEnhanced
            record={record}
            dtoClass={dtoClass}
            onEdit={
              editable &&
                !isCurrentlyEditing &&
                record[primaryKeyFieldName] !== NEW_IDENTIFIER
                ? onEdit
                : undefined
            }
            onSave={isCurrentlyEditing ? handleRowSave : undefined}
            onCancel={isCurrentlyEditing ? cancel : undefined}
            onDeleteSuccess={onDeleteSuccess}
            actions={actions}
            customActions={customActions}
          />
        );
      },
    } as any;

    return [
      actionsColumn,
      ...schema.map((field: FieldSchema) => ({
        title: field.label,
        dataIndex: primaryKeyFieldName,
        sorter: field.sorter,
        editable: true,
        render: (value: any, record: any) => {
          const isCurrentlyEditing =
            editingRecord &&
            record[primaryKeyFieldName] === editingRecord[primaryKeyFieldName];
          if (isCurrentlyEditing) {
            if (field.type === FieldType.array) {
              let parentIdFieldName, associatedIdFieldName, gqlListQuery;
              if (field.gqlAssociationProps) {
                parentIdFieldName = field.gqlAssociationProps.parentIdFieldName;
                associatedIdFieldName =
                  field.gqlAssociationProps.associatedIdFieldName;
                gqlListQuery = field.gqlAssociationProps.gqlListQuery;
              }
              return (
                <div className="editable-cell">
                  <Form.Item name={field.name}>
                    <AssociationSelection
                      selectable={SelectionType.MULTIPLE}
                      parentIdFieldName={parentIdFieldName!}
                      associatedIdFieldName={associatedIdFieldName!}
                      gqlQuery={gqlListQuery}
                      parentRecord={record}
                      associatedRecordClass={field.dtoClass!}
                      value={form.getFieldValue(field.name)}
                      onChange={(newValues: any[]) => {
                        form.setFieldsValue({
                          [field.name]: newValues,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </Form.Item>
                </div>
              );
            }
            if (field.type === FieldType.nestedObject) {
              let parentIdFieldName, associatedIdFieldName, gqlListQuery;
              if (field.gqlAssociationProps) {
                parentIdFieldName = field.gqlAssociationProps.parentIdFieldName;
                associatedIdFieldName =
                  field.gqlAssociationProps.associatedIdFieldName;
                gqlListQuery = field.gqlAssociationProps.gqlListQuery;
              }
              return (
                <div className="editable-cell">
                  <Form.Item name={field.name}>
                    <AssociationSelection
                      parentIdFieldName={parentIdFieldName!}
                      associatedIdFieldName={associatedIdFieldName!}
                      gqlQuery={gqlListQuery}
                      parentRecord={record}
                      associatedRecordClass={field.dtoClass!}
                      value={form.getFieldValue(field.name)}
                      onChange={(newValues: any[]) => {
                        form.setFieldsValue({
                          [field.name]: newValues[0],
                        });
                        setHasChanges(true);
                      }}
                    />
                  </Form.Item>
                </div>
              );
            }

            return renderField({
              schema: field,
              preFieldPath: FieldPath.empty(),
              disabled:
                record[primaryKeyFieldName] === NEW_IDENTIFIER &&
                field.name === primaryKeyFieldName,
              visibleOptionalFields: visibleOptionalFields,
              hideLabels: true,
              enableOptionalField: enableOptionalField,
              toggleOptionalField: toggleOptionalField,
              unknowns: unknowns,
              modifyUnknowns: modifyUnknowns,
              form,
              parentRecord: record,
            });
          }
          return (
            <div className="editable-cell">
              {renderViewContent(field, value, record)}
            </div>
          );
        },
      })),
    ];
  }, [schema, editingRecord, visibleOptionalFields]) as FieldSchema[];

  if (!dataProvider) {
    return (
      <Alert
        message="Error: GenericDataTable cannot find DataProvider"
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
