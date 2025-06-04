// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { MESSAGE_INFOS_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { MessageInfos } from '../../graphql/schema.types';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { MessagePriorityEnumType, MessageStateEnumType } from '@OCPP2_0_1';
import { StatusIcon } from '../../components/status-icon';
import { TimestampDisplay } from '../../components/timestamp-display';
import React from 'react';
import GenericTag from '../../components/tag';
import { MessageInfo } from './MessageInfo';
import { DefaultColors } from '@enums';

export const MESSAGE_INFOS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<MessageInfos> => {
  const baseColumns: TableColumnsType<MessageInfos> = [
    {
      dataIndex: 'databaseId',
      title: 'Database ID',
      sorter: true,
    },
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      render: (_: any, record: any) => {
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
                parentView={ResourceType.MESSAGE_INFOS}
              />
            }
            viewTitle={`Charging Station linked to Message Info with ID ${record.databaseId}`}
          />*/
        );
      },
    },
    {
      dataIndex: 'priority',
      title: 'Priority',
      render: ((_: any, record: MessageInfos) => {
        return (
          <GenericTag
            enumValue={record.priority as MessagePriorityEnumType}
            enumType={MessagePriorityEnumType}
            colorMap={{
              AlwaysFront: DefaultColors.GEEKBLUE,
              InFront: DefaultColors.BLUE,
              NormalCycle: DefaultColors.GREEN,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'state',
      title: 'State',
      render: ((_: any, record: MessageInfos) => {
        return (
          <GenericTag
            enumValue={record.state as MessageStateEnumType}
            enumType={MessageStateEnumType}
            colorMap={{
              Charging: DefaultColors.GREEN,
              Faulted: DefaultColors.RED,
              Idle: DefaultColors.BLUE,
              Unavailable: DefaultColors.GOLD,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'startDateTime',
      title: 'Start Date Time',
      render: (_: any, record: MessageInfos) => (
        <TimestampDisplay isoTimestamp={record.startDateTime} />
      ),
    },
    {
      dataIndex: 'endDateTime',
      title: 'End Date Time',
      render: (_: any, record: MessageInfos) => (
        <TimestampDisplay isoTimestamp={record.endDateTime} />
      ),
    },
    {
      dataIndex: 'transactionId',
      title: 'Transaction Id',
      render: (_: any, record: MessageInfos) => {
        if (!record.transactionId || !record.stationId) {
          return <span>N/A</span>;
        }

        /*return (
          <AssociatedTransaction
            transactionId={record.transactionId}
            stationId={record.stationId}
            associateId={record.id}
          />
        );*/
      },
    },
    {
      dataIndex: 'message',
      title: 'Message',
    },
    {
      dataIndex: 'active',
      title: 'Active',
      align: 'center',
      render: (_: any, record: MessageInfos) => (
        <StatusIcon value={record?.active} />
      ),
    },
    {
      dataIndex: 'displayComponentId',
      title: 'Display Component ID',
      render: (_: any, record: any) => {
        if (!(record as unknown as MessageInfo)?.displayComponentId) {
          return '';
        }

        const displayComponentId = (record as unknown as MessageInfo)
          .displayComponentId;
        if (parentView === ResourceType.COMPONENTS) {
          return displayComponentId;
        }

        const _filter = DEFAULT_EXPANDED_DATA_FILTER(
          'id',
          'eq',
          displayComponentId,
        );

        return (
          <ExpandableColumn
            initialContent={displayComponentId}
            expandedContent={<>{'TODO'}</>}
            viewTitle={`Component linked to Message Info with ID ${record.databaseId}`}
          />
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.push({
      dataIndex: 'actions',
      title: 'Actions',
      render: (_: any, record: any) => (
        <ActionsColumn
          record={record}
          idField={'databaseId'}
          gqlDeleteMutation={MESSAGE_INFOS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
