// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

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
import { ResourceType } from '@util/auth';
import { AiOutlineProfile } from 'react-icons/ai';
import { CustomAction } from '../../components/custom-actions';
import { BaseRestClient } from '@util/BaseRestClient';
import { MessageConfirmation } from '../../message/MessageConfirmation';
import {
  generateErrorMessageFromResponses,
  responseSuccessCheck,
} from '../../message/util';
import { notification } from 'antd';

export const DeleteCertificateCustomAction: CustomAction<InstalledCertificate> =
  {
    label: 'Delete Certificate',
    execOrRender: (installedCertificate: InstalledCertificate, setLoading) => {
      requestDeleteCertificate(installedCertificate, setLoading).then(() => {});
    },
  };

export const requestDeleteCertificate = async (
  installedCertificate: InstalledCertificate,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const client = new BaseRestClient();
    const response = await client.post<MessageConfirmation>(
      `/certificates/deleteCertificate?identifier=${installedCertificate.stationId}&tenantId=1`,
      {},
      {
        certificateHashData: {
          hashAlgorithm: installedCertificate.hashAlgorithm,
          issuerNameHash: installedCertificate.issuerNameHash,
          issuerKeyHash: installedCertificate.issuerKeyHash,
          serialNumber: installedCertificate.serialNumber,
        },
      },
    );

    if (responseSuccessCheck(response)) {
      notification.success({
        message: 'Success',
        description: 'The delete certificate request was successful.',
        placement: 'topRight',
      });
    } else {
      notification.error({
        message: 'Request Failed',
        description: `The delete certificate request did not receive a successful response. ${generateErrorMessageFromResponses(response)}`,
        placement: 'topRight',
      });
    }
  } catch (error: any) {
    const msg = `Could not perform request stop transaction, got error: ${error.message}`;
    console.error(msg, error);
    notification.error({
      message: 'Error',
      description: msg,
      placement: 'topRight',
    });
  } finally {
    setLoading(false);
  }
};

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
