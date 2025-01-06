import React, { useState } from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
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
} from '@citrineos/base';
import { formatPem, showError, showSucces } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { GenericForm } from '../../components/form';
import { BaseRestClient } from '@util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { useSelectedChargingStationIds } from '@hooks';

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

export class RootCertificateRequest {
  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsEnum(InstallCertificateUseEnumType)
  @IsNotEmpty()
  certificateType!: InstallCertificateUseEnumType;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @IsString()
  @IsOptional()
  callbackUrl?: string;
}

export const InstallCertificate: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = { form };
  const installCertificateData = new InstallCertificateData();
  const stationIds = useSelectedChargingStationIds('identifier=');

  const [_parentRecord, _setParentRecord] = useState<any>(
    installCertificateData,
  );

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: InstallCertificateData = plainToInstance(
      InstallCertificateData,
      plainValues,
    );

    try {
      const pemString = formatPem(data.certificate);
      if (pemString == null) {
        throw new Error('Incorrectly formatted PEM');
      }
      data.certificate = pemString;
      const client = new BaseRestClient();
      await client.post(
        `/certificates/installCertificate?${stationIds}&tenantId=1`,
        MessageConfirmation,
        {},
        data,
      );
      showSucces();
    } catch (error: any) {
      showError(
        'The set variables request failed with message: ' + error.message,
      );
    }
  };

  return (
    <>
      <h4>Install Certificate</h4>
      <GenericForm
        formProps={formProps}
        onFinish={handleSubmit}
        dtoClass={InstallCertificateData}
        parentRecord={installCertificateData}
        initialValues={installCertificateData}
      />
    </>
  );
};
