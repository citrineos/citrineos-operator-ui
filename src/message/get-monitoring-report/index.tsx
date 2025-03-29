import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { ChargingStation } from 'src/pages/charging-stations/ChargingStation';
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { OCPP2_0_1 } from '@citrineos/base';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  Component,
  ComponentProps,
} from '../../pages/variable-attributes/components/Component';
import {
  Variable,
  VariableProps,
} from '../../pages/variable-attributes/variables/Variable';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  VARIABLE_LIST_BY_COMPONENT_QUERY,
  VARIABLE_LIST_QUERY,
} from '../../pages/variable-attributes/variables/queries';
import {
  COMPONENT_LIST_BY_VARIABLE_QUERY,
  COMPONENT_LIST_QUERY,
} from '../../pages/variable-attributes/components/queries';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

export interface GetMonitoringReportProps {
  station: ChargingStation;
}

enum GetMonitoringReportRequestProps {
  // customData = 'customData', // todo
  componentVariable = 'componentVariable',
  requestId = 'requestId',
  monitoringCriteria = 'monitoringCriteria',
}

enum ComponentVariableProps {
  component = 'component',
  variable = 'variable',
}

const ComponentVariableCustomConstructor = () => {
  const variable = new Variable();
  const component = new Component();
  variable[VariableProps.id] = NEW_IDENTIFIER as unknown as number;
  component[ComponentProps.id] = NEW_IDENTIFIER as unknown as number;
  const componentVariable = new ComponentVariable();
  componentVariable[ComponentVariableProps.component] = component;
  componentVariable[ComponentVariableProps.variable] = variable;
  return componentVariable;
};

@ClassCustomConstructor(ComponentVariableCustomConstructor)
export class ComponentVariable {
  @Type(() => Component)
  @IsNotEmpty()
  @GqlAssociation({
    parentIdFieldName: ComponentVariableProps.component,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: {
      query: COMPONENT_LIST_QUERY,
    },
    gqlListQuery: {
      query: (record: ComponentVariable) => {
        if (record.variable?.id != (NEW_IDENTIFIER as unknown as number)) {
          return COMPONENT_LIST_BY_VARIABLE_QUERY;
        } else {
          return COMPONENT_LIST_QUERY;
        }
      },
      getQueryVariables: (record: ComponentVariable) => {
        if (record.variable?.id != (NEW_IDENTIFIER as unknown as number)) {
          return {
            variableId: record.variable?.id,
          };
        } else {
          return {};
        }
      },
    },
  })
  component!: Component;

  @Type(() => Variable)
  @IsNotEmpty()
  @GqlAssociation({
    parentIdFieldName: ComponentVariableProps.variable,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_LIST_QUERY,
    },
    gqlListQuery: {
      query: (record: ComponentVariable) => {
        if (record.component?.id != (NEW_IDENTIFIER as unknown as number)) {
          return VARIABLE_LIST_BY_COMPONENT_QUERY;
        } else {
          return VARIABLE_LIST_QUERY;
        }
      },
      getQueryVariables: (record: ComponentVariable) => {
        if (record.component?.id != (NEW_IDENTIFIER as unknown as number)) {
          return {
            componentId: record.component?.id,
            mutability: 'ReadOnly',
          };
        } else {
          return {};
        }
      },
    },
  })
  variable!: Variable;
}

export class GetMonitoringReportRequest {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @Type(() => ComponentVariable)
  @IsNotEmpty()
  @IsArray()
  componentVariable!: ComponentVariable[] | null;

  @IsNotEmpty()
  @IsNumber()
  requestId!: number | null;

  @IsEnum(OCPP2_0_1.MonitoringCriterionEnumType)
  @IsNotEmpty()
  monitoringCriteria!: OCPP2_0_1.MonitoringCriterionEnumType;
}

export const GetMonitoringReport: React.FC<GetMonitoringReportProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getMonitoringReportRequest = new GetMonitoringReportRequest();
  getMonitoringReportRequest[
    GetMonitoringReportRequestProps.componentVariable
  ] = [ComponentVariableCustomConstructor()];

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      GetMonitoringReportRequest,
      plainValues,
    );

    let data: any = {};

    if (
      classInstance &&
      classInstance[GetMonitoringReportRequestProps.componentVariable]
    ) {
      data = {
        requestId: classInstance[GetMonitoringReportRequestProps.requestId],
        monitoringCriteria:
          classInstance[GetMonitoringReportRequestProps.monitoringCriteria],
        componentVariable:
          classInstance[GetMonitoringReportRequestProps.componentVariable],
      };
    }

    await triggerMessageAndHandleResponse({
      url: `/reporting/getMonitoringReport?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetMonitoringReportRequest}
      onFinish={handleSubmit}
      initialValues={getMonitoringReportRequest}
      parentRecord={getMonitoringReportRequest}
    />
  );
};
