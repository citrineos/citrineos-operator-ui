// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttributeEnumType } from '@OCPP2_0_1';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '@util/consts';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  Variable,
  VariableProps,
} from '../../../pages/variable-attributes/variables/Variable';
import {
  Component,
  ComponentProps,
} from '../../../pages/variable-attributes/components/Component';
import { COMPONENT_LIST_QUERY } from '../../../pages/variable-attributes/components/queries';
import {
  VARIABLE_LIST_BY_COMPONENT_QUERY,
  VARIABLE_LIST_QUERY,
} from '../../../pages/variable-attributes/variables/queries';

enum SetVariablesDataProps {
  component = 'component',
  variable = 'variable',
  value = 'value',
  attributeType = 'attributeType',
}

const SetVariablesRequestCustomConstructor = () => {
  const variable = new Variable();
  const component = new Component();
  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;
  const setVariablesData = new SetVariablesData();
  setVariablesData[SetVariablesDataProps.component] = component;
  setVariablesData[SetVariablesDataProps.variable] = variable;
  return setVariablesData;
};

@ClassCustomConstructor(SetVariablesRequestCustomConstructor)
class SetVariablesData {
  @GqlAssociation({
    parentIdFieldName: SetVariablesDataProps.component,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: {
      query: COMPONENT_LIST_QUERY,
    },
    gqlListQuery: {
      query: COMPONENT_LIST_QUERY,
    },
  })
  @Type(() => Component)
  @IsNotEmpty()
  component!: Component;

  @GqlAssociation({
    parentIdFieldName: SetVariablesDataProps.variable,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_LIST_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_LIST_BY_COMPONENT_QUERY,
      getQueryVariables: (record: SetVariablesData) => {
        return {
          mutability: 'ReadOnly',
          componentId: record.component?.id,
        };
      },
    },
  })
  @HiddenWhen((parentRecord: SetVariablesData) => {
    return (
      parentRecord[SetVariablesDataProps.component] &&
      (parentRecord[SetVariablesDataProps.component][
        ComponentProps.id
      ] as any) === NEW_IDENTIFIER
    );
  })
  @Type(() => Variable)
  @IsNotEmpty()
  variable!: Variable;

  @IsString()
  value!: string;

  @IsEnum(AttributeEnumType)
  attributeType!: AttributeEnumType;
}

enum SetVariablesRequestProps {
  setVariableData = 'setVariableData',
}

class SetVariablesRequest {
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetVariablesData)
  @IsNotEmpty()
  setVariableData!: SetVariablesData[];
}

export interface SetVariablesProps {
  station: ChargingStation;
}

export const SetVariables: React.FC<SetVariablesProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const setVariablesRequest = new SetVariablesRequest();
  setVariablesRequest[SetVariablesRequestProps.setVariableData] = [
    SetVariablesRequestCustomConstructor(),
  ];

  const handleSubmit = async (request: SetVariablesRequest) => {
    const list = request[SetVariablesRequestProps.setVariableData];

    if (list) {
      const data = list.map((item: SetVariablesData) => ({
        attributeValue: item.value,
        component: {
          name: item[SetVariablesDataProps.component][ComponentProps.name],
        },
        variable: {
          name: item[SetVariablesDataProps.variable][VariableProps.name],
        },
        attributeType: item[SetVariablesDataProps.attributeType],
      }));

      const payload = { setVariableData: data };

      await triggerMessageAndHandleResponse<MessageConfirmation[]>({
        url: `/monitoring/setVariables?identifier=${station.id}&tenantId=1`,
        data: payload,
        ocppVersion: OCPPVersion.OCPP2_0_1,
      });
    }
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={SetVariablesRequest}
      onFinish={handleSubmit}
      parentRecord={setVariablesRequest}
      initialValues={setVariablesRequest}
    />
  );
};
