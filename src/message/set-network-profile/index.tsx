import { SetNetworkProfileStatusEnumType } from '@citrineos/base';
import React from 'react';
import { Form } from 'antd';
import { IsEnum, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { StatusInfoType } from '../model/StatusInfoType';
import { NetworkConnectionProfileType } from '../model/NetworkConnectionProfileType';

// enum SetNetworkProfileDataProps {}
// customData = 'customData', // todo

// export class SetNetworkProfileData {
// todo
// @Type(() => CustomDataType)
// @ValidateNested()
// customData?: CustomDataType;
// }

enum SetNetworkProfileRequestProps {
  // customData = 'customData', // todo
  configurationSlot = 'configurationSlot',
  connectionData = 'connectionData',
}

export class SetNetworkProfileRequest {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @IsInt()
  @IsNotEmpty()
  configurationSlot!: number;

  @Type(() => NetworkConnectionProfileType)
  @ValidateNested()
  @IsNotEmpty()
  connectionData!: NetworkConnectionProfileType;
}

export class SetNetworkProfileResponse {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  @IsEnum(SetNetworkProfileStatusEnumType)
  @IsNotEmpty()
  status!: SetNetworkProfileStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  statusInfo?: StatusInfoType;
}

export interface SetNetworkProfileProps {
  station: ChargingStation;
}

export const SetNetworkProfile: React.FC<SetNetworkProfileProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const setNetworkProfileRequest = new SetNetworkProfileRequest();
  setNetworkProfileRequest[SetNetworkProfileRequestProps.connectionData] =
    new NetworkConnectionProfileType();

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      SetNetworkProfileRequest,
      plainValues,
    );
    await triggerMessageAndHandleResponse(
      `/ocpp/provisioning/setNetworkProfile?identifier=${station.id}&tenantId=1`,
      SetNetworkProfileResponse,
      classInstance,
      (response: SetNetworkProfileResponse) =>
        !!response && !!response.status && response.status === 'Accepted',
    );
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={SetNetworkProfileRequest}
      onFinish={handleSubmit}
      initialValues={setNetworkProfileRequest}
      parentRecord={setNetworkProfileRequest}
    />
  );
};
