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
import { getSearchableKeys } from '../../util/decorators/Searcheable';
import { get } from 'http';

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

  const lastSegment = document.location.pathname
    .replace(/\//g, '')
    .replace(/-/g, '_');
  const storageKey = (
    lastSegment
      ? `${lastSegment}_${associatedRecordClass.name}`
      : associatedRecordClass.name
  ).toLowerCase();

  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );

  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as object,
  );
  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociationSelection cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }

  const primaryKeyFieldName: string = Reflect.getMetadata(
    PRIMARY_KEY_FIELD_NAME,
    associatedRecordClassInstance as object,
  );

  if (!primaryKeyFieldName) {
    return (
      <Alert
        message="Error: AssociationSelection cannot find primaryKeyFieldName for associatedRecordClass"
        type="error"
      />
    );
  }

  const [isNew, setNew] = useState<boolean>(false);
  useEffect(() => {
    setNew(
      (!!parentRecord &&
        ((parentRecord as any)[primaryKeyFieldName] === NEW_IDENTIFIER ||
          (parentRecord as any)[parentIdFieldName] === NEW_IDENTIFIER)) ||
        (!!value &&
          ((value as any)[primaryKeyFieldName] === NEW_IDENTIFIER ||
            (value as any)[parentIdFieldName] === NEW_IDENTIFIER)),
    );
  }, [parentRecord, primaryKeyFieldName]);

  const [tagValue, setTagValue] = useState<string>('');

  useEffect(() => {
    const selectedRowsID = getUniqueIds();
    setTagValue(selectedRowsID === '' ? 'Select' : selectedRowsID);
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

  const searchableKeys = getSearchableKeys(associatedRecordClass);

  if (searchableKeys && searchableKeys.size > 0) {
    tableOptions['onSearch'] = (values: any) => {
      const result = [];
      if (!values || !values.search || values.search.length === 0) {
        return [];
      }
      for (const searchableKey of searchableKeys) {
        result.push({
          field: searchableKey,
          operator: 'contains',
          value: values.search,
        });
      }
      return result;
    };
  }

  const {
    tableProps,
    tableQuery: queryResult,
    searchFormProps,
    setSorter,
    setCurrent,
    setPageSize,
  } = useTable<GetQuery>({
    ...tableOptions,
  });

  const [selectedRows, setSelectedRows] = useState<AssociatedModel[]>(() =>
    value ? [value] : [],
  );
  const [selectedRowsKeys, setSelectedRowsKeys] = useState<string[]>([]);

  useEffect(() => {
    setSelectedRowsKeys(
      selectedRows.map((item: any) => (item as any)[primaryKeyFieldName]),
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
      appendToSessionStorage(storageKey, selectedRows);
      const storedItems = sessionStorage.getItem(storageKey);
      if (storedItems) {
        setSelectedRows(JSON.parse(storedItems));
      }

      if (onChange) {
        onChange(selectedRows);
      }
    },
    [onChange],
  );

  const appendToSessionStorage = (key: string, newItem: any) => {
    const existingItems = sessionStorage.getItem(key) || '[]';
    const itemsArray = existingItems ? JSON.parse(existingItems) : [];

    // Check if the item already exists in the index
    const index = getUniqueIds();
    if (index.includes(newItem[0].id)) {
      return;
    }

    itemsArray.push(newItem);
    sessionStorage.setItem(key, JSON.stringify(itemsArray));
  };

  const getUniqueIds = () => {
    const ids: any[] = [];
    const data = JSON.parse(sessionStorage.getItem(storageKey) || '[]');

    // Iterate over the data and collect all IDs
    data.forEach((item: any) => {
      if (Array.isArray(item)) {
        item.forEach((subItem) => {
          if (subItem.id) {
            ids.push(subItem.id);
          }
        });
      } else if (item.id) {
        ids.push(item.id);
      }
    });

    return ids.join(',');
  };

  const rowSelection = useMemo(() => {
    const selectedRowKeys = selectedRows.map(
      (item: any) => item[primaryKeyFieldName],
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

      setTagValue(getUniqueIds());

      closeDrawer();
    },
    [selectedRows, primaryKeyFieldName],
  );

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
            <p>
              Selected Items:
              {getUniqueIds()}
            </p>
            <GenericDataTable
              dtoClass={associatedRecordClass}
              selectable={selectable}
              useTableProps={{
                tableProps,
                searchFormProps,
                setSorter,
                setCurrent,
                setPageSize,
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
