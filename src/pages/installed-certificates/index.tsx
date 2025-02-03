import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../model/interfaces';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { InstalledCertificate } from './InstalledCertificate';
import {
  INSTALLED_CERTIFICATE_CREATE_MUTATION,
  INSTALLED_CERTIFICATE_DELETE_MUTATION,
  INSTALLED_CERTIFICATE_EDIT_MUTATION,
  INSTALLED_CERTIFICATE_GET_QUERY,
} from './queries';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../resource-type';
import { AiOutlineProfile } from 'react-icons/ai';
import { DeleteCertificateCustomAction } from '../../message/delete-certificate';

export const InstalledCertificateView: React.FC = () => {
  return (
    <GenericView
      dtoClass={InstalledCertificate}
      gqlQuery={INSTALLED_CERTIFICATE_GET_QUERY}
      editMutation={INSTALLED_CERTIFICATE_EDIT_MUTATION}
      createMutation={INSTALLED_CERTIFICATE_CREATE_MUTATION}
      deleteMutation={INSTALLED_CERTIFICATE_DELETE_MUTATION}
    />
  );
};

export const InstalledCertificateList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable
        dtoClass={InstalledCertificate}
        customActions={[DeleteCertificateCustomAction]}
      />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<InstalledCertificateList />} />
      <Route path="/:id/*" element={<InstalledCertificateView />} />
    </Routes>
  );
};

// Resource Definition
export const resources = [
  {
    name: ResourceType.INSTALLED_CERTIFICATES,
    list: '/installed-certificates',
    create: '/installed-certificates/new',
    show: '/installed-certificates/:id',
    edit: '/installed-certificates/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiOutlineProfile />,
  },
];
