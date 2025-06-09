// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Tariffs } from '../../graphql/schema.types';
import { BaseModel } from '@util/BaseModel';

export enum Currency {
  USD = 'USD',
}

export class Tariff extends BaseModel {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsEnum(Currency)
  currency!: Currency;

  @IsNumber()
  pricePerKwh!: number;

  @IsOptional()
  @IsNumber()
  pricePerMin?: number | null;

  @IsOptional()
  @IsNumber()
  pricePerSession?: number | null;

  @IsOptional()
  @IsNumber()
  authorizationAmount?: number | null;

  @IsOptional()
  @IsNumber()
  paymentFee?: number | null;

  @IsOptional()
  @IsNumber()
  taxRate?: number | null;

  constructor(data: Tariffs) {
    super();
    if (data) {
      this.id = data.id;
      // this.stationId = data.stationId;  todo?
      this.currency = data.currency;
      this.pricePerKwh = data.pricePerKwh;
      this.pricePerMin = data.pricePerMin;
      this.pricePerSession = data.pricePerSession;
      this.authorizationAmount = data.authorizationAmount;
      this.paymentFee = data.paymentFee;
      this.taxRate = data.taxRate;
    }
  }
}
