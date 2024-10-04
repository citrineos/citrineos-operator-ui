import { ChargingStation } from '../remote-stop/ChargingStation';
import React, { useState } from 'react';
import { Button, Form, Upload, UploadFile } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import {
  CertificateSignedStatusEnumType,
  CertificateSigningUseEnumType,
} from '@citrineos/base';
import { triggerMessageAndHandleResponse } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { getSchemaForInstanceAndKey, renderField } from '../../components/form';
import { FieldPath } from '../../components/form/state/fieldpath';
import { UploadOutlined } from '@ant-design/icons';

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

  @Type(() => File)
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
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile | null>(null);

  const handleSubmit = async () => {
    try {
      const plainValues = await form.validateFields();
      const fileContent = await readFileContent(file);

      console.log('Enum value:', plainValues.certificateType);
      console.log('File content:', fileContent);

      const payload = {
        certificateType: plainValues.certificateType,
        certificateChain: fileContent,
      };

      await triggerMessageAndHandleResponse(
        `/certificates/certificateSigned?identifier=${station.id}&tenantId=1`,
        CertificateSignedResponse,
        payload,
        (response: CertificateSignedResponse) =>
          response &&
          response.status &&
          response.status === CertificateSignedStatusEnumType.Accepted,
      );
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  const handleFileChange = (info: any) => {
    const uploadedFile = info.fileList[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    } else {
      setFile(null);
    }
  };

  const readFileContent = (file: UploadFile | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return resolve('');
      }

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
      fileReader.onerror = (error) => reject(error);

      fileReader.readAsText(file.originFileObj as Blob);
    });
  };

  const instance = plainToInstance(CertificateSignedRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    CertificateSignedRequestProps.certificateType,
    [CertificateSignedRequestProps.certificateType],
  );

  const enumField = renderField({
    schema: fieldSchema,
    preFieldPath: FieldPath.empty(),
    disabled: false,
  });

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {enumField}
      <Form.Item
        label={CertificateSignedRequestProps.certificate}
        name={CertificateSignedRequestProps.certificate}
        rules={[{ required: true, message: 'Please upload a certificate!' }]}
      >
        <Upload
          name={'file'}
          maxCount={1}
          accept=".pem,.id"
          onChange={handleFileChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Certificate Signed
        </Button>
      </Form.Item>
    </Form>
  );
};
