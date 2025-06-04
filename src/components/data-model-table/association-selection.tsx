// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { ExportOutlined, SaveOutlined } from '@ant-design/icons';
import { useTable, useTableProps } from '@refinedev/antd';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '@util/decorators/ClassResourceType';
import {
  FieldNameAndIsEditable,
  PRIMARY_KEY_FIELD_NAME,
} from '@util/decorators/PrimaryKeyFieldName';
import { GenericDataTable } from './editable';
import { ExpandableColumn } from './expandable-column';
import { NEW_IDENTIFIER } from '@util/consts';
import { getSearchableKeys } from '@util/decorators/Searcheable';
import { CrudFilters } from '@refinedev/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSelectedAssociatedItems,
  setSelectedAssociatedItems,
} from '../../redux/association.selection.slice';
import { LABEL_FIELD } from '@util/decorators/LabelField';
import { generateSearchFilters } from '@util/tables';
import GenericTag from '../tag';
import { SelectedAssociatedItems } from './selected-associated-items';
import { AssociationSelectionProps } from '@interfaces';
import { SelectionType } from '@enums';

export const AssociationSelection = <
  ParentModel,
  AssociatedModel,
  GetQuery extends Record<any, any>,
>(
  props: AssociationSelectionProps<ParentModel, AssociatedModel>,
) => {
  const {
    fieldPath,
    parentRecord,
    associatedRecordClass,
    parentIdFieldName,
    gqlQuery,
    value,
    onChange,
    selectable = SelectionType.SINGLE,
    associatedIdFieldName,
    gqlQueryVariables,
    form,
  } = props;
  const dispatch = useDispatch();

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

  const primaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable = useMemo(
    () =>
      Reflect.getMetadata(
        PRIMARY_KEY_FIELD_NAME,
        associatedRecordClassInstance as object,
      ),
    [associatedRecordClassInstance],
  );

  const primaryKeyFieldName = useMemo(
    () => primaryKeyFieldNameAndIsEditable.fieldName,
    [primaryKeyFieldNameAndIsEditable],
  );

  const labelKey = label || primaryKeyFieldName;

  const uniqueId = useId();
  const storageKey = useMemo(() => {
    if (Object.keys(associatedRecordClassInstance as object).length === 0)
      return '';

    const parentName =
      window.location.pathname.split('/')[1] +
      '_' +
      (parentRecord as object).constructor.name;

    return `${parentName}_${associatedRecordClass.name}_${uniqueId}`.toLowerCase();
  }, [parentRecord, associatedRecordClass]);

  const selectedItems = useSelector(getSelectedAssociatedItems(storageKey));

  const selectedIdentifiers = useMemo(() => {
    if (selectedItems.length === 0) return '';

    return selectedItems
      .map((item: any) => plainToInstance(associatedRecordClass, item))
      .map((item: any) => item[labelKey])
      .join(', ');
  }, [selectedItems, label, primaryKeyFieldName, associatedRecordClass]);

  const [isNew, setNew] = useState<boolean>(false);
  useEffect(() => {
    const newVal =
      (!!parentRecord &&
        ((parentRecord as any)[primaryKeyFieldName] === NEW_IDENTIFIER ||
          (parentRecord as any)[parentIdFieldName] === NEW_IDENTIFIER)) ||
      (!!value &&
        ((value as any)[primaryKeyFieldName] === NEW_IDENTIFIER ||
          (value as any)[parentIdFieldName] === NEW_IDENTIFIER)) ||
      (!value && (parentRecord as any)[parentIdFieldName] === null);
    setNew(newVal);
  }, [parentRecord, primaryKeyFieldName, parentIdFieldName, value]);

  const [tagValue, setTagValue] = useState<string>('');
  useEffect(() => {
    let newVal;
    if (Array.isArray(value)) {
      newVal = value.map((v: any) => (v as any)[labelKey]).join(', ');
    } else if (value) {
      newVal = (value as any)[labelKey];
      if (newVal && typeof newVal === 'object') {
        newVal = JSON.stringify(newVal);
      }
    } else {
      newVal = '';
    }
    const associatedObject = (parentRecord as any)[parentIdFieldName];
    let newTagValue = isNew ? 'Select' : newVal || associatedObject;
    if (
      newTagValue === associatedObject &&
      associatedObject &&
      typeof associatedObject === 'object'
    ) {
      newTagValue = associatedObject[associatedIdFieldName];
    }
    setTagValue(newTagValue);
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

  let initialSelectedRows: AssociatedModel[] = [];
  if (Array.isArray(value)) {
    initialSelectedRows = value;
  } else if (value) {
    initialSelectedRows = [value];
  }
  const [selectedRows, setSelectedRows] =
    useState<AssociatedModel[]>(initialSelectedRows); // todo remove and use redux without state redundancy

  const handleRowChange = useCallback(
    (_newSelectedRowKeys: React.Key[], newSelectedRows: AssociatedModel[]) => {
      const newSelections = newSelectedRows;
      if (selectable === SelectionType.MULTIPLE) {
        selectedRows.forEach((selection: AssociatedModel) => {
          if (
            !queryResult.data?.data.some(
              (item) =>
                item[primaryKeyFieldName] ===
                (selection as any)[primaryKeyFieldName],
            ) &&
            !newSelections.some(
              (item: any) =>
                item[primaryKeyFieldName] ===
                (selection as any)[primaryKeyFieldName],
            ) &&
            (selection as any)[primaryKeyFieldName] !== NEW_IDENTIFIER
          ) {
            newSelections.push(selection);
          }
        });
      }
      dispatch(
        setSelectedAssociatedItems({
          storageKey,
          selectedRows: JSON.stringify(instanceToPlain(newSelections)),
        }),
      );
      setSelectedRows(newSelections);
      onChange?.(newSelections);
    },
    [dispatch, onChange, storageKey, selectedRows, queryResult],
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
      return generateSearchFilters(values, searchableKeys);
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
      onExpanded={async () => {
        if (!isNew) {
          let selectedRows: any[] = [];
          if (Array.isArray(value)) {
            selectedRows = value.map((v: any) => instanceToPlain(v));
          } else if (value) {
            selectedRows = [instanceToPlain(value)];
          }
          dispatch(
            setSelectedAssociatedItems({
              storageKey,
              selectedRows: JSON.stringify(selectedRows),
            }),
          );
        }
      }}
      initialContent={
        <GenericTag stringValue={tagValue} icon={<ExportOutlined />} />
      }
      expandedContent={({ closeDrawer }) => (
        <>
          <SelectedAssociatedItems
            fieldPath={fieldPath}
            selectedItems={selectedItems}
            dtoClass={associatedRecordClass}
            associatedRecordResourceType={associatedRecordResourceType}
            dispatch={dispatch}
            setSelectedRows={setSelectedRows}
            onChange={onChange}
            storageKey={storageKey}
            form={form}
          />
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
