/* eslint-disable react-hooks/rules-of-hooks */
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
import { CLASS_CUSTOM_ACTIONS } from '../../util/decorators/ClassCustomActions';
import { CustomAction } from '../custom-actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedAssociatedItems,
  getSelectedAssociatedItems,
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
  customActions?: CustomAction<any>[];
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
    customActions,
  } = props;

  const dispatch = useDispatch();
  const storageKey = useMemo(
    () =>
      `${(parentRecord as object).constructor.name}_${associatedRecordClass.name}`.toLowerCase(),
    [parentRecord, associatedRecordClass],
  );

  const associatedRecordClassInstance = useMemo(
    () => plainToInstance(associatedRecordClass, {}),
    [associatedRecordClass],
  );

  const associatedRecordResourceType = useMemo(
    () =>
      Reflect.getMetadata(
        CLASS_RESOURCE_TYPE,
        associatedRecordClassInstance as object,
      ),
    [associatedRecordClassInstance],
  );

  const label = useMemo(
    () =>
      Reflect.getMetadata(LABEL_FIELD, associatedRecordClassInstance as object),
    [associatedRecordClassInstance],
  );

  const primaryKeyFieldName = useMemo(
    () =>
      Reflect.getMetadata(
        PRIMARY_KEY_FIELD_NAME,
        associatedRecordClassInstance as object,
      ),
    [associatedRecordClassInstance],
  );

  const selectedItems = useSelector(getSelectedAssociatedItems(storageKey));

  const selectedIdentifiers = useMemo(() => {
    if (selectedItems.length === 0) return '';

    const labelKey = label || primaryKeyFieldName;
    return selectedItems
      .map((item: any) => plainToInstance(associatedRecordClass, item))
      .map((item: any) => item[labelKey])
      .join(', ');
  }, [selectedItems, label, primaryKeyFieldName, associatedRecordClass]);

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
  }, [parentRecord, primaryKeyFieldName, parentIdFieldName, value]);

  const [tagValue, setTagValue] = useState<string>('');
  useEffect(() => {
    const newVal = Array.isArray(value)
      ? value.map((v: any) => (v as any)[primaryKeyFieldName]).join(', ')
      : value
        ? JSON.stringify((value as any)[associatedIdFieldName])
        : '';
    setTagValue(
      isNew ? 'Select' : newVal || (parentRecord as any)[parentIdFieldName],
    );
  }, [isNew, value, associatedIdFieldName, parentRecord, primaryKeyFieldName]);

  const meta: any = useMemo(
    () => ({ gqlQuery, gqlVariables: gqlQueryVariables }),
    [gqlQuery, gqlQueryVariables],
  );

  const tableOptions: useTableProps<GetQuery, any, unknown, GetQuery> = useMemo(
    () => ({
      resource: associatedRecordResourceType,
      sorters: { initial: [{ field: 'updatedAt', order: 'desc' }] },
      filters: [] as any,
      meta,
    }),
    [associatedRecordResourceType, meta],
  );

  const searchableKeys = useMemo(
    () => getSearchableKeys(associatedRecordClass),
    [associatedRecordClass],
  );

  const {
    tableProps,
    tableQuery: queryResult,
    searchFormProps,
    setSorters,
    setCurrent,
    setPageSize,
  } = useTable<GetQuery>(tableOptions);

  const [selectedRows, setSelectedRows] = useState<AssociatedModel[]>(() =>
    value ? [value] : [],
  );

  const handleRowChange = useCallback(
    (newSelectedRowKeys: React.Key[], selectedRows: AssociatedModel[]) => {
      dispatch(
        setSelectedAssociatedItems({
          storageKey,
          selectedRows: JSON.stringify(instanceToPlain(selectedRows)),
        }),
      );
      setSelectedRows(selectedRows);
      onChange?.(selectedRows);
    },
    [dispatch, onChange, storageKey],
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedRows.map(
        (item: any) => item[primaryKeyFieldName],
      ),
      onChange: handleRowChange,
      type: selectable === SelectionType.SINGLE ? 'radio' : 'checkbox',
    }),
    [selectedRows, handleRowChange, selectable],
  );

  const handleSelectionSave = useCallback(
    (closeDrawer: () => void) => {
      onChange?.(selectedRows);
      setTagValue(selectedIdentifiers);
      closeDrawer();
    },
    [onChange, selectedRows, selectedIdentifiers],
  );

  if (!associatedRecordResourceType || !primaryKeyFieldName) {
    return (
      <Alert
        message={`Error: AssociationSelection cannot find ${
          !associatedRecordResourceType ? 'ResourceType' : 'primaryKeyFieldName'
        } for associatedRecordClass`}
        type="error"
      />
    );
  }

  tableOptions.onSearch = useCallback(
    (values: any): CrudFilters => {
      if (!values?.search?.length) return [];
      return Array.from(searchableKeys).map((key) => ({
        field: key,
        operator: 'contains',
        value: values.search,
      }));
    },
    [searchableKeys],
  );

  if (queryResult?.isLoading) return <Spin />;
  if (queryResult?.isError)
    return (
      <Alert
        message="Error loading data"
        description={queryResult.error?.message}
        type="error"
      />
    );

  return (
    <ExpandableColumn
      useInitialContentAsButton
      initialContent={
        <GenericTag stringValue={tagValue} icon={<ExportOutlined />} />
      }
      expandedContent={({ closeDrawer }) => (
        <>
          <p>
            Selected {associatedRecordClass.name}(s): {selectedIdentifiers}
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
              rowSelection,
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
  );
};
