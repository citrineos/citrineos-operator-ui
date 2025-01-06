import { AttributeEnumType, GetVariableStatusEnumType } from '@citrineos/base';
import React, { useRef } from 'react';
import { Form } from 'antd';
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
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';

import { GqlAssociation } from '@util/decorators/GqlAssociation';

import { Evse } from '../../pages/evses/Evse';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { StatusInfoType } from '../model/StatusInfoType';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '@util/consts';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { EvseProps } from '../../pages/evses/EvseProps';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  Variable,
  VariableProps,
} from '../../pages/variable-attributes/variables/Variable';
import {
  Component,
  ComponentProps,
} from '../../pages/variable-attributes/components/Component';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from '../../pages/variable-attributes/components/queries';
import {
  VARIABLE_GET_QUERY,
  VARIABLE_LIST_BY_COMPONENT_QUERY,
} from '../../pages/variable-attributes/variables/queries';
import { useSelectedChargingStationIds } from '@hooks';

enum GetVariablesDataProps {
  evse = 'evse',
  variable = 'variable',
  component = 'component',
  attributeType = 'attributeType',
  variableInstance = 'variableInstance',
  componentInstance = 'componentInstance',
}

const GetVariablesDataCustomConstructor = () => {
  const evse = new Evse();
  const variable = new Variable();
  const component = new Component();
  const getVariablesData = new GetVariablesData();

  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;

  getVariablesData[GetVariablesDataProps.evse] = evse;
  getVariablesData[GetVariablesDataProps.variable] = variable;
  getVariablesData[GetVariablesDataProps.component] = component;
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
    associatedIdFieldName: ComponentProps.id,
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
    associatedIdFieldName: EvseProps.databaseId,
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

export const GetVariables: React.FC = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = { form };
  const getVariablesRequest = new GetVariablesRequest();
  const stationIds = useSelectedChargingStationIds('identifier=');

  getVariablesRequest[GetVariablesRequestProps.getVariableData] = [
    GetVariablesDataCustomConstructor(),
  ];

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(GetVariablesRequest, plainValues);
    const getVariablesRequest = {
      [GetVariablesRequestProps.getVariableData]: classInstance[
        GetVariablesRequestProps.getVariableData
      ].map((item: GetVariablesData) => {
        if (item && item[GetVariablesDataProps.evse]) {
          const evse: Evse = item[GetVariablesDataProps.evse]!;
          const variable: Variable = item[GetVariablesDataProps.variable]!;
          const component: Component = item[GetVariablesDataProps.component]!;

          let evsePayload: any = undefined;
          if (evse[EvseProps.databaseId]) {
            evsePayload = {
              id: evse[EvseProps.databaseId],
              // customData: null // todo
            };
          }

          if (evsePayload && evse[EvseProps.connectorId]) {
            evsePayload.connectorId = evse[EvseProps.connectorId];
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
    await triggerMessageAndHandleResponse({
      url: `/monitoring/getVariables?${stationIds}&tenantId=1`,
      responseClass: GetVariablesResponse,
      data: getVariablesRequest,
      responseSuccessCheck: (response: GetVariablesResponse) => !!response,
    });
  };

  return (
    <GenericForm
      ref={formRef as any}
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={GetVariablesRequest}
      initialValues={getVariablesRequest}
      parentRecord={getVariablesRequest}
    />
  );
};
