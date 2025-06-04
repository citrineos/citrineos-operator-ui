// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { extractSchema, keyToLabel } from '../form';
import React, { useCallback, useMemo } from 'react';
import { renderViewContent } from './editable';
import { setSelectedAssociatedItems } from '../../redux/association.selection.slice';
import { instanceToPlain } from 'class-transformer';
import { Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { useSelector } from 'react-redux';
import { HIDDEN_WHEN, IsHiddenCheck } from '@util/decorators/HiddenWhen';
import { FieldAnnotations, FieldSchema } from '@interfaces';
import { FieldPath } from '../form/state/fieldpath';
import { Flags } from '../form/state/flags';
import { Unknowns } from '../form/state/unknowns';

export interface SelectedAssociatedItems<Model> {
  fieldPath: FieldPath;
  selectedItems: Model[];
  dtoClass: Model;
  associatedRecordResourceType: ResponseType;
  dispatch: any;
  setSelectedRows: any;
  onChange: any;
  storageKey: any;
  form: any;
  setHasChanges?: any;
  visibleOptionalFields?: Flags;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  modifyUnknowns?: any;
  fieldAnnotations?: FieldAnnotations;
}

export const SelectedAssociatedItems = <Model,>(
  props: SelectedAssociatedItems<Model>,
) => {
  const {
    fieldPath,
    selectedItems,
    dtoClass,
    associatedRecordResourceType,
    dispatch,
    setSelectedRows,
    onChange,
    storageKey,
    form,
    setHasChanges,
    visibleOptionalFields,
    enableOptionalField,
    toggleOptionalField,
    unknowns,
    modifyUnknowns,
    fieldAnnotations,
  } = props;

  const schema: FieldSchema[] = useMemo(
    () => extractSchema(dtoClass),
    [dtoClass],
  );

  const columns = useMemo(() => {
    return schema
      .filter((field) => {
        const isHiddenCheck: IsHiddenCheck = Reflect.getMetadata(
          HIDDEN_WHEN,
          field.parentInstance as any,
          field.name,
        );

        if (isHiddenCheck && isHiddenCheck(selectedItems[0])) {
          return false;
        } else {
          return true;
        }
      })
      .map((field: FieldSchema) => ({
        title: field.label,
        sorter: field.sorter,
        editable: true,
        render: (value: any, record: any) => {
          return (
            <div className="editable-cell">
              {renderViewContent({
                preFieldPath: fieldPath,
                field,
                value,
                record,
                hideLabels: true,
                disabled: true,
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
      }));
  }, [schema]);

  const handleRowChange = useCallback(
    (_newSelectedRowKeys: React.Key[], newSelectedRows: any[]) => {
      dispatch(
        setSelectedAssociatedItems({
          storageKey,
          selectedRows: JSON.stringify(
            newSelectedRows.length === 0
              ? []
              : instanceToPlain(newSelectedRows),
          ),
        }),
      );
      setSelectedRows(newSelectedRows);
      if (onChange) {
        onChange(newSelectedRows);
      }
    },
    [dispatch, onChange, storageKey],
  );

  const rowSelection: TableRowSelection<Model> = useMemo(() => {
    return {
      selectedRowKeys: Array.from(
        { length: selectedItems.length },
        (_, i) => i,
      ),
      onChange: handleRowChange,
      type: 'checkbox',
    };
  }, [selectedItems]);

  const dataWithKeys = useMemo(() => {
    return selectedItems.map((item: any, index: number) => {
      return {
        ...item,
        key: index,
      };
    });
  }, [selectedItems]);

  if (!selectedItems || selectedItems.length === 0) return null;

  return (
    <>
      <h2>Selected {keyToLabel(associatedRecordResourceType)}:</h2>
      <Table
        dataSource={dataWithKeys}
        columns={columns}
        rowSelection={rowSelection}
      />
    </>
  );
};
