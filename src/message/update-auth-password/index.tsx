import { plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { GenericForm } from '../../components/form';
import { Form } from 'antd';
import { useSelectedChargingStationIds } from '@hooks';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

enum UpdateAuthPasswordRequestProps {
  password = 'password',
  stationId = 'stationId',
  setOnCharger = 'setOnCharger',
}

export class UpdateAuthPasswordRequest {
  @IsNotEmpty()
  password!: string | null;

  @IsNotEmpty()
  setOnCharger!: boolean | null;
}

export const UpdateAuthPassword: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = { form };
  const stationIds = useSelectedChargingStationIds();
  const updateAuthPasswordRequest = new UpdateAuthPasswordRequest();

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      UpdateAuthPasswordRequest,
      plainValues,
    );

    let data: any;

    if (
      classInstance &&
      classInstance[UpdateAuthPasswordRequestProps.password] &&
      classInstance[UpdateAuthPasswordRequestProps.setOnCharger]
    ) {
      data = {
        password: classInstance[UpdateAuthPasswordRequestProps.password],
        setOnCharger:
          classInstance[UpdateAuthPasswordRequestProps.setOnCharger],
        stationId: stationIds,
      };
    }
    await triggerMessageAndHandleResponse({
      url: `/configuration/password`,
      responseClass: MessageConfirmation,
      isDataUrl: true,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={UpdateAuthPasswordRequest}
      parentRecord={updateAuthPasswordRequest}
      initialValues={updateAuthPasswordRequest}
    />
  );
};
