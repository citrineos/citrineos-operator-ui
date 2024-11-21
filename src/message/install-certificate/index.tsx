import React, { useState } from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HttpMethod, InstallCertificateUseEnumType } from '@citrineos/base';
import { triggerMessageAndHandleResponse } from '../util';
import { GenericForm } from '../../components/form';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { MessageConfirmation } from '../MessageConfirmation';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  Certificate,
  CertificateProps,
} from '../../pages/certificates/Certificate';
import { CERTIFICATES_LIST_QUERY } from '../../pages/certificates/queries';
import { NEW_IDENTIFIER } from '@util/consts';

enum InstallCertificateDataProps {
  certificate = 'certificate',
  certificateType = 'certificateType',
}

class InstallCertificateData {
  @GqlAssociation({
    parentIdFieldName: InstallCertificateDataProps.certificate,
    associatedIdFieldName: CertificateProps.id,
    gqlListQuery: {
      query: CERTIFICATES_LIST_QUERY,
    },
  })
  @Type(() => Certificate)
  @IsNotEmpty()
  certificate!: Certificate | null;

  @IsEnum(InstallCertificateUseEnumType)
  certificateType!: InstallCertificateUseEnumType;
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
  installCertificate[CertificateProps.id] = NEW_IDENTIFIER as unknown as number;
  installCertificateData[InstallCertificateDataProps.certificate] =
    installCertificate;

  const [_parentRecord, _setParentRecord] = useState<any>(
    installCertificateData,
  );

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: InstallCertificateData = plainToInstance(
      InstallCertificateData,
      plainValues,
    );
    const certificate: Certificate =
      data[InstallCertificateDataProps.certificate]!;
    const rootCertificateRequest = new RootCertificateRequest();
    rootCertificateRequest.stationId = station.id;
    rootCertificateRequest.certificateType = data.certificateType;
    rootCertificateRequest.tenantId = '1';
    rootCertificateRequest.fileId = certificate.certificateFileId!;

    await triggerMessageAndHandleResponse({
      url: `/certificates/rootCertificate?identifier=${station.id}&tenantId=1`,
      method: HttpMethod.Put,
      isDataUrl: true,
      responseClass: MessageConfirmation,
      responseSuccessCheck: (response: MessageConfirmation) => response.success,
      data: rootCertificateRequest,
    });
  };

  return (
    <>
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
