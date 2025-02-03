import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OCPP2_0_1 } from '@citrineos/base';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { Form, Select } from 'antd';
import React from 'react';

export class GetInstalledCertificateIdsRequest {
  @IsOptional()
  @IsEnum(OCPP2_0_1.GetCertificateIdUseEnumType, { each: true })
  @CustomFormRender(() => {
    return (
      <Form.Item
        label="Certificate Types"
        extra="When omitted, all certificate types are requested."
        name="certificateType"
      >
        <Select mode="multiple">
          {Object.entries(OCPP2_0_1.GetCertificateIdUseEnumType)?.map(
            ([key, value]) => (
              <Select.Option key={key} value={value}>
                {value}
              </Select.Option>
            ),
          )}
        </Select>
      </Form.Item>
    );
  })
  certificateType?: OCPP2_0_1.GetCertificateIdUseEnumType[] | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;
}
