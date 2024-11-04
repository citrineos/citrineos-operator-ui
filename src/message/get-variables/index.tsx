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
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import {
  Variable,
  VariableProps,
} from '../../pages/evses/variable-attributes/variables/Variable';
import {
  Component,
  ComponentProps,
} from '../../pages/evses/variable-attributes/components/Component';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import {
  VARIABLE_GET_QUERY,
  VARIABLE_LIST_QUERY,
} from '../../pages/evses/variable-attributes/variables/queries';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from '../../pages/evses/variable-attributes/components/queries';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { StatusInfoType } from '../model/StatusInfoType';
import { ClassCustomConstructor } from '../../util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '../../util/consts';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

enum GetVariablesDataProps {
  // customData = 'customData', // todo
  component = 'component',
  componentInstance = 'componentInstance',
  variable = 'variable',
  variableInstance = 'variableInstance',
  evse = 'evse',
  attributeType = 'attributeType',
}

const GetVariablesDataCustomConstructor = () => {
  const variable = new Variable();
  const component = new Component();
  const evse = new Evse();
  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;
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
    parentIdFieldName: GetVariablesDataProps.variable,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: VARIABLE_GET_QUERY,
    gqlListQuery: VARIABLE_LIST_QUERY,
  })
  @Type(() => Variable)
  @IsNotEmpty()
  variable!: Variable | null;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  variableInstance?: string;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.component,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: COMPONENT_GET_QUERY,
    gqlListQuery: COMPONENT_LIST_QUERY,
  })
  @Type(() => Component)
  @IsNotEmpty()
  component!: Component | null;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  componentInstance?: string;

  @GqlAssociation({
    parentIdFieldName: GetVariablesDataProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: GET_EVSE_LIST_FOR_STATION,
    gqlListQuery: GET_EVSE_LIST_FOR_STATION,
    getGqlQueryVariables: (_: GetVariablesData, selector: any) => {
      const station = selector(getSelectedChargingStation()) || {};
      return {
        stationId: station.id,
      };
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

export interface GetVariablesProps {
  station: ChargingStation;
}

export const GetVariables: React.FC<GetVariablesProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getVariablesRequest = new GetVariablesRequest();
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
          const component: Component = item[GetVariablesDataProps.component]!;
          const variable: Variable = item[GetVariablesDataProps.variable]!;
          return {
            component: {
              name: component[ComponentProps.name],
              evse: evse[EvseProps.databaseId]
                ? {
                    id: evse[EvseProps.databaseId],
                    connectorId: evse[EvseProps.connectorId],
                    // customData: null // todo
                  }
                : undefined,
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
        } else {
          return null;
        }
      }),
      // customData: null // todo
    };
    await triggerMessageAndHandleResponse({
      url: `/monitoring/getVariables?identifier=${station.id}&tenantId=1`,
      responseClass: GetVariablesResponse,
      data: getVariablesRequest,
      responseSuccessCheck: (response: GetVariablesResponse) => !!response,
    });
  };

  return (
    <GenericForm
      ref={formRef as any}
      formProps={formProps}
      dtoClass={GetVariablesRequest}
      onFinish={handleSubmit}
      initialValues={getVariablesRequest}
      parentRecord={getVariablesRequest}
    />
  );
};
