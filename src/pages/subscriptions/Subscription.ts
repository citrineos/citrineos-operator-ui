// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class Subscription {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsBoolean()
  @IsOptional()
  onConnect?: boolean;

  @IsBoolean()
  @IsOptional()
  onClose?: boolean;

  @IsBoolean()
  @IsOptional()
  onMessage?: boolean;

  @IsBoolean()
  @IsOptional()
  sentMessage?: boolean;

  @IsString()
  @IsOptional()
  messageRegexFilter?: string;

  @IsString()
  url!: string;

  constructor(data: Subscription) {
    if (data) {
      this.id = data.id;
      this.stationId = data.stationId;
      this.onConnect = data.onConnect;
      this.onClose = data.onClose;
      this.onMessage = data.onMessage;
      this.sentMessage = data.sentMessage;
      this.messageRegexFilter = data.messageRegexFilter;
      this.url = data.url;
    }
  }
}
