import { extractSchema, FieldSchema, keyToLabel } from '../form';
import React, { useCallback, useMemo } from 'react';
import { renderViewContent } from './editable';
import { setSelectedAssociatedItems } from '../../redux/selectionSlice';
import { instanceToPlain } from 'class-transformer';
import { Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { useSelector } from 'react-redux';

export interface SelectedAssociatedItems<Model> {
  selectedItems: Model[];
  dtoClass: Model;
  associatedRecordResourceType: ResponseType;
  dispatch: any;
  setSelectedRows: any;
  onChange: any;
  storageKey: any;
}

export const SelectedAssociatedItems = <Model,>(
  props: SelectedAssociatedItems<Model>,
) => {
  const {
    selectedItems,
    dtoClass,
    associatedRecordResourceType,
    dispatch,
    setSelectedRows,
    onChange,
    storageKey,
  } = props;

  const schema: FieldSchema[] = useMemo(
    () => extractSchema(dtoClass),
    [dtoClass],
  );

  const columns = useMemo(() => {
    return schema.map((field: FieldSchema) => ({
      title: field.label,
      sorter: field.sorter,
      editable: true,
      render: (value: any, record: any) => {
        return (
          <div className="editable-cell">
            {renderViewContent(field, value, record, useSelector)}
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
