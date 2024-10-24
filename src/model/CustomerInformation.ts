import { Type } from 'class-transformer';
import { CustomDataType } from './CustomData';
import { IdTokenProps, IdToken } from '../pages/id-tokens/IdToken';
import { GqlAssociation } from '../util/decorators/GqlAssociation';
import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { ADDITIONAL_INFOS_RELATED_IDTOKENS } from '../queries/additionalInfo';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsBoolean,
  MinLength,
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
  customData: CustomDataType | null = null;

  @GqlAssociation({
    parentIdFieldName: ID_TOKEN_FIELD,
    associatedIdFieldName: IdTokenProps.id,
    gqlQuery: ADDITIONAL_INFOS_RELATED_IDTOKENS,
    gqlListQuery: ADDITIONAL_INFOS_RELATED_IDTOKENS,
  })
  @Type(() => IdToken)
  @IsNotEmpty()
  idToken!: IdToken | null;

  @IsString()
  @MinLength(1)
  customerIdentifier!: string;
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

  return {
    requestId: plainValues.requestId,
    report: report ?? false,
    clear: clear ?? false,
    customData: customData,
    customerCertificate: customerCertificate,
    idToken: idToken
      ? {
          idToken: idToken.idToken,
          type: idToken.type,
          customData: idToken.customData,
          additionalInfo:
            idToken.IdTokenAdditionalInfos?.map(
              ({ AdditionalInfo: info }: any) => ({
                additionalIdToken: info.additionalIdToken,
                type: info.type,
                customData: info.customData,
              }),
            ) || [],
        }
      : null,
    customerIdentifier,
  };
};
