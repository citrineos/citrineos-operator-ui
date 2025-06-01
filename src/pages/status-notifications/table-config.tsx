// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { STATUS_NOTIFICATIONS_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { StatusNotifications } from '../../graphql/schema.types';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ColumnAction } from '@enums';

export const STATUS_NOTIFICATIONS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<StatusNotifications> => {
  const baseColumns: TableColumnsType<StatusNotifications> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'evseId',
      title: 'Evse ID',
    },
    {
      dataIndex: 'connectorId',
      title: 'Connector ID',
    },
    {
      dataIndex: 'timestamp',
      title: 'Timestamp',
    },
    {
      dataIndex: 'connectorStatus',
      title: 'Connector Status',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      render: (_: any, record: StatusNotifications) => {
        if (!record?.stationId) {
          return '';
        }

        const stationId = record.stationId;
        if (parentView === ResourceType.CHARGING_STATIONS) {
          return stationId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'eq', stationId);

        return (
          <div></div>
          /*<ExpandableColumn
            initialContent={stationId}
            expandedContent={
              <ChargingStationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.STATUS_NOTIFICATIONS}
              />
            }
            viewTitle={`Charging Station linked to Status Notification with ID ${record.id}`}
          />*/
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: StatusNotifications) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={STATUS_NOTIFICATIONS_DELETE_MUTATION}
          actions={[{ type: ColumnAction.SHOW }, { type: ColumnAction.DELETE }]}
        />
      ),
    });
  }

  return baseColumns;
};
