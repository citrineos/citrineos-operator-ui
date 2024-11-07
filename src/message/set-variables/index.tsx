import React from 'react';
import { Form } from 'antd';
import {
  Variable,
  VariableProps,
} from '../../pages/evses/variable-attributes/variables/Variable';
import {
  VARIABLE_LIST_BY_COMPONENT_QUERY,
  VARIABLE_LIST_QUERY,
} from '../../pages/evses/variable-attributes/variables/queries';
import {
  Component,
  ComponentProps,
} from '../../pages/evses/variable-attributes/components/Component';
import { COMPONENT_LIST_QUERY } from '../../pages/evses/variable-attributes/components/queries';
import { plainToInstance, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MessageConfirmation } from '../MessageConfirmation';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { AttributeEnumType } from '@citrineos/base';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { triggerMessageAndHandleResponse } from '../util';
import { GenericForm } from '../../components/form';
import { ClassCustomConstructor } from '../../util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '../../util/consts';
import { HiddenWhen } from '../../util/decorators/HiddenWhen';

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

  const handleSubmit = async (plainValues: Partial<SetVariablesRequest>) => {
    const plainList = plainValues[SetVariablesRequestProps.setVariableData];
    if (plainList) {
      const list: SetVariablesData[] = plainList.map((item: SetVariablesData) =>
        plainToInstance(SetVariablesData, item),
      );
      const data = list.map(
        (item: SetVariablesData) =>
          ({
            attributeValue: item.value,
            component: {
              name: item[SetVariablesDataProps.component][ComponentProps.name],
            },
            variable: {
              name: item[SetVariablesDataProps.variable][VariableProps.name],
            },
            attributeType: item[SetVariablesDataProps.attributeType],
          }) as any,
      );
      const payload = { setVariableData: data };
      await triggerMessageAndHandleResponse({
        url: `/monitoring/setVariables?identifier=${station.id}&tenantId=1`,
        responseClass: MessageConfirmation,
        data: payload,
        responseSuccessCheck: (response: MessageConfirmation) =>
          response && response.success,
      });
    }
  };

  const setVariablesRequest = new SetVariablesRequest();
  setVariablesRequest[SetVariablesRequestProps.setVariableData] = [
    SetVariablesRequestCustomConstructor(),
  ];

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
