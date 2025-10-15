// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Type } from 'class-transformer';
import { CustomDataType } from '../../../model/CustomData';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AuthorizationDtoProps, IAuthorizationDto } from '@citrineos/base';
import { Authorization } from '../../../pages/authorizations/authorizations';
import {
  AUTHORIZATIONS_LIST_QUERY,
  AUTHORIZATIONS_SHOW_QUERY,
} from '../../../pages/authorizations/queries';

export interface GetCustomerProps {
  station: ChargingStation;
}

export enum GetCustomerInformationDataProps {
  authorization = 'authorization',
  customData = 'customData',
  requestId = 'requestId',
  report = 'report',
  clear = 'clear',
  customerIdentifier = 'customerIdentifier',
}

export class CustomerInformationRequest {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  requestId!: number;

  @IsBoolean()
  report!: boolean;

  @IsBoolean()
  clear!: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @GqlAssociation({
    parentIdFieldName: GetCustomerInformationDataProps.authorization,
    associatedIdFieldName: AuthorizationDtoProps.id,
    gqlQuery: {
      query: AUTHORIZATIONS_SHOW_QUERY,
    },
    gqlListQuery: {
      query: AUTHORIZATIONS_LIST_QUERY,
    },
  })
  @Type(() => Authorization)
  @IsOptional()
  authorization?: Authorization | null;

  @IsString()
  @MinLength(1)
  @IsOptional()
  customerIdentifier?: string;
}

export const CustomerPayload = (plainValues: Record<string, any>) => {
  const {
    authorization,
    report,
    clear,
    customData,
    customerCertificate,
    customerIdentifier,
  } = plainValues;

  let finalIdToken = null;
  if (authorization) {
    finalIdToken = {
      idToken: (authorization as IAuthorizationDto).idToken,
      type: (authorization as IAuthorizationDto).idTokenType,
      additionalInfo: (authorization as IAuthorizationDto).additionalInfo,
    };
  }
  const payload: any = {
    requestId: plainValues.requestId,
    report: report ?? false,
    clear: clear ?? false,
    customData: customData,
    customerCertificate: customerCertificate,
    customerIdentifier,
  };

  if (finalIdToken) {
    payload.idToken = finalIdToken;
  }

  return payload;
};
