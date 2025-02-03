import { OCPP2_0_1 } from '@citrineos/base';
import React from 'react';
import { Form } from 'antd';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { GenericForm } from '../../components/form';
import { plainToInstance, Type } from 'class-transformer';
import { triggerMessageAndHandleResponse } from '../util';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { StatusInfoType } from '../model/StatusInfoType';
import { NetworkConnectionProfileType } from '../model/NetworkConnectionProfileType';
import { MessageConfirmation } from '../MessageConfirmation';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  ServerNetworkProfile,
  ServerNetworkProfileProps,
} from '../../pages/server-network-profiles/ServerNetworkProfile';
import {
  SERVER_NETWORK_PROFILE_GET_QUERY,
  SERVER_NETWORK_PROFILE_LIST_QUERY,
} from '../../pages/server-network-profiles/queries';
import { NEW_IDENTIFIER } from '@util/consts';

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

  @IsEnum(OCPP2_0_1.SetNetworkProfileStatusEnumType)
  @IsNotEmpty()
  status!: OCPP2_0_1.SetNetworkProfileStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  statusInfo?: StatusInfoType;
}

export enum SetNetworkProfileDataProps {
  websocketServerConfig = 'websocketServerConfig',
  setNetworkProfileRequest = 'setNetworkProfileRequest',
}

export class SetNetworkProfileData {
  @GqlAssociation({
    parentIdFieldName: SetNetworkProfileDataProps.websocketServerConfig,
    associatedIdFieldName: ServerNetworkProfileProps.id,
    gqlQuery: {
      query: SERVER_NETWORK_PROFILE_GET_QUERY,
    },
    gqlListQuery: {
      query: SERVER_NETWORK_PROFILE_LIST_QUERY,
    },
  })
  @Type(() => ServerNetworkProfile)
  @IsOptional()
  websocketServerConfig?: ServerNetworkProfile | null;

  @Type(() => SetNetworkProfileRequest)
  @ValidateNested()
  @IsNotEmpty()
  setNetworkProfileRequest!: SetNetworkProfileRequest;
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

  const setNetworkProfileData = new SetNetworkProfileData();
  const serverNetworkProfile = new ServerNetworkProfile();
  serverNetworkProfile[ServerNetworkProfileProps.id] = NEW_IDENTIFIER;
  const setNetworkProfileRequest = new SetNetworkProfileRequest();
  setNetworkProfileRequest[SetNetworkProfileRequestProps.connectionData] =
    new NetworkConnectionProfileType();
  setNetworkProfileData[SetNetworkProfileDataProps.websocketServerConfig] =
    serverNetworkProfile;
  setNetworkProfileData[SetNetworkProfileDataProps.setNetworkProfileRequest] =
    setNetworkProfileRequest;

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(SetNetworkProfileData, plainValues);
    let url = `/configuration/setNetworkProfile?identifier=${station.id}&tenantId=1`;
    if (classInstance.websocketServerConfig) {
      url =
        url +
        `&websocketServerConfigId=${classInstance.websocketServerConfig.id}`;
    }
    await triggerMessageAndHandleResponse({
      url: url,
      responseClass: MessageConfirmation,
      data: classInstance.setNetworkProfileRequest,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={SetNetworkProfileData}
      onFinish={handleSubmit}
      initialValues={setNetworkProfileData}
      parentRecord={setNetworkProfileData}
    />
  );
};
