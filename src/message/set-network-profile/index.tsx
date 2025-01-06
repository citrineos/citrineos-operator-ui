import { SetNetworkProfileStatusEnumType } from '@citrineos/base';
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
import { useSelectedChargingStationIds } from '@hooks';

enum SetNetworkProfileRequestProps {
  configurationSlot = 'configurationSlot',
  connectionData = 'connectionData',
}

export class SetNetworkProfileRequest {
  @IsInt()
  @IsNotEmpty()
  configurationSlot!: number;

  @Type(() => NetworkConnectionProfileType)
  @ValidateNested()
  @IsNotEmpty()
  connectionData!: NetworkConnectionProfileType;
}

export class SetNetworkProfileResponse {
  @IsEnum(SetNetworkProfileStatusEnumType)
  @IsNotEmpty()
  status!: SetNetworkProfileStatusEnumType;

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

export const SetNetworkProfile: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = { form };
  const serverNetworkProfile = new ServerNetworkProfile();
  const setNetworkProfileData = new SetNetworkProfileData();
  const setNetworkProfileRequest = new SetNetworkProfileRequest();
  const stationIds = useSelectedChargingStationIds('identifier=');

  serverNetworkProfile[ServerNetworkProfileProps.id] = NEW_IDENTIFIER;
  setNetworkProfileRequest[SetNetworkProfileRequestProps.connectionData] =
    new NetworkConnectionProfileType();
  setNetworkProfileData[SetNetworkProfileDataProps.websocketServerConfig] =
    serverNetworkProfile;
  setNetworkProfileData[SetNetworkProfileDataProps.setNetworkProfileRequest] =
    setNetworkProfileRequest;

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(SetNetworkProfileData, plainValues);
    let url = `/configuration/setNetworkProfile?${stationIds}&tenantId=1`;
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
      onFinish={handleSubmit}
      dtoClass={SetNetworkProfileData}
      parentRecord={setNetworkProfileData}
      initialValues={setNetworkProfileData}
    />
  );
};
