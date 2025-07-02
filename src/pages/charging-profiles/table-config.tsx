// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { CHARGING_PROFILES_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { ChargingProfiles } from '../../graphql/schema.types';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
// import { ChargingStationsList } from '../charging-stations';

export const CHARGING_PROFILES_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<ChargingProfiles> => {
  const baseColumns: TableColumnsType<ChargingProfiles> = [
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
                parentView={ResourceType.CHARGING_PROFILES}
              />
            }
            viewTitle={`Charging Station linked to Charging Profile with ID ${record.id}`}
          />*/
        );
      },
    },
    {
      dataIndex: 'chargingProfileKind',
      title: 'Charging Profile Kind',
    },
    {
      dataIndex: 'chargingProfilePurpose',
      title: 'Charging Profile Purpose',
    },
    {
      dataIndex: 'recurrencyKind',
      title: 'Recurrency Kind',
    },
    {
      dataIndex: 'stackLevel',
      title: 'Stack Level',
    },
    {
      dataIndex: 'validFrom',
      title: 'Valid From',
    },
    {
      dataIndex: 'validTo',
      title: 'Valid To',
    },
    {
      dataIndex: 'evseId',
      title: 'Evse ID',
    },
    {
      dataIndex: 'isActive',
      title: 'Is Active',
    },
    {
      dataIndex: 'chargingLimitSource',
      title: 'Charging Limit Source',
    },
    {
      dataIndex: 'transactionDatabaseId',
      title: 'Transaction Database ID',
      render: (_: any, record: any) => {
        if (!record?.transactionDatabaseId) {
          return '';
        }

        const transactionDatabaseId = record.transactionDatabaseId;
        if (parentView === ResourceType.TRANSACTIONS) {
          return transactionDatabaseId;
        }

        const _filter = DEFAULT_EXPANDED_DATA_FILTER(
          'id',
          'eq',
          transactionDatabaseId,
        );

        return (
          <ExpandableColumn
            initialContent={transactionDatabaseId}
            expandedContent={
              <>{'TODO'}</>
              // <TransactionsList
              //   filters={filter}
              //   hideCreateButton={true}
              //   hideActions={true}
              //   parentView={ResourceType.CHARGING_PROFILES}
              // />
            }
            viewTitle={`Transaction linked to Charging Profile with ID ${record.id}`}
          />
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: any) => (
        <ActionsColumn
          record={record}
          idField={'databaseId'}
          gqlDeleteMutation={CHARGING_PROFILES_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
