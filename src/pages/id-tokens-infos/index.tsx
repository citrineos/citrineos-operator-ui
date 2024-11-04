import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../components';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../resource-type';
import { AuditOutlined } from '@ant-design/icons';
import { IdTokenInfos } from './id-token-infos';
import {
  ID_TOKEN_INFOS_CREATE_MUTATION,
  ID_TOKEN_INFOS_DELETE_MUTATION,
  ID_TOKEN_INFOS_EDIT_MUTATION,
  ID_TOKEN_INFOS_SHOW_QUERY,
} from './queries';

export const IdTokenInfosView: React.FC = () => {
  return (
    <GenericView
      dtoClass={IdTokenInfos}
      gqlQuery={ID_TOKEN_INFOS_SHOW_QUERY}
      editMutation={ID_TOKEN_INFOS_EDIT_MUTATION}
      createMutation={ID_TOKEN_INFOS_CREATE_MUTATION}
      deleteMutation={ID_TOKEN_INFOS_DELETE_MUTATION}
    />
  );
};

export const IdTokenInfosList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable dtoClass={IdTokenInfos} />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<IdTokenInfosList />} />
      <Route path="/:id/" element={<IdTokenInfosView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.ID_TOKEN_INFOS,
    list: '/id-token-infos',
    create: '/id-token-infos/new',
    edit: '/id-token-infos/:id/edit',
    show: '/id-token-infos/:id',
    meta: {
      canDelete: true,
    },
    icon: <AuditOutlined />,
  },
];
