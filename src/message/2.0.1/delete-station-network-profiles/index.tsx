// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { HttpMethod } from '@citrineos/base';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export interface DeleteStationNetworkProfilesProps {
  station: ChargingStation;
}

export enum DeleteStationNetworkProfilesRequestProps {
  configurationSlots = 'configurationSlots',
}

export class DeleteStationNetworkProfilesRequest {
  @ArrayMinSize(1)
  @IsArray()
  @IsInt()
  @IsNotEmpty()
  configurationSlots!: number[];
}

export const DeleteStationNetworkProfiles: React.FC<
  DeleteStationNetworkProfilesProps
> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const deleteStationNetworkProfilesRequest =
    new DeleteStationNetworkProfilesRequest();

  const handleSubmit = async (request: DeleteStationNetworkProfilesRequest) => {
    let url = `/configuration/serverNetworkProfile?stationId=${station.id}`;
    for (const configurationSlot of request.configurationSlots) {
      url = url + `&configurationSlot=${configurationSlot}`;
    }

    await triggerMessageAndHandleResponse<MessageConfirmation>({
      url: url,
      data: undefined,
      ocppVersion: null,
      method: HttpMethod.Delete,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={DeleteStationNetworkProfilesRequest}
      onFinish={handleSubmit}
      parentRecord={deleteStationNetworkProfilesRequest}
      initialValues={deleteStationNetworkProfilesRequest}
    />
  );
};
