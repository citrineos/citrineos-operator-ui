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
import { showError, showSucces } from '../util';
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
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { MessageConfirmation } from '../MessageConfirmation';

enum InstallCertificateDataProps {
  certificate = 'certificate',
  certificateType = 'certificateType',
}

/*
* Returns null if not pem format
*/
function formatPem(pem: string): string | null {
  // Define PEM header and footer
  const header = "-----BEGIN CERTIFICATE-----";
  const footer = "-----END CERTIFICATE-----";

  // Trim whitespace from the entire string
  let trimmedPem = pem.trim();

  // Check if the string contains valid header and footer
  if (!trimmedPem.startsWith(header) || !trimmedPem.endsWith(footer)) {
    return null; // Invalid PEM format
  }

  // Extract content between the header and footer
  const base64Content = trimmedPem.slice(header.length, trimmedPem.length - footer.length).replace(/\s+/g, "");

  // Validate the base64 content length
  if (base64Content.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64Content)) {
    return null; // Not a valid base64 string
  }

  // Split the content into 64-character lines
  const formattedContent = base64Content.match(/.{1,64}/g)?.join("\n");

  // Reassemble the PEM with correct newlines
  const formattedPem = `${header}\n${formattedContent}\n${footer}`;

  return formattedPem;
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
    //   const client = new BaseRestClient();
    //   client.setDataBaseUrl();
    //   await client.put(
    //     `/certificates/rootCertificate`,
    //     InstallCertificateResponse,
    //     {},
    //     rootCertificateRequest,
    //   );
        
    try {
      const pemString = formatPem(data.certificate);
      if (pemString == null) {
        throw new Error("Incorrectly formatted PEM");
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
