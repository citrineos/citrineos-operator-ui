// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { formatPem, triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  InstallCertificateStatusEnumType,
  InstallCertificateUseEnumType,
} from '@OCPP2_0_1';
import { StatusInfoType } from '../model/StatusInfoType';

enum InstallCertificateDataProps {
  certificate = 'certificate',
  certificateType = 'certificateType',
}

class InstallCertificateData {
  @IsString()
  @Length(0, 5500)
  @IsNotEmpty()
  certificate!: string;

  @IsEnum(InstallCertificateUseEnumType)
  certificateType!: InstallCertificateUseEnumType;
}

export class InstallCertificateResponse {
  @IsEnum(InstallCertificateStatusEnumType)
  status!: InstallCertificateStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface InstallCertificateProps {
  station: ChargingStation;
}

export const InstallCertificate: React.FC<InstallCertificateProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const installCertificateData = new InstallCertificateData();

  const handleSubmit = async (request: InstallCertificateData) => {
    const pemString = formatPem(request.certificate);
    if (pemString == null) {
      throw new Error('Incorrectly formatted PEM');
    }

    const data = {
      certificate: pemString,
      certificateType: request.certificateType,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/installCertificate?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={InstallCertificateData}
      onFinish={handleSubmit}
      parentRecord={installCertificateData}
      initialValues={installCertificateData}
    />
  );
};
