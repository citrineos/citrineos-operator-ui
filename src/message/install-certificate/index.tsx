import { ChargingStation } from '../remote-stop/ChargingStation';
import React, { useState } from 'react';
import { Button, Form, Upload, UploadFile } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  InstallCertificateStatusEnumType,
  InstallCertificateUseEnumType,
} from '@citrineos/base';
import { triggerMessageAndHandleResponse } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { getSchemaForInstanceAndKey, renderField } from '../../components/form';
import { FieldPath } from '../../components/form/state/fieldpath';
import { UploadOutlined } from '@ant-design/icons';

enum InstallCertificateRequestProps {
  certificateType = 'certificateType',
  certificate = 'certificate',
}

class InstallCertificateRequest {
  @IsEnum(InstallCertificateUseEnumType)
  @IsNotEmpty()
  certificateType!: InstallCertificateUseEnumType;

  @Type(() => File)
  certificate!: File;
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
  const [file, setFile] = useState<UploadFile | null>(null);

  const handleSubmit = async () => {
    try {
      const plainValues = await form.validateFields();
      const fileContent = await readFileContent(file);
      const payload = {
        certificateType: plainValues.certificateType,
        certificate: fileContent,
      };

      await triggerMessageAndHandleResponse(
        `/certificates/installCertificate?identifier=${station.id}&tenantId=1`,
        InstallCertificateResponse,
        payload,
        (response: InstallCertificateResponse) =>
          response &&
          response.status &&
          response.status === InstallCertificateStatusEnumType.Accepted,
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

  const instance = plainToInstance(InstallCertificateRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    InstallCertificateRequestProps.certificateType,
    [InstallCertificateRequestProps.certificateType],
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
        label={InstallCertificateRequestProps.certificate}
        name={InstallCertificateRequestProps.certificate}
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
          Set Variables
        </Button>
      </Form.Item>
    </Form>
  );
};
