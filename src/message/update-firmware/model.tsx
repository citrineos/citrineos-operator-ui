import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Form, Input } from 'antd';
import { CustomFormRender } from '../../util/decorators/CustomFormRender';
import { TransformDate } from '../../util/TransformDate';
import { CombinedFormRender } from '../../util/decorators/CombinedFormRender';

export enum FirmwareTypeProps {
  location = 'location',
  retrieveDateTime = 'retrieveDateTime',
  installDateTime = 'installDateTime',
  signingCertificate = 'signingCertificate',
  signature = 'signature',
}

export class FirmwareType {
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  @Length(0, 512)
  @CustomFormRender(() => {
    return (
      <Form.Item
        label={'Location'}
        name={[UpdateFirmwareRequestProps.firmware, FirmwareTypeProps.location]}
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please enter a valid URL.',
            type: 'url',
          },
        ]}
      >
        <Input />
      </Form.Item>
    );
  })
  location!: string;

  @TransformDate()
  @IsNotEmpty()
  retrieveDateTime!: Date;

  @TransformDate()
  @IsOptional()
  installDateTime?: Date;

  @IsOptional()
  @Type(() => File)
  @CombinedFormRender([
    {
      type: 'boolean',
      info: 'Enter Text or Upload File',
      checkedText: 'Enter Certificate Text',
      uncheckedText: 'Upload Certificate File',
    },
    {
      type: 'string',
      minLength: 0,
      maxLength: 5500,
      label: 'Signing Certificate',
      info: 'Input certificate Text',
    },
    {
      type: 'file',
      label: 'Signing Certificate',
      info: 'Upload certificate File',
      supportedFileFormats: ['.pem', '.id'],
    },
  ])
  signingCertificate?: string | File;

  @IsString()
  @Length(0, 800)
  @IsOptional()
  signature?: string;
}

export enum UpdateFirmwareRequestProps {
  retries = 'retries',
  retryInterval = 'retryInterval',
  requestId = 'requestId',
  firmware = 'firmware',
}

export class UpdateFirmwareRequest {
  @IsInt()
  @Min(0)
  @IsOptional()
  retries?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  retryInterval?: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  requestId!: number;

  @Type(() => FirmwareType)
  @ValidateNested()
  @IsNotEmpty()
  firmware!: FirmwareType;
}
