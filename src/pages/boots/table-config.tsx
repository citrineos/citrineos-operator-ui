// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { BOOTS_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { Boots } from '../../graphql/schema.types';
import { CustomAction } from '../../components/custom-actions';

export const BOOTS_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
  customActions?: CustomAction<Boots>[],
): TableColumnsType<Boots> => {
  const baseColumns: TableColumnsType<Boots> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'lastBootTime',
      title: 'Last Boot Time',
    },
    {
      dataIndex: 'heartbeatInterval',
      title: 'Heartbeat Interval',
    },
    {
      dataIndex: 'bootRetryInterval',
      title: 'Boot Retry Interval',
    },
    {
      dataIndex: 'status',
      title: 'Status',
    },
    {
      dataIndex: 'getBaseReportOnPending',
      title: 'Get Base Report On Pending',
    },
    {
      dataIndex: 'variablesRejectedOnLastBoot',
      title: 'Variables Rejected On Last Boot',
    },

    {
      dataIndex: 'bootWithRejectedVariables',
      title: 'Boot With Rejected Variables',
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: Boots) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={BOOTS_DELETE_MUTATION}
          customActions={customActions}
        />
      ),
    });
  }

  return baseColumns;
};
