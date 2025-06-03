// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { TARIFF_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { Tariffs } from '../../graphql/schema.types';

export const TARIFF_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
): TableColumnsType<Tariffs> => {
  const baseColumns: TableColumnsType<Tariffs> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      // render: renderAssociatedStationId as any,
    },
    {
      dataIndex: 'currency',
      title: 'Currency',
    },
    {
      dataIndex: 'pricePerKwh',
      title: 'Price Per KWh',
    },
    {
      dataIndex: 'pricePerMin',
      title: 'Price Per Minute',
    },
    {
      dataIndex: 'pricePerSession',
      title: 'Price Per Session',
    },
    {
      dataIndex: 'authorizationAmount',
      title: 'Authorization Amount',
    },
    {
      dataIndex: 'paymentFee',
      title: 'Payment Fee',
    },
    {
      dataIndex: 'taxRate',
      title: 'Tax Rate',
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: Tariffs) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={TARIFF_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
