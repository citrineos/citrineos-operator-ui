import { FieldSchema } from '../form';
import { SelectionType } from './editable';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Table, TableProps } from 'antd';
import { plainToInstance } from 'class-transformer';
import { useTable } from '@refinedev/antd';
import isEqual from 'lodash.isequal';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { Constructable } from '../../util/Constructable';
import { NEW_IDENTIFIER } from '../../util/consts';

export interface TableWrapperProps<Model> extends TableProps<Model> {
  dtoClass: Constructable<Model>;
  tableProps: TableProps<Model>;
  selectable?: SelectionType | null;
  onSelectionChange?: (selectedRows: Model[]) => void;
  primaryKeyFieldName: string;
  columns: FieldSchema[];
  editingRecord: Model;
  filters?: any;
  dtoResourceType?: string;
  dtoGqlListQuery?: any;
  gqlQueryVariables?: any;
}

export interface TableWrapperRef<Model> {
  addRecordToTable: (record: Model) => void;
  removeNewRow: () => void;
  refreshTable: () => void;
}

export const TableWrapper = forwardRef((<Model extends { key: any }>(
  props: TableWrapperProps<Model>,
  ref: React.Ref<TableWrapperRef<Model>>,
): ForwardRefExoticComponent<TableWrapperProps<Model>> => {
  const {
    selectable,
    onSelectionChange,
    primaryKeyFieldName,
    columns,
    editingRecord,
    dtoClass,
    tableProps: passedTableProps = null,
    filters,
    dtoResourceType,
    dtoGqlListQuery,
    gqlQueryVariables,
  } = props;

  const rowSelection = useMemo(() => {
    if (!selectable) return undefined;

    const handleRowChange = (
      selectedRowKeys: React.Key[],
      selectedRows: any[],
    ) => {
      // Notify parent of selection change
      if (onSelectionChange) {
        onSelectionChange(selectedRows);
      }
    };

    return {
      selectedRowKeys: props?.rowSelection?.selectedRowKeys || [],
      onChange: handleRowChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
      type: selectable === SelectionType.SINGLE ? 'radio' : 'checkbox',
    };
  }, [selectable, onSelectionChange]);

  const tableOptions: any = useMemo(() => {
    const meta: any = {
      gqlQuery: dtoGqlListQuery,
    };

    if (gqlQueryVariables) {
      meta.gqlVariables = gqlQueryVariables;
    }

    const obj: any = {
      resource: dtoResourceType,
      sorters: {
        initial: [
          {
            field: 'updatedAt',
            order: 'desc',
          },
        ],
      },
      meta,
    };

    if (filters) {
      obj['filters'] = filters;
    }
    return obj;
  }, [filters]);

  const { tableProps: defaultTableProps, tableQuery: queryResult } = useTable(
    tableOptions as any,
  );

  const tableProps: TableProps<Model> = (passedTableProps ||
    defaultTableProps) as any;

  const [dataWithKeys, setDataWithKeys] = useState(() =>
    ((tableProps.dataSource as Model[]) || []).map((item: Model) => ({
      ...item,
      key: (item as any)[primaryKeyFieldName] || (item as any).id,
    })),
  );

  useEffect(() => {
    const newVal = (tableProps.dataSource || []).map((item: any) => {
      const newPlain = {
        ...item,
        key: item[primaryKeyFieldName] || item.id,
      };
      return plainToInstance(dtoClass as any, newPlain);
    });
    if (!isEqual(newVal, dataWithKeys)) {
      setDataWithKeys(newVal as any);
    }
  }, [tableProps.dataSource, primaryKeyFieldName]);

  const addRecordToTable = (record: Model) => {
    setDataWithKeys([record, ...((tableProps.dataSource as Model[]) || [])]);
  };

  const removeNewRow = () => {
    setDataWithKeys((prev: any) => {
      return prev.filter(
        (item: any) => item[primaryKeyFieldName] !== NEW_IDENTIFIER,
      );
    });
  };

  const refreshTable = () => {
    queryResult && queryResult.refetch();
  };

  useImperativeHandle(ref, () => ({
    addRecordToTable,
    removeNewRow,
    refreshTable,
  }));

  return (
    <Table
      ref={ref as any}
      {...tableProps}
      rowSelection={
        (tableProps && tableProps.rowSelection
          ? tableProps.rowSelection
          : rowSelection) as TableRowSelection<Model> | undefined
      }
      dataSource={dataWithKeys}
      columns={columns as any}
      rowClassName={(record: Model) => {
        const isCurrentlyEditing =
          editingRecord &&
          (record as any)[primaryKeyFieldName] ===
            (editingRecord as any)[primaryKeyFieldName];
        return isCurrentlyEditing ? 'editable-row editing-row' : 'editable-row';
      }}
      className="editable-table"
    />
  ) as any;
}) as unknown as ForwardRefRenderFunction<
  TableWrapperRef<{ key: any }>,
  TableWrapperProps<{ key: any }>
>);
