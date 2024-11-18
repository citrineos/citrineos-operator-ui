import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AutoComplete, Button, Collapse, Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTable } from '@refinedev/antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { plainToInstance } from 'class-transformer';
import { FaChargingStation } from 'react-icons/fa';

import { ResourceType } from '../../resource-type';
import { GenericParameterizedView, GenericView } from '../../components/view';
import { IDataModelListProps } from '../../components';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  CUSTOM_CHARGING_STATION_ACTIONS,
  ADMIN_CHARGING_STATION_ACTIONS,
} from '../../message';
import { ChargingStation } from './ChargingStation';
import { ChargingStationProps } from './ChargingStationProps';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { RootState } from '../../redux/store';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { CustomActions } from '../../components/custom-actions';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
  CHARGING_STATIONS_LIST_QUERY,
} from './queries';
import { TriggerMessageForEvseCustomAction } from '../../message/trigger-message';
import { ChargingStationsListQuery } from '../../graphql/types';
import { useDebounce } from '../../hooks/useDebounce';
import { GenericViewState, SelectionType } from '@enums';

const { Panel } = Collapse;
const { Sider, Content } = Layout;

const styles = {
  layout: { minHeight: '100vh' },
  sidebar: { overflow: 'auto', height: '100vh' },
  sidebarHeader: {
    display: 'flex',
    padding: '0 5px',
    marginBottom: '15px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: { width: '100%', marginBottom: '15px' },
};

export const ChargingStationsView: React.FC = React.memo(() => {
  const [collapsed, setCollapsed] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  const selectedChargingStation = useSelector((state: RootState) =>
    getSelectedChargingStation()(state),
  );

  const station = useMemo(
    () =>
      plainToInstance(
        ChargingStation,
        Array.isArray(selectedChargingStation)
          ? selectedChargingStation
          : [selectedChargingStation],
      )[0],
    [selectedChargingStation],
  );

  const filteredActions = useMemo(() => {
    if (searchValue === undefined) return CUSTOM_CHARGING_STATION_ACTIONS;
    return CUSTOM_CHARGING_STATION_ACTIONS.filter((action) =>
      (action.label?.toLowerCase() || '').includes(searchValue.toLowerCase()),
    );
  }, [searchValue]);

  useEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');
    if (storedColorMode === 'light' || storedColorMode === 'dark') {
      setColorMode(storedColorMode);
    }
  }, []);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleSearch = useDebounce((value: string) => {
    setSearchValue(value);
  }, 300);

  return (
    <Layout style={styles.layout}>
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
        theme={colorMode}
        collapsedWidth={60}
        collapsed={collapsed}
        style={styles.sidebar}
      >
        <div style={styles.sidebarHeader}>
          {!collapsed && <h1>Actions</h1>}
          <Button type="text" onClick={toggleSidebar}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <AutoComplete
          size="large"
          allowClear
          placeholder="Search actions"
          value={searchValue}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <Collapse>
          <Panel key="1" header={!collapsed && 'OCPP Request'}>
            <CustomActions
              showInline
              data={station}
              actions={filteredActions.filter(
                (action) =>
                  !ADMIN_CHARGING_STATION_ACTIONS.includes(action.label),
              )}
            />
          </Panel>
          <Panel key="2" header={!collapsed && 'Admin Actions'}>
            <CustomActions
              showInline
              data={station}
              actions={filteredActions.filter((action) =>
                ADMIN_CHARGING_STATION_ACTIONS.includes(action.label),
              )}
            />
          </Panel>
        </Collapse>
      </Sider>
    </Layout>
  );
});

export const ChargingStationsList: React.FC<IDataModelListProps> = React.memo(
  (props) => {
    useTable<ChargingStationsListQuery>({
      resource: ResourceType.CHARGING_STATIONS,
      sorters: DEFAULT_SORTERS,
      filters: props.filters,
      metaData: { gqlQuery: CHARGING_STATIONS_LIST_QUERY },
    });

    const [chargingStations, setSelectedChargingStations] = useState<
      ChargingStation[]
    >([]);

    const selectionChange = useCallback((selected: ChargingStation[]) => {
      setSelectedChargingStations((prev) => [...prev, ...selected]);
    }, []);

    useEffect(() => {
      console.log('chargingStations', chargingStations);
    }, [chargingStations]);

    return (
      <GenericDataTable
        dtoClass={ChargingStation}
        selectable={SelectionType.MULTIPLE}
        onSelectionChange={selectionChange}
        customActions={CUSTOM_CHARGING_STATION_ACTIONS}
        fieldAnnotations={{
          [ChargingStationProps.evses]: {
            customActions: [TriggerMessageForEvseCustomAction],
          },
        }}
      />
    );
  },
);

export const routes: React.FC = () => (
  <Routes>
    <Route index element={<ChargingStationsList />} />
    <Route path="/:id/*" element={<ChargingStationsView />} />
  </Routes>
);

export const resources = [
  {
    name: ResourceType.CHARGING_STATIONS,
    list: '/charging-stations',
    create: '/charging-stations/new',
    show: '/charging-stations/:id',
    edit: '/charging-stations/:id/edit',
    meta: { canDelete: true },
    icon: <FaChargingStation />,
  },
];

export const renderAssociatedStationId = (record: {
  stationId: string;
  [key: string]: any;
}) => {
  return record?.stationId ? (
    <ExpandableColumn
      initialContent={record.stationId}
      expandedContent={
        <GenericParameterizedView
          resourceType={ResourceType.CHARGING_STATIONS}
          id={record.stationId}
          state={GenericViewState.SHOW}
          dtoClass={ChargingStation}
          gqlQuery={CHARGING_STATIONS_GET_QUERY}
        />
      }
      viewTitle={`Charging Station linked with ID ${record.id}`}
    />
  ) : (
    ''
  );
};
