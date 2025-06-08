// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { GetCertificateIdUseEnumType } from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../../model/CustomData';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
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
