// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CertificateSigningUseEnumType } from '@OCPP2_0_1';
import { readFileContent, triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { SupportedFileFormats } from '@util/decorators/SupportedFileFormats';
import { MessageConfirmation } from 'src/message/MessageConfirmation';

enum CertificateSignedRequestProps {
  certificateType = 'certificateType',
  certificate = 'certificate',
}

class CertificateSignedRequest {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(CertificateSigningUseEnumType)
  @IsOptional()
  certificateType?: CertificateSigningUseEnumType;

  @SupportedFileFormats(['.pem', '.id'])
  @Type(() => File)
  @IsNotEmpty()
  certificate!: File;
}

export interface CertificateSignedProps {
  station: ChargingStation;
}

export const CertificateSigned: React.FC<CertificateSignedProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = { form };

  const certificateSignedRequest = new CertificateSignedRequest();

  const handleSubmit = async (request: CertificateSignedRequest) => {
    try {
      const fileContent = await readFileContent(request.certificate!);

      const data = {
        certificateType: request.certificateType,
        certificateChain: fileContent,
      };

      await triggerMessageAndHandleResponse<MessageConfirmation[]>({
        url: `/certificates/certificateSigned?identifier=${station.id}&tenantId=1`,
        data,
      });
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };
  return (
    <GenericForm
      formProps={formProps}
      dtoClass={CertificateSignedRequest}
      onFinish={handleSubmit}
      parentRecord={certificateSignedRequest}
      initialValues={certificateSignedRequest}
    />
  );
};
