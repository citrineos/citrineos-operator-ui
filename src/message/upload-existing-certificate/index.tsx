import React, { useState } from 'react';
import { Form } from 'antd';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { InstallCertificateUseEnumType } from '@citrineos/base';
import {
  formatPem,
  readFileContent,
  triggerMessageAndHandleResponse,
} from '../util';
import { GenericForm } from '../../components/form';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import { SupportedFileFormats } from '@util/decorators/SupportedFileFormats';
import { InstalledCertificate } from '../../pages/installed-certificates/InstalledCertificate';

enum UploadExistingCertificateDataProps {
  certificateIsFile = 'certificateIsFile',
  certificateText = 'certificateText',
  certificateFile = 'certificateFile',
  certificateType = 'certificateType',
}

class UploadExistingCertificateData {
  @IsBoolean()
  certificateIsFile?: boolean;

  @IsString()
  @Length(0, 5500)
  @HiddenWhen((record: UploadExistingCertificateData) => {
    return record.certificateIsFile === true;
  })
  certificateText?: string;

  @Type(() => File)
  @IsNotEmpty()
  @SupportedFileFormats(['.pem', '.id'])
  @HiddenWhen((record: UploadExistingCertificateData) => {
    return record.certificateIsFile !== true;
  })
  certificateFile?: File;

  @IsEnum(InstallCertificateUseEnumType)
  certificateType!: InstallCertificateUseEnumType;
}

export interface UploadExistingCertificateProps {
  station: ChargingStation;
}

export const UploadExistingCertificate: React.FC<
  UploadExistingCertificateProps
> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const uploadExistingCertificateData = new UploadExistingCertificateData();

  const [parentRecord, setParentRecord] = useState<any>(
    uploadExistingCertificateData,
  );

  const onValuesChange = (
    changedValues: UploadExistingCertificateData,
    allValues: UploadExistingCertificateData,
  ) => {
    if (
      changedValues !== undefined &&
      changedValues[UploadExistingCertificateDataProps.certificateIsFile] !==
        undefined
    ) {
      setParentRecord(allValues);
    }
  };

  const getCertificate = async (request: UploadExistingCertificateData) => {
    if (!request[UploadExistingCertificateDataProps.certificateIsFile]) {
      const pemString = formatPem(
        request[UploadExistingCertificateDataProps.certificateText]!,
      );
      if (!pemString) throw new Error('Incorrect PEM format');
      return pemString;
    }
    return await readFileContent(
      request[UploadExistingCertificateDataProps.certificateFile] ?? null,
    );
  };

  const handleSubmit = async () => {
    const data = await form.validateFields();
    const certificate = await getCertificate(data);
    await triggerMessageAndHandleResponse({
      url: `/certificates/uploadExistingCertificate?identifier=${station.id}&tenantId=1`,
      isDataUrl: true,
      responseClass: InstalledCertificate,
      responseSuccessCheck: (response: InstalledCertificate) => !!response,
      data: {
        certificate,
        certificateType:
          data[UploadExistingCertificateDataProps.certificateType],
      },
    });
  };

  return (
    <>
      <GenericForm
        formProps={formProps}
        dtoClass={UploadExistingCertificateData}
        onFinish={handleSubmit}
        parentRecord={parentRecord}
        initialValues={parentRecord}
        onValuesChange={onValuesChange}
      />
    </>
  );
};
