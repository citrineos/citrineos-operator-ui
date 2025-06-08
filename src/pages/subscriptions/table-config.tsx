// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { Subscriptions } from '../../graphql/schema.types';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { SUBSCRIPTIONS_DELETE_MUTATION } from './queries';
import { StatusIcon } from '../../components/status-icon';
import { ResourceType } from '@util/auth';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
// import { ChargingStationsList } from '../charging-stations';

export const SUBSCRIPTIONS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<Subscriptions> => {
  const baseColumns: TableColumnsType<Subscriptions> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
    },
    {
      dataIndex: 'onConnect',
      title: 'On Connect',
      align: 'center',
      render: (_: any, record: Subscriptions) => (
        <StatusIcon value={record?.onConnect} />
      ),
    },
    {
      dataIndex: 'onClose',
      title: 'On Close',
      align: 'center',
      render: (_: any, record: Subscriptions) => (
        <StatusIcon value={record?.onClose} />
      ),
    },
    {
      dataIndex: 'onMessage',
      title: 'On Message',
      align: 'center',
      render: (_: any, record: Subscriptions) => (
        <StatusIcon value={record?.onMessage} />
      ),
    },
    {
      dataIndex: 'sentMessage',
      title: 'Sent Message',
      align: 'center',
      render: (_: any, record: Subscriptions) => (
        <StatusIcon value={record?.sentMessage} />
      ),
    },
    {
      dataIndex: 'messageRegexFilter',
      title: 'Message Regex Filter',
    },
    {
      dataIndex: 'url',
      title: 'URL',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      render: (_: any, record: Subscriptions) => {
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
                parentView={ResourceType.SUBSCRIPTIONS}
              />
            }
            viewTitle={`Charging Station linked to Subscription with ID ${record.id}`}
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
      render: (_: any, record: Subscriptions) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={SUBSCRIPTIONS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
