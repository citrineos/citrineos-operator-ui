import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { SecurityEvents } from '../../graphql/schema.types';
import { ResourceType } from '../../resource-type';
import { SECURITY_EVENTS_DELETE_MUTATION } from './queries';

export const SECURITY_EVENTS_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
) => {
  const baseColumns: TableColumnsType<SecurityEvents> = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
    },
    {
      dataIndex: 'type',
      title: 'Type',
    },
    {
      dataIndex: 'timestamp',
      title: 'Timestamp',
      render: (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString();
      },
    },
    {
      dataIndex: 'techInfo',
      title: 'Tech Info',
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: SecurityEvents) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={SECURITY_EVENTS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
