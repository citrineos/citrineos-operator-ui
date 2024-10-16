import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { useTable, useTableProps } from '@refinedev/antd';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '../../util/Constructable';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { GqlAssociationProps } from '../../util/decorators/GqlAssociation';
import { PRIMARY_KEY_FIELD_NAME } from '../../util/decorators/PrimaryKeyFieldName';
import { GenericDataTable, SelectionType } from './editable';
import GenericTag from '../tag';
import { ExpandableColumn } from './expandable-column';
import { NEW_IDENTIFIER } from '../../util/consts';
import { getSearchableKeys } from '../../util/decorators/Searcheable';
import { CrudFilters } from '@refinedev/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  addModelsToStorage,
  getAllUniqueNames,
  selectModelsByKey,
  getSelectedKeyValue,
} from '../../redux/selectionSlice';
import { LABEL_FIELD } from '../../util/decorators/LabelField';

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
  const dispatch = useDispatch();
  const models = useSelector(selectModelsByKey(storageKey));

  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );

  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as object,
  );

  const selectedIdentifiers = useSelector(getSelectedKeyValue(storageKey, associatedRecordClassInstance as object)) || '';

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
    const selectedRowsID = selectedIdentifiers;
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

  const {
    tableProps,
    tableQuery: queryResult,
    searchFormProps,
    setSorters,
    setCurrent,
    setPageSize,
  } = useTable<GetQuery>({
    ...tableOptions,
  });

  const [selectedRows, setSelectedRows] = useState<AssociatedModel[]>(() =>
    value ? [value] : [],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      dispatch(
        addModelsToStorage({
          storageKey,
          selectedRows: JSON.stringify(instanceToPlain(selectedRows)),
        }),
      );

      if (models !== undefined) {
        setSelectedRows(JSON.parse(models));
      }

      if (onChange && newSelectedRowKeys.length > 0) {
        onChange(selectedRows);
      }
    },
    [onChange, models],
  );

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

      setTagValue(selectedIdentifiers);

      closeDrawer();
    },
    [selectedRows, primaryKeyFieldName],
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

  if (searchableKeys && searchableKeys.size > 0) {
    tableOptions['onSearch'] = (values: any): CrudFilters => {
      const result: CrudFilters = [];
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
              Selected {associatedRecordClass.name}(s):
              {selectedIdentifiers}
            </p>
            <GenericDataTable
              dtoClass={associatedRecordClass}
              selectable={selectable}
              useTableProps={{
                tableProps,
                searchFormProps,
                setSorters,
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
