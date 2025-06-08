// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Type } from 'class-transformer';
import { CustomDataType } from './CustomData';
import { IdToken, IdTokenProps } from '../pages/id-tokens/id-token';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { ADDITIONAL_INFOS_RELATED_IDTOKENS } from '../queries/additionalInfo';
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

const ID_TOKEN_FIELD = 'idToken';

export interface GetCustomerProps {
  station: ChargingStation;
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
    parentIdFieldName: ID_TOKEN_FIELD,
    associatedIdFieldName: IdTokenProps.id,
    gqlQuery: {
      query: ADDITIONAL_INFOS_RELATED_IDTOKENS,
    },
    gqlListQuery: {
      query: ADDITIONAL_INFOS_RELATED_IDTOKENS,
    },
  })
  @Type(() => IdToken)
  @IsOptional()
  idToken?: IdToken | null;

  @IsString()
  @MinLength(1)
  @IsOptional()
  customerIdentifier?: string;
}

export enum GetCustomerInformationDataProps {
  idToken = 'idToken',
  customData = 'customData',
  requestId = 'requestId',
  report = 'report',
  clear = 'clear',
  customerIdentifier = 'customerIdentifier',
}

export const CustomerPayload = (plainValues: Record<string, any>) => {
  const {
    idToken,
    report,
    clear,
    customData,
    customerCertificate,
    customerIdentifier,
  } = plainValues;

  let finalIdToken = null;
  if (idToken) {
    finalIdToken = {
      idToken: idToken.idToken,
      type: idToken.type,
      customData: idToken.customData,
    };
    if (
      idToken.IdTokenAdditionalInfos &&
      idToken.IdTokenAdditionalInfos.length > 0
    ) {
      (finalIdToken as any).additionalInfo =
        idToken.IdTokenAdditionalInfos?.map(
          ({ AdditionalInfo: info }: any) => ({
            additionalIdToken: info.additionalIdToken,
            type: info.type,
            customData: info.customData,
          }),
        );
    }
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
