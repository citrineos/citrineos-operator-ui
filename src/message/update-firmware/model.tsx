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

  // @IsOptional()
  // @SupportedFileFormats(['.pem', '.id'])
  // @Type(() => File)
  // signingCertificate?: File;

  @IsString()
  @Length(0, 5500)
  @IsOptional()
  signingCertificate?: string;

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
