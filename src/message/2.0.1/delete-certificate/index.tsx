// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DeleteCertificateStatusEnumType } from '@OCPP2_0_1';
import { StatusInfoType } from '../model/StatusInfoType';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  InstalledCertificate,
  InstalledCertificateProps,
} from '../../../pages/installed-certificates/InstalledCertificate';
import {
  INSTALLED_CERTIFICATE_GET_QUERY,
  INSTALLED_CERTIFICATE_LIST_QUERY,
} from '../../../pages/installed-certificates/queries';

enum DeleteCertificateDataProps {
  installedCertificate = 'installedCertificate',
}

class DeleteCertificateData {
  @GqlAssociation({
    parentIdFieldName: DeleteCertificateDataProps.installedCertificate,
    associatedIdFieldName: InstalledCertificateProps.id,
    gqlQuery: {
      query: INSTALLED_CERTIFICATE_GET_QUERY,
    },
    gqlListQuery: {
      query: INSTALLED_CERTIFICATE_LIST_QUERY,
    },
  })
  @Type(() => InstalledCertificate)
  @IsNotEmpty()
  installedCertificate!: InstalledCertificate | null;
}

export class DeleteCertificateResponse {
  @IsEnum(DeleteCertificateStatusEnumType)
  status!: DeleteCertificateStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface DeleteCertificateProps {
  station: ChargingStation;
}

export const DeleteCertificate: React.FC<DeleteCertificateProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const deleteCertificateData = new DeleteCertificateData();
  const installCertificate = new InstalledCertificate();
  installCertificate[InstalledCertificateProps.id] =
    NEW_IDENTIFIER as unknown as number;
  deleteCertificateData[DeleteCertificateDataProps.installedCertificate] =
    installCertificate as InstalledCertificate;

  const handleSubmit = async (request: DeleteCertificateData) => {
    const installedCertificate: InstalledCertificate =
      request[DeleteCertificateDataProps.installedCertificate]!;

    if (station.id != installedCertificate.stationId) {
      throw new Error('This certificate does not belong to this station');
    }

    const data = {
      certificateHashData: {
        hashAlgorithm: installedCertificate.hashAlgorithm,
        issuerNameHash: installedCertificate.issuerNameHash,
        issuerKeyHash: installedCertificate.issuerKeyHash,
        serialNumber: installedCertificate.serialNumber,
      },
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/deleteCertificate?identifier=${installedCertificate.stationId}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={DeleteCertificateData}
      onFinish={handleSubmit}
      parentRecord={deleteCertificateData}
      initialValues={deleteCertificateData}
    />
  );
};
