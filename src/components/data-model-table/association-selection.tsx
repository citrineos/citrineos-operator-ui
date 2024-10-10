import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { useTable, useTableProps } from '@refinedev/antd';
import { plainToInstance } from 'class-transformer';
import { Constructable } from '../../util/Constructable';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { GqlAssociationProps } from '../../util/decorators/GqlAssociation';
import { PRIMARY_KEY_FIELD_NAME } from '../../util/decorators/PrimaryKeyFieldName';
import { GenericDataTable, SelectionType } from './editable';
import GenericTag from '../tag';
import { ExpandableColumn } from './expandable-column';
import { NEW_IDENTIFIER } from '../../util/consts';

export interface AssociationSelectionProps<ParentModel, AssociatedModel>
  extends GqlAssociationProps {
  parentRecord: ParentModel;
  associatedRecordClass: Constructable<AssociatedModel>;
  value?: AssociatedModel;
  onChange?: (value: AssociatedModel[]) => void;
  selectable?: SelectionType | null;
  gqlQueryVariables?: any;
}

export const AssociationSelection = <
  ParentModel,
  AssociatedModel,
  GetQuery extends Record<any, any>,
>(
  props: AssociationSelectionProps<ParentModel, AssociatedModel>,
) => {
  const {
    parentRecord,
    associatedRecordClass,
    parentIdFieldName,
    gqlQuery,
    value,
    onChange,
    selectable = SelectionType.SINGLE,
    associatedIdFieldName,
    gqlQueryVariables,
  } = props;

  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );

  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as Object, //eslint-disable-line
  );

  const primaryKeyFieldName: string = Reflect.getMetadata(
    PRIMARY_KEY_FIELD_NAME,
    associatedRecordClassInstance as Object, //eslint-disable-line
  );

  const [isNew, setNew] = useState<boolean>(false);
  useEffect(() => {
    if (primaryKeyFieldName == null || primaryKeyFieldName == undefined) return;

    setNew(
      (parentRecord as any)[primaryKeyFieldName] === NEW_IDENTIFIER ||
      (parentRecord as any)[parentIdFieldName] === NEW_IDENTIFIER,
    );
  }, [parentRecord, primaryKeyFieldName]);

  const [tagValue, setTagValue] = useState<string>('');

  useEffect(() => {
    if (primaryKeyFieldName == null || primaryKeyFieldName == undefined) return;
    let newVal = '';
    if (Array.isArray(value)) {
      newVal = value
        .map((v: any) => (v as any)[primaryKeyFieldName])
        .join(', ');
    } else {
      newVal = value
        ? JSON.stringify((value as any)[associatedIdFieldName])
        : '';
    }
    setTagValue(
      isNew ? 'Select' : newVal || (parentRecord as any)[parentIdFieldName],
    );
  }, [isNew, value]);

  const meta: any = {
    gqlQuery,
  };

  if (gqlQueryVariables) {
    meta.gqlVariables = gqlQueryVariables;
  }

  const tableOptions: useTableProps<GetQuery, any, unknown, GetQuery> = {
    resource: associatedRecordResourceType,
    sorters: {
      initial: [
        {
          field: 'updatedAt',
          order: 'desc',
        },
      ],
    },
    filters: [] as any,
    meta,
  };

  const { tableProps, tableQuery: queryResult } = useTable<GetQuery>({
    ...tableOptions,
  });

  const [selectedRows, setSelectedRows] = useState<AssociatedModel[]>(() =>
    value ? [value] : [],
  );
  const [selectedRowsKeys, setSelectedRowsKeys] = useState<string[]>([]);

  useEffect(() => {
    setSelectedRowsKeys(
      selectedRows.map((item: any) => (item as any)[primaryKeyFieldName ?? 0]),
    );
  }, [selectedRows]);

  useEffect(() => {
    const data = (tableProps?.dataSource || []).map(
      (item: any) =>
        plainToInstance(associatedRecordClass, item) as AssociatedModel,
    );

    // Calculate matching row keys after data is processed
    const matchingRows = data.filter(
      (item: any) =>
        (item as any)[associatedIdFieldName] ===
        (parentRecord as any)[parentIdFieldName],
    );

    // Update selected row keys
    setSelectedRows(matchingRows);
  }, [tableProps?.dataSource]);

  const handleRowChange = useCallback(
    (newSelectedRowKeys: React.Key[], selectedRows: AssociatedModel[]) => {
      setSelectedRows(selectedRows);

      if (onChange && newSelectedRowKeys.length > 0) {
        onChange(selectedRows);
      }
    },
    [onChange],
  );

  const rowSelection = useMemo(() => {
    const selectedRowKeys = selectedRows.map(
      (item: any) => item[primaryKeyFieldName ?? 0],
    );
    return {
      selectedRowKeys: selectedRowKeys,
      onChange: handleRowChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
      type: selectable === SelectionType.SINGLE ? 'radio' : 'checkbox',
    };
  }, [selectedRows, handleRowChange]);

  const handleSelectionSave = useCallback(
    (closeDrawer: () => void) => {
      if (onChange) {
        onChange(selectedRows);
      }
      setTagValue(
        selectedRows
          .map((item: any) => item[primaryKeyFieldName ?? 0] || item.id)
          .join(', '),
      );
      closeDrawer();
    },
    [selectedRows, primaryKeyFieldName ?? 0],
  );

  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociationSelection cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }

  if (!primaryKeyFieldName) {
    return (
      <Alert
        message="Error: AssociationSelection cannot find primaryKeyFieldName for associatedRecordClass"
        type="error"
      />
    );
  }

  if (queryResult?.isLoading) {
    return <Spin />;
  }

  if (queryResult?.isError) {
    return (
      <Alert
        message="Error loading data"
        description={queryResult.error?.message}
        type="error"
      />
    );
  }

  return (
    <>
      <ExpandableColumn
        useInitialContentAsButton={true}
        initialContent={
          <>
            <GenericTag stringValue={tagValue} icon={<ExportOutlined />} />
          </>
        }
        expandedContent={({ closeDrawer }) => (
          <>
            <GenericDataTable
              dtoClass={associatedRecordClass}
              selectable={selectable}
              tableProps={{
                ...tableProps,
                rowSelection: rowSelection,
              }}
            />
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSelectionSave(closeDrawer)}
              disabled={selectedRows.length === 0}
            >
              Save
            </Button>
          </>
        )}
        viewTitle={`Please select associated ${associatedRecordResourceType}`}
      />
    </>
  );
};
