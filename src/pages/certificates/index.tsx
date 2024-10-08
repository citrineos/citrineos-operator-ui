import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { CertificatesListQuery } from '../../graphql/types';
import { Certificate } from './Certificate';
import { DataModelTable, IDataModelListProps } from '../../components';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  CERTIFICATES_CREATE_MUTATION,
  CERTIFICATES_DELETE_MUTATION,
  CERTIFICATES_EDIT_MUTATION,
  CERTIFICATES_GET_QUERY,
  CERTIFICATES_LIST_QUERY,
} from './queries';
import { CERTIFICATES_COLUMNS } from './table-config';
import { Certificates } from '../../graphql/schema.types';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { CUSTOM_CERTIFICATE_ACTIONS } from '../../message';

export const CertificatesView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Certificate}
      gqlQuery={CERTIFICATES_GET_QUERY}
      editMutation={CERTIFICATES_EDIT_MUTATION}
      createMutation={CERTIFICATES_CREATE_MUTATION}
      deleteMutation={CERTIFICATES_DELETE_MUTATION}
      customActions={CUSTOM_CERTIFICATE_ACTIONS}
    />
  );
};

export const CertificatesList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<CertificatesListQuery>({
    resource: ResourceType.CERTIFICATES,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: CERTIFICATES_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Certificates, CertificatesListQuery>
      tableProps={tableProps}
      columns={CERTIFICATES_COLUMNS(
        !props.hideActions,
        props.parentView,
        CUSTOM_CERTIFICATE_ACTIONS,
      )}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CertificatesList />} />
      <Route path="/:id/*" element={<CertificatesView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CERTIFICATES,
    list: '/certificates',
    create: '/certificates/new',
    show: '/certificates/:id',
    edit: '/certificates/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiFillSafetyCertificate />,
  },
];
