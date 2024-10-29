import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { MeterValueListQuery } from '../../graphql/types';
import { MeterValue } from './MeterValue';
import { DataModelTable, IDataModelListProps } from '../../components';
import {
  METER_VALUE_CREATE_MUTATION,
  METER_VALUE_DELETE_MUTATION,
  METER_VALUE_EDIT_MUTATION,
  METER_VALUE_GET_QUERY,
  METER_VALUE_LIST_QUERY,
} from './queries';
import { METER_VALUE_COLUMNS } from './table-config';
import { BsSpeedometer } from 'react-icons/bs';

export const MeterValueView: React.FC = () => {
  return (
    <GenericView
      dtoClass={MeterValue}
      gqlQuery={METER_VALUE_GET_QUERY}
      editMutation={METER_VALUE_EDIT_MUTATION}
      createMutation={METER_VALUE_CREATE_MUTATION}
      deleteMutation={METER_VALUE_DELETE_MUTATION}
    />
  );
};

export const MeterValueList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<MeterValueListQuery>({
    resource: ResourceType.METER_VALUES,
    sorters: {
      initial: [
        {
          field: 'timestamp',
          order: 'desc',
        },
      ],
    },
    filters: props.filters,
    metaData: {
      gqlQuery: METER_VALUE_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<MeterValue, MeterValueListQuery>
      tableProps={tableProps}
      columns={METER_VALUE_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MeterValueList />} />
      <Route path="/:id/*" element={<MeterValueView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.METER_VALUES,
    list: '/meter-values',
    create: '/meter-values/new',
    show: '/meter-values/:id',
    edit: '/meter-values/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <BsSpeedometer />,
  },
];
