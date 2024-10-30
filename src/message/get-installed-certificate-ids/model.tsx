import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { GetCertificateIdUseEnumType } from '@citrineos/base';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { CustomFormRender } from '../../util/decorators/CustomFormRender';
import { Form, Select } from 'antd';
import React from 'react';

export class GetInstalledCertificateIdsRequest {
  @IsOptional()
  @IsEnum(GetCertificateIdUseEnumType, { each: true })
  @CustomFormRender(() => {
    return (
      <Form.Item
        label="Certificate Types"
        extra="When omitted, all certificate types are requested."
        name="certificateType"
      >
        <Select mode="multiple">
          {Object.entries(GetCertificateIdUseEnumType)?.map(([key, value]) => (
            <Select.Option key={key} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  })
  certificateType?: GetCertificateIdUseEnumType[] | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;
}
