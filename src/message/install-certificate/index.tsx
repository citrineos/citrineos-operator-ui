import { ChargingStation } from '../remote-stop/ChargingStation';
import React, { useState } from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  InstallCertificateStatusEnumType,
  InstallCertificateUseEnumType,
} from '@citrineos/base';
import { showError, showSucces } from '../util';
import { ChangeAvailabilityResponse } from '../change-availability';
import { StatusInfoType } from '../model/StatusInfoType';
import { GenericForm } from '../../components/form';
import {
  Certificate,
  CertificateProps,
} from '../../pages/certificates/Certificate';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import {
  CERTIFICATES_GET_QUERY,
  CERTIFICATES_LIST_QUERY,
} from '../../pages/certificates/queries';
import { BaseRestClient } from '../../util/BaseRestClient';
import { NEW_IDENTIFIER } from '../../util/consts';

enum InstallCertificateDataProps {
  certificate = 'certificate',
  certificateType = 'certificateType',
}

class InstallCertificateData {
  @GqlAssociation({
    parentIdFieldName: InstallCertificateDataProps.certificate,
    associatedIdFieldName: CertificateProps.id,
    gqlQuery: CERTIFICATES_GET_QUERY,
    gqlListQuery: CERTIFICATES_LIST_QUERY,
  })
  @Type(() => Certificate)
  @IsNotEmpty()
  certificate!: Certificate | null;

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

  @IsEnum(InstallCertificateStatusEnumType)
  @IsNotEmpty()
  certificateType!: InstallCertificateStatusEnumType;

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
  const installCertificate = new Certificate();
  installCertificate[CertificateProps.id] = NEW_IDENTIFIER as number;
  installCertificateData[InstallCertificateDataProps.certificate] =
    installCertificate;

  const [parentRecord, setParentRecord] = useState<any>(installCertificateData);

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: InstallCertificateData = plainToInstance(
      InstallCertificateData,
      plainValues,
    );
    const certificate: Certificate =
      data[InstallCertificateDataProps.certificate];
    const rootCertificateRequest = new RootCertificateRequest();
    rootCertificateRequest.stationId = station.id;
    rootCertificateRequest.certificateType = data.certificateType;
    rootCertificateRequest.tenantId = '1';
    rootCertificateRequest.fileId = certificate.privateKeyFileId;
    debugger;
    try {
      const client = new BaseRestClient();
      client.setDataBaseUrl();
      const response = await client.put(
        `/certificates/rootCertificate`,
        ChangeAvailabilityResponse,
        {},
        rootCertificateRequest,
      );
      if (!!response) {
        showSucces();
      } else {
        let msg =
          'The install certificate request did not receive a successful response.';
        if ((response as any).payload) {
          msg += `Response payload: ${(response as any).payload}`;
        }
        showError(msg);
      }
    } catch (error: any) {
      showError(
        'The set variables request failed with message: ' + error.message,
      );
    }
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
