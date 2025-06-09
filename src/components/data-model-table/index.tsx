// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import './style.scss';
import { CreateButton, List } from '@refinedev/antd';
import { BaseRecord } from '@refinedev/core';
import { Table } from 'antd';
import { ColumnType } from 'antd/es/table/interface';
import { AnyObject } from 'antd/es/_util/type';
import { IDataModelTableProps } from '../../model/interfaces';

export const DataModelTable = <T extends AnyObject, U extends BaseRecord>({
  tableProps,
  columns,
  hideCreateButton,
  text,
  buttonAction,
}: IDataModelTableProps<T, U>) => {
  const mappedColumns = columns.map((column: ColumnType<T>) => (
    <Table.Column
      key={String(column.dataIndex)}
      {...column}
      onCell={() => ({
        className: `column-${String(column.dataIndex)}`,
      })}
    />
  ));

  const renderTable = (
    <Table rowKey="id" className="generic-table" {...tableProps}>
      {mappedColumns}
    </Table>
  );

  const renderList = (headerButtons?: React.ReactNode) => (
    <List headerButtons={headerButtons}>{renderTable}</List>
  );

  return hideCreateButton
    ? renderTable
    : renderList(
        text && buttonAction ? (
          <CreateButton onClick={buttonAction}>{text}</CreateButton>
        ) : undefined,
      );
};
