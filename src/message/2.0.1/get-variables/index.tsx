// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import {
  ConnectorDtoProps,
  EvseDtoProps,
  type IConnectorDto,
  type IEvseDto,
  OCPPVersion,
} from '@citrineos/base';
import { AttributeEnumType, GetVariableStatusEnumType } from '@OCPP2_0_1';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Evse } from '../../../pages/evses/Evse';
import {
  GET_CONNECTOR_LIST_FOR_STATION_EVSE,
  GET_EVSE_LIST_FOR_STATION,
} from '../../queries';
import { StatusInfoType } from '../model/StatusInfoType';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '@util/consts';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';

import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  Variable,
  VariableProps,
} from '../../../pages/variable-attributes/variables/Variable';
import {
  Component,
  ComponentProps,
} from '../../../pages/variable-attributes/components/Component';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from '../../../pages/variable-attributes/components/queries';
import {
  VARIABLE_GET_QUERY,
  VARIABLE_LIST_BY_COMPONENT_QUERY,
} from '../../../pages/variable-attributes/variables/queries';
import { Connector } from '../../../pages/connectors/connector';

enum GetVariablesDataProps {
  // customData = 'customData', // todo
  component = 'component',
  componentInstance = 'componentInstance',
  variable = 'variable',
  variableInstance = 'variableInstance',
  evse = 'evse',
  connector = 'connector',
  attributeType = 'attributeType',
}

const GetVariablesDataCustomConstructor = () => {
  const variable = new Variable();
  const component = new Component();
  const evse = new Evse();
  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;
  evse[EvseDtoProps.id] = NEW_IDENTIFIER as unknown as number;
  const getVariablesData = new GetVariablesData();
  getVariablesData[GetVariablesDataProps.component] = component;
  getVariablesData[GetVariablesDataProps.variable] = variable;
  getVariablesData[GetVariablesDataProps.evse] = evse;
  return getVariablesData;
};

@ClassCustomConstructor(GetVariablesDataCustomConstructor)
export class GetVariablesData {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.component,
    associatedIdFieldName: 'databaseId',
    gqlQuery: {
      query: COMPONENT_GET_QUERY,
    },
    gqlListQuery: {
      query: COMPONENT_LIST_QUERY,
    },
  })
  @Type(() => Component)
  @IsNotEmpty()
  component!: Component | null;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.variable,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_LIST_BY_COMPONENT_QUERY,
      getQueryVariables: (record: GetVariablesData) => {
        return {
          mutability: 'WriteOnly',
          componentId: record.component?.id,
        };
      },
    },
  })
  @Type(() => Variable)
  @HiddenWhen((record: GetVariablesData) => {
    return (
      !record[GetVariablesDataProps.component] ||
      (record[GetVariablesDataProps.component][ComponentProps.id] as any) ===
        NEW_IDENTIFIER
    );
  })
  @IsNotEmpty()
  variable!: Variable | null;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  variableInstance?: string;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  componentInstance?: string;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: GetVariablesData, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Evse)
  @IsOptional()
  evse?: Evse | null;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
      getQueryVariables: (formData: GetVariablesData, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        const selectedEvse = formData.evse;
        const hasValidEvse =
          selectedEvse &&
          selectedEvse.id &&
          (selectedEvse.id as any) !== NEW_IDENTIFIER;

        return {
          stationId: station.id,
          where: hasValidEvse ? { evseId: { _eq: selectedEvse.id } } : {},
        };
      },
    },
  })
  @Type(() => Connector)
  @ValidateNested()
  @IsOptional()
  connector?: IConnectorDto | null;

  @IsEnum(AttributeEnumType)
  @IsOptional()
  attributeType?: AttributeEnumType | null;
}

enum GetVariablesRequestProps {
  getVariableData = 'getVariableData',
}

export class GetVariablesRequest {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetVariablesData)
  @IsNotEmpty()
  getVariableData!: GetVariablesData[];
}

export class GetVariableResultType {
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  attributeStatusInfo?: StatusInfoType;

  @IsEnum(GetVariableStatusEnumType)
  @IsOptional()
  attributeStatus!: GetVariableStatusEnumType;

  @IsEnum(AttributeEnumType)
  @IsOptional()
  attributeType?: AttributeEnumType;

  @MaxLength(2500)
  @IsString()
  @IsOptional()
  attributeValue?: string;

  @Type(() => Component)
  @ValidateNested()
  @IsNotEmpty()
  component!: Component;

  @Type(() => Variable)
  @ValidateNested()
  @IsNotEmpty()
  variable!: Variable;
}

export class GetVariablesResponse {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetVariableResultType)
  @IsNotEmpty()
  getVariableResult!: GetVariableResultType[];
}

export interface GetVariablesProps {
  station: ChargingStation;
}

export const GetVariables: React.FC<GetVariablesProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getVariablesRequest = new GetVariablesRequest();
  getVariablesRequest[GetVariablesRequestProps.getVariableData] = [
    GetVariablesDataCustomConstructor(),
  ];

  const handleSubmit = async (request: GetVariablesRequest) => {
    const getVariablesRequest = {
      [GetVariablesRequestProps.getVariableData]: request[
        GetVariablesRequestProps.getVariableData
      ].map((item: GetVariablesData) => {
        if (item) {
          const component: Component = item[GetVariablesDataProps.component]!;
          const variable: Variable = item[GetVariablesDataProps.variable]!;
          const evse: Partial<IEvseDto> | null =
            item[GetVariablesDataProps.evse] || null;
          const connector: Partial<IConnectorDto> | null =
            item[GetVariablesDataProps.connector] || null;

          let evsePayload: any = undefined;
          // Only include EVSE if it has a valid ID (not the placeholder NEW_IDENTIFIER)
          if (
            evse &&
            evse[EvseDtoProps.id] &&
            evse[EvseDtoProps.id] !== (NEW_IDENTIFIER as any)
          ) {
            evsePayload = {
              id: evse[EvseDtoProps.id],
              // customData: null // todo
            };
            if (
              connector &&
              connector[ConnectorDtoProps.id] &&
              connector[ConnectorDtoProps.id] !== (NEW_IDENTIFIER as any)
            ) {
              evsePayload.connectorId = connector[ConnectorDtoProps.id];
            }
          }

          const data: any = {
            component: {
              name: component[ComponentProps.name],
              instance: item[GetVariablesDataProps.componentInstance],
              // customData: null // todo
            },
            variable: {
              name: variable[VariableProps.name],
              instance: item[GetVariablesDataProps.variableInstance],
              // customData: null // todo
            },
            attributeType: item[GetVariablesDataProps.attributeType],
            // customData: null // todo
          };
          if (evsePayload) {
            data.component.evse = evsePayload;
          }
          return data;
        } else {
          return null;
        }
      }),
      // customData: null // todo
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/monitoring/getVariables?identifier=${station.id}&tenantId=1`,
      data: getVariablesRequest,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetVariablesRequest}
      onFinish={handleSubmit}
      initialValues={getVariablesRequest}
      parentRecord={getVariablesRequest}
    />
  );
};
