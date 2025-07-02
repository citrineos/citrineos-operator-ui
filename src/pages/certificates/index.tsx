// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Drawer, Form } from 'antd';
import { useTable } from '@refinedev/antd';
import { AiFillSafetyCertificate } from 'react-icons/ai';

import { ResourceType } from '@util/auth';
import { GenericView } from '../../components/view';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { GenericForm } from '../../components/form';
import { useRequestValidator } from '../../util/useRequestValidator';

import {
  CERTIFICATES_CREATE_MUTATION,
  CERTIFICATES_DELETE_MUTATION,
  CERTIFICATES_EDIT_MUTATION,
  CERTIFICATES_GET_QUERY,
  CERTIFICATES_LIST_QUERY,
} from './queries';
import { CERTIFICATES_COLUMNS } from './table-config';
import { Certificate, NewCertificateRequest } from './Certificate';
import { Certificates } from '../../graphql/schema.types';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { CertificatesListQuery } from '../../graphql/types';
import { BaseRestClient } from '@util/BaseRestClient';

const BUTTON_TEXT = 'Generate Certificates';
const DRAWER_TITLE = 'Generate New Certificate';
const CERTIFICATES_API_URL = '/certificates/certificateChain';

export const CertificatesView: React.FC = () => (
  <GenericView
    dtoClass={Certificate}
    gqlQuery={CERTIFICATES_GET_QUERY}
    editMutation={CERTIFICATES_EDIT_MUTATION}
    createMutation={CERTIFICATES_CREATE_MUTATION}
    deleteMutation={CERTIFICATES_DELETE_MUTATION}
  />
);

export const CertificatesList: React.FC<IDataModelListProps> = ({
  filters,
  hideCreateButton,
  hideActions,
  parentView,
}) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { onValuesChange } = useRequestValidator(
    NewCertificateRequest,
    setIsFormValid,
  );

  const { tableProps } = useTable<CertificatesListQuery>({
    resource: ResourceType.CERTIFICATES,
    sorters: DEFAULT_SORTERS,
    filters,
    metaData: { gqlQuery: CERTIFICATES_LIST_QUERY },
  });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const initialCertificateRequest = { selfSigned: false };

  const handleSubmit = async (plainValues: any) => {
    const client = new BaseRestClient(null);
    const response = await client.postRaw<NewCertificateRequest>(
      CERTIFICATES_API_URL,
      plainValues,
    );

    if (response.data !== undefined && response.data !== null)
      handleDrawerClose();
  };

  return (
    <>
      <DataModelTable<Certificates, CertificatesListQuery>
        text={BUTTON_TEXT}
        tableProps={tableProps}
        buttonAction={handleDrawerOpen}
        hideCreateButton={hideCreateButton}
        columns={CERTIFICATES_COLUMNS(!hideActions, parentView)}
      />
      <Drawer open={open} onClose={handleDrawerClose} title={DRAWER_TITLE}>
        <GenericForm
          ref={formRef}
          formProps={{ form }}
          onFinish={handleSubmit}
          submitDisabled={!isFormValid}
          onValuesChange={onValuesChange}
          dtoClass={NewCertificateRequest}
          parentRecord={initialCertificateRequest}
          initialValues={initialCertificateRequest}
        />
      </Drawer>
    </>
  );
};

export const routes: React.FC = () => (
  <Routes>
    <Route index element={<CertificatesList />} />
    <Route path="/:id/*" element={<CertificatesView />} />
  </Routes>
);

export const resources = [
  {
    name: ResourceType.CERTIFICATES,
    list: '/certificates',
    create: '/certificates/new',
    show: '/certificates/:id',
    meta: { canDelete: true },
    icon: <AiFillSafetyCertificate />,
  },
];
