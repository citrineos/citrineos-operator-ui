import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AutoComplete, Button, Collapse, Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { useTable } from '@refinedev/antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FaChargingStation } from 'react-icons/fa';

import '../../style.scss';
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
import { setSelectedChargingStations } from '@redux';
import { GenericViewState, SelectionType } from '@enums';
import { ChargingStationsListQuery } from '../../graphql/types';
import { useDebounce, useColorMode, useSelectedChargingStation } from '@hooks';
import { TriggerMessageForEvseCustomAction } from '../../message/trigger-message';

const { Panel } = Collapse;
const { Sider, Content } = Layout;

export const ChargingStationsView: React.FC = React.memo(() => {
  const [colorMode] = useColorMode();
  const [collapsed, setCollapsed] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const station = useSelectedChargingStation(0) as ChargingStation;

  const filteredActions = useMemo(() => {
    return searchValue
      ? CUSTOM_CHARGING_STATION_ACTIONS.filter((action) =>
          action.label?.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : CUSTOM_CHARGING_STATION_ACTIONS;
  }, [searchValue]);

  useDebounce(searchValue, 300);

  return (
    <Layout className="layout">
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
        collapsedWidth={60}
        collapsed={collapsed}
        className="sidebar"
        theme={colorMode as 'light' | 'dark' | undefined}
      >
        <div className="sidebarHeader">
          {!collapsed && <h1>Actions</h1>}
          <Button type="text" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <AutoComplete
          size="large"
          allowClear
          placeholder="Search actions"
          value={searchValue}
          onChange={setSearchValue}
          className="searchInput"
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
    const dispatch = useDispatch();
    const { tableProps, searchFormProps, setSorters, setCurrent, setPageSize } =
      useTable<ChargingStationsListQuery>({
        resource: ResourceType.CHARGING_STATIONS,
        sorters: DEFAULT_SORTERS,
        filters: props.filters,
        metaData: { gqlQuery: CHARGING_STATIONS_LIST_QUERY },
      });

    const [_chargingStations, setChargingStations] = useState<
      ChargingStation[]
    >([]);

    const rowSelection = useMemo(
      () => ({
        onChange: (
          _selectedRowKeys: React.Key[],
          selectedRows: ChargingStation[],
        ) => {
          setChargingStations(selectedRows);
          dispatch(
            setSelectedChargingStations({
              appendData: false,
              stations: selectedRows,
            }),
          );
        },
      }),
      [],
    );

    return (
      <GenericDataTable
        dtoClass={ChargingStation}
        selectable={SelectionType.MULTIPLE}
        useTableProps={{
          tableProps,
          searchFormProps,
          setSorters,
          setCurrent,
          setPageSize,
          rowSelection,
        }}
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
          id={record.stationId}
          dtoClass={ChargingStation}
          state={GenericViewState.SHOW}
          gqlQuery={CHARGING_STATIONS_GET_QUERY}
          resourceType={ResourceType.CHARGING_STATIONS}
        />
      }
      viewTitle={`Charging Station linked with ID ${record.id}`}
    />
  ) : (
    ''
  );
};
