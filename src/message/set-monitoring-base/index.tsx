import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { ChargingStation } from 'src/pages/charging-stations/ChargingStation';
import { OCPP2_0_1 } from '@citrineos/base';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

export interface SetMonitoringBaseProps {
  station: ChargingStation;
}

enum SetMonitoringBaseRequestProps {
  monitoringBase = 'monitoringBase',
}

export class SetMonitoringBaseRequest {
  @IsEnum(OCPP2_0_1.MonitoringBaseEnumType)
  @IsNotEmpty()
  monitoringBase!: OCPP2_0_1.MonitoringBaseEnumType;
}

export const SetMonitoringBase: React.FC<SetMonitoringBaseProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const setMonitoringBaseRequest = new SetMonitoringBaseRequest();

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      SetMonitoringBaseRequest,
      plainValues,
    );

    let data: any = {};

    if (
      classInstance &&
      classInstance[SetMonitoringBaseRequestProps.monitoringBase]
    ) {
      data = {
        monitoringBase:
          classInstance[SetMonitoringBaseRequestProps.monitoringBase],
      };
    }

    await triggerMessageAndHandleResponse({
      url: `/monitoring/setMonitoringBase?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={SetMonitoringBaseRequest}
      onFinish={handleSubmit}
      initialValues={setMonitoringBaseRequest}
      parentRecord={setMonitoringBaseRequest}
    />
  );
};
