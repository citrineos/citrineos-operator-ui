import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { ChargingStation } from 'src/pages/charging-stations/ChargingStation';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';
import { OCPP2_0_1 } from '@citrineos/base';
import {
  Component,
  ComponentProps,
} from '../../pages/variable-attributes/components/Component';
import {
  Variable,
  VariableProps,
} from '../../pages/variable-attributes/variables/Variable';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from '../../pages/variable-attributes/components/queries';
import {
  VARIABLE_GET_QUERY,
  VARIABLE_LIST_QUERY,
} from '../../pages/variable-attributes/variables/queries';
import { NEW_IDENTIFIER } from '@util/consts';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';

export interface SetVariableMonitoringProps {
  station: ChargingStation;
}

export enum SetMonitoringDataProps {
  id = 'id',
  transaction = 'transaction',
  value = 'value',
  type = 'type',
  severity = 'severity',
  component = 'component',
  variable = 'variable',
}

enum SetVariableMonitoringRequestProps {
  setMonitoringData = 'setMonitoringData',
}

const SetMonitoringDataCustomConstructor = () => {
  const variable = new Variable();
  const component = new Component();
  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;
  const setMonitoringData = new SetMonitoringData();
  setMonitoringData[SetMonitoringDataProps.component] = component;
  setMonitoringData[SetMonitoringDataProps.variable] = variable;
  return setMonitoringData;
};

@ClassCustomConstructor(SetMonitoringDataCustomConstructor)
export class SetMonitoringData {
  @IsNotEmpty()
  @IsNumber()
  id!: number | null;

  @IsBoolean()
  @IsNotEmpty()
  transaction!: boolean | null;

  @IsNotEmpty()
  @IsNumber()
  value!: number | null;

  @IsEnum(OCPP2_0_1.MonitorEnumType)
  @IsNotEmpty()
  type!: OCPP2_0_1.MonitorEnumType;

  @IsNotEmpty()
  @IsNumber()
  severity!: number | null;

  @Type(() => Component)
  @IsNotEmpty()
  @GqlAssociation({
    parentIdFieldName: SetMonitoringDataProps.component,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: {
      query: COMPONENT_GET_QUERY,
    },
    gqlListQuery: {
      query: COMPONENT_LIST_QUERY,
    },
  })
  component!: Component;

  @Type(() => Variable)
  @IsNotEmpty()
  @GqlAssociation({
    parentIdFieldName: SetMonitoringDataProps.variable,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_LIST_QUERY,
    },
  })
  variable!: Variable;
}

export class SetVariableMonitoringRequest {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetMonitoringData)
  setMonitoringData!: SetMonitoringData[];
}

export const SetVariableMonitoring: React.FC<SetVariableMonitoringProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const setVariableMonitoringRequest = new SetVariableMonitoringRequest();
  setVariableMonitoringRequest[
    SetVariableMonitoringRequestProps.setMonitoringData
  ] = [SetMonitoringDataCustomConstructor()];

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      SetVariableMonitoringRequest,
      plainValues,
    );

    let data: any = {};

    if (
      classInstance &&
      classInstance[SetVariableMonitoringRequestProps.setMonitoringData]
    ) {
      data = {
        setMonitoringData:
          classInstance[SetVariableMonitoringRequestProps.setMonitoringData],
      };
    }

    await triggerMessageAndHandleResponse({
      url: `/monitoring/setVariableMonitoring?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={SetVariableMonitoringRequest}
      onFinish={handleSubmit}
      initialValues={setVariableMonitoringRequest}
      parentRecord={setVariableMonitoringRequest}
    />
  );
};
