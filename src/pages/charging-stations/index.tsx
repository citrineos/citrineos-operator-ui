import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import {
  GenericParameterizedView,
  GenericView,
  GenericViewState,
} from '../../components/view';
import { useTable } from '@refinedev/antd';
import { Layout, Button } from 'antd';
import { ChargingStationsListQuery } from '../../graphql/types';
import { ChargingStation } from './ChargingStation';
import { IDataModelListProps } from '../../components';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
  CHARGING_STATIONS_LIST_QUERY,
} from './queries';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { FaChargingStation } from 'react-icons/fa';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { CUSTOM_CHARGING_STATION_ACTIONS } from '../../message';
import { ChargingStationProps } from './ChargingStationProps';
import { EvseProps } from '../evses/Evse';
import {
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../../message/queries';
import { TriggerMessageForEvseCustomAction } from '../../message/trigger-message';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd';
import { useSelector } from 'react-redux';
import { CustomActions } from '../../components/custom-actions';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { RootState } from '../../redux/store';
import { plainToInstance } from 'class-transformer';

const { Sider, Content } = Layout;

export const ChargingStationsView: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filteredActions, setFilteredActions] = useState(
    CUSTOM_CHARGING_STATION_ACTIONS,
  );

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = CUSTOM_CHARGING_STATION_ACTIONS.filter((action) =>
      action.label.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredActions(filtered);
  };

  const selectedChargingStation = useSelector((state: RootState) =>
    getSelectedChargingStation()(state),
  );

  const station: ChargingStation = plainToInstance(
    ChargingStation,
    Array.isArray(selectedChargingStation)
      ? selectedChargingStation
      : [selectedChargingStation],
  )[0];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Content>
          <GenericView
            dtoClass={ChargingStation}
            gqlQuery={CHARGING_STATIONS_GET_QUERY}
            editMutation={CHARGING_STATIONS_EDIT_MUTATION}
            createMutation={CHARGING_STATIONS_CREATE_MUTATION}
            deleteMutation={CHARGING_STATIONS_DELETE_MUTATION}
            customActions={CUSTOM_CHARGING_STATION_ACTIONS}
          />
        </Content>
        <Sider
          width={280}
          collapsible
          trigger={null}
          onCollapse={toggle}
          collapsedWidth={60}
          collapsed={collapsed}
          defaultCollapsed={true}
          style={{ background: '#141414' }}
        >
          <span
            style={{
              color: 'white',
              display: 'flex',
              padding: '0 5px',
              marginBottom: '15px',
              alignItems: 'center',
              backgroundColor: '#141414',
              justifyContent: 'space-between',
            }}
          >
            {!collapsed && <h1>Actions</h1>}
            <Button type="text" onClick={toggle}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </span>

          <AutoComplete
            size="large"
            allowClear={true}
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search actions"
            onClear={() => handleSearch('')}
            style={{ width: '100%', marginBottom: '15px' }}
          />

          <CustomActions
            data={station}
            showInline={true}
            actions={filteredActions}
          />
        </Sider>
      </Layout>
    </Layout>
  );
};

export const ChargingStationsList = (props: IDataModelListProps) => {
  const { tableProps: _tableProps } = useTable<ChargingStationsListQuery>({
    resource: ResourceType.CHARGING_STATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: CHARGING_STATIONS_LIST_QUERY,
    },
  });

  return (
    <GenericDataTable
      dtoClass={ChargingStation}
      customActions={CUSTOM_CHARGING_STATION_ACTIONS}
      gqlQueryVariablesMap={{
        [ChargingStationProps.evses]: (station: ChargingStation) => ({
          stationId: station.id,
        }),
        [ChargingStationProps.transactions]: (station: ChargingStation) => ({
          stationId: station.id,
        }),
      }}
      fieldAnnotations={{
        [ChargingStationProps.evses]: {
          gqlAssociationProps: {
            parentIdFieldName: ChargingStationProps.id,
            associatedIdFieldName: EvseProps.id,
            gqlQuery: GET_EVSES_FOR_STATION,
            gqlListQuery: GET_EVSE_LIST_FOR_STATION,
            gqlUseQueryVariablesKey: ChargingStationProps.evses,
          },
          customActions: [TriggerMessageForEvseCustomAction],
        },
      }}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationsList />} />
      <Route path="/:id/*" element={<ChargingStationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CHARGING_STATIONS,
    list: '/charging-stations',
    create: '/charging-stations/new',
    show: '/charging-stations/:id',
    edit: '/charging-stations/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <FaChargingStation />,
  },
];

export const renderAssociatedStationId = (
  _: any,
  record: {
    stationId: string;
    [key: string]: any;
  },
) => {
  if (!record?.stationId) {
    return '';
  }
  const stationId = record.stationId;
  return (
    <ExpandableColumn
      initialContent={stationId}
      expandedContent={
        <>
          <GenericParameterizedView
            resourceType={ResourceType.CHARGING_STATIONS}
            id={stationId}
            state={GenericViewState.SHOW}
            dtoClass={ChargingStation}
            gqlQuery={CHARGING_STATIONS_GET_QUERY}
          />
        </>
      }
      viewTitle={`Charging Station linked with ID ${record.id}`}
    />
  );
};
