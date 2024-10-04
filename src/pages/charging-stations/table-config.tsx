import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { CHARGING_STATIONS_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { ChargingStations } from '../../graphql/schema.types';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { LocationsList } from '../locations';
import { StatusNotificationsList } from '../status-notifications';
import { CustomAction } from '../../components/custom-actions';

export const CHARGING_STATIONS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
  customActions?: CustomAction<ChargingStations>[],
): TableColumnsType<ChargingStations> => {
  const baseColumns: TableColumnsType<ChargingStations> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'isOnline',
      title: 'Is Online',
    },
    {
      dataIndex: 'locationId',
      title: 'Location ID',
      render: (_: any, record: ChargingStations) => {
        if (!record?.locationId) {
          return '';
        }

        const locationId = record.locationId;
        if (parentView === ResourceType.LOCATIONS) {
          return locationId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'eq', locationId);

        return (
          <ExpandableColumn
            initialContent={locationId}
            expandedContent={
              <LocationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.CHARGING_STATIONS}
              />
            }
            viewTitle={`Location linked to Charging Station with ID ${record.id}`}
          />
        );
      },
    },
    {
      dataIndex: 'StatusNotifications',
      title: 'Status Notifications',
      render: (_: any, record: ChargingStations) => {
        if (
          !record?.StatusNotifications ||
          record.StatusNotifications.length === 0
        ) {
          return '';
        }

        const notificationIds = record.StatusNotifications.map(
          (notification) => notification.id,
        );
        const filter = DEFAULT_EXPANDED_DATA_FILTER(
          'id',
          'in',
          notificationIds,
        );

        return (
          <ExpandableColumn
            expandedContent={
              <StatusNotificationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.CHARGING_STATIONS}
              />
            }
            multipleNested={true}
            viewTitle={`Status Notifications linked to Charging Station with ID ${record.id}`}
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
      render: (_: any, record: ChargingStations) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={CHARGING_STATIONS_DELETE_MUTATION}
          customActions={customActions}
        />
      ),
    });
  }

  return baseColumns;
};
