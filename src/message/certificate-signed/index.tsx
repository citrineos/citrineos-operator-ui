import React, { useRef } from 'react';
import { Form } from 'antd';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  CertificateSignedStatusEnumType,
  CertificateSigningUseEnumType,
} from '@citrineos/base';
import { readFileContent, triggerMessageAndHandleResponse } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { GenericForm } from '../../components/form';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { SupportedFileFormats } from '@util/decorators/SupportedFileFormats';

// enum CertificateSignedRequestProps {
//   certificateType = 'certificateType',
//   certificate = 'certificate',
// }

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

export class CertificateSignedResponse {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(CertificateSignedStatusEnumType)
  status!: CertificateSignedStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export interface CertificateSignedProps {
  station: ChargingStation;
}

export const CertificateSigned: React.FC<CertificateSignedProps> = ({
  station,
}) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = { form };

  const certificateSignedRequest = new CertificateSignedRequest();

  const handleSubmit = async (values: Partial<CertificateSignedRequest>) => {
    try {
      const fileContent = await readFileContent(values.certificate!);

      const payload = {
        certificateType: values.certificateType,
        certificateChain: fileContent,
      };

      await triggerMessageAndHandleResponse({
        url: `/certificates/certificateSigned?identifier=${station.id}&tenantId=1`,
        responseClass: CertificateSignedResponse,
        data: payload,
        responseSuccessCheck: (response: CertificateSignedResponse) =>
          response &&
          response.status &&
          response.status === CertificateSignedStatusEnumType.Accepted,
      });
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };
  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={CertificateSignedRequest}
      formProps={formProps}
      onFinish={handleSubmit}
      initialValues={certificateSignedRequest}
      parentRecord={certificateSignedRequest}
    />
  );
};
