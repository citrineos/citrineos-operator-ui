import './style.scss';
import { List } from '@refinedev/antd';
import { BaseRecord } from '@refinedev/core';
import { Table, TableColumnsType, TableProps } from 'antd';
import React from 'react';
import { ColumnType } from 'antd/es/table/interface';
import { AnyObject } from 'antd/es/_util/type';
import { ResourceType } from '../../resource-type';

export interface IDataModelTableProps<T, U> {
  tableProps: TableProps<U>;
  columns: TableColumnsType<T>;
  hideCreateButton?: boolean;
}

// For any list views using DataModelTable
export interface IDataModelListProps {
  filters?: any;
  hideCreateButton?: boolean;
  hideActions?: boolean;
  parentView?: ResourceType;
  viewMode?: 'table' | 'map';
}

export const DataModelTable = <T extends AnyObject, U extends BaseRecord>(
  props: IDataModelTableProps<T, U>,
) => {
  const { tableProps, columns, hideCreateButton } = props;

  const mappedColumns = columns.map((column: ColumnType<T>, index: number) => (
    <Table.Column
      key={column.dataIndex as string}
      {...column}
      onCell={(_record: any) => ({
        className: `column-${String(column.dataIndex)}`,
      })}
    />
  ));

  const table = (
    <Table rowKey="id" className="generic-table" {...tableProps}>
      {mappedColumns}
    </Table>
  );

  if (hideCreateButton) {
    return table;
  } else {
    return <List>{table}</List>;
  }
};
