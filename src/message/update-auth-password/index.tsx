import { plainToInstance } from 'class-transformer';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { IsNotEmpty } from 'class-validator';
import { GenericForm } from '../../components/form';
import { Form } from 'antd';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

export interface UpdateAuthPasswordProps {
  station: ChargingStation;
}

enum UpdateAuthPasswordRequestProps {
  password = 'password',
  setOnCharger = 'setOnCharger',
  stationId = 'stationId',
}

export class UpdateAuthPasswordRequest {
  @IsNotEmpty()
  password!: string | null;

  @IsNotEmpty()
  setOnCharger!: boolean | null;
}

export const UpdateAuthPassword: React.FC<UpdateAuthPasswordProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

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
        stationId: station.id,
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
      dtoClass={UpdateAuthPasswordRequest}
      onFinish={handleSubmit}
      initialValues={updateAuthPasswordRequest}
      parentRecord={updateAuthPasswordRequest}
      gqlQueryVariablesMap={{}}
    />
  );
};
