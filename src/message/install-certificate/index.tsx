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
import { OCPP2_0_1 } from '@citrineos/base';
import { formatPem, showError, showSucces } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { GenericForm } from '../../components/form';
import { BaseRestClient } from '@util/BaseRestClient';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { MessageConfirmation } from '../MessageConfirmation';

enum _InstallCertificateDataProps {
  certificate = 'certificate',
  certificateType = 'certificateType',
}

class InstallCertificateData {
  // @GqlAssociation({
  //   parentIdFieldName: InstallCertificateDataProps.certificate,
  //   associatedIdFieldName: CertificateProps.id,
  //   gqlQuery: CERTIFICATES_GET_QUERY,
  //   gqlListQuery: CERTIFICATES_LIST_QUERY,
  // })
  // @Type(() => Certificate)
  // @IsNotEmpty()
  // certificate!: Certificate | null;

  @IsString()
  @Length(0, 5500)
  @IsNotEmpty()
  certificate!: string;

  @IsEnum(OCPP2_0_1.InstallCertificateUseEnumType)
  certificateType!: OCPP2_0_1.InstallCertificateUseEnumType;
}

export class InstallCertificateResponse {
  @IsEnum(OCPP2_0_1.InstallCertificateStatusEnumType)
  status!: OCPP2_0_1.InstallCertificateStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export class RootCertificateRequest {
  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsEnum(OCPP2_0_1.InstallCertificateUseEnumType)
  @IsNotEmpty()
  certificateType!: OCPP2_0_1.InstallCertificateUseEnumType;

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
  // const installCertificate = new Certificate();
  // installCertificate[CertificateProps.id] = NEW_IDENTIFIER as unknown as number;
  // installCertificateData[InstallCertificateDataProps.certificate] =
  //   installCertificate;

  const [_parentRecord, _setParentRecord] = useState<any>(
    installCertificateData,
  );

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: InstallCertificateData = plainToInstance(
      InstallCertificateData,
      plainValues,
    );
    // const certificate: Certificate =
    //   data[InstallCertificateDataProps.certificate]!;
    // const rootCertificateRequest = new RootCertificateRequest();
    // rootCertificateRequest.stationId = station.id;
    // rootCertificateRequest.certificateType = data.certificateType;
    // rootCertificateRequest.tenantId = '1';
    // rootCertificateRequest.fileId = certificate.certificateFileId!;

    // try {
    //   const isDataUrl = true;
    //   const client = new BaseRestClient(isDataUrl);
    //   await client.put(
    //     `/certificates/rootCertificate`,
    //     InstallCertificateResponse,
    //     {},
    //     rootCertificateRequest,
    //   );

    try {
      const pemString = formatPem(data.certificate);
      if (pemString == null) {
        throw new Error('Incorrectly formatted PEM');
      }
      data.certificate = pemString;
      const client = new BaseRestClient();
      await client.post(
        `/certificates/installCertificate?identifier=${station.id}&tenantId=1`,
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
        dtoClass={InstallCertificateData}
        onFinish={handleSubmit}
        parentRecord={installCertificateData}
        initialValues={installCertificateData}
      />
    </>
  );
};
