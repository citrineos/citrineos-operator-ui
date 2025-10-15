// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import {
  ChangeAvailabilityRequestDtoProps,
  ConnectorDtoProps,
  EvseDtoProps,
  OCPPVersion,
} from '@citrineos/base';
import { ChangeAvailabilityRequest } from './model';

export interface ChangeAvailabilityProps {
  station: ChargingStation;
}

export const ChangeAvailability: React.FC<ChangeAvailabilityProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const changeAvailabilityRequest = new ChangeAvailabilityRequest();

  const handleSubmit = async (request: ChangeAvailabilityRequest) => {
    const evse = request.evse;
    const connector = request.connector;
    const data: any = {
      operationalStatus: request.operationalStatus,
      // customData: request.customData,
    };

    if (evse && evse[EvseDtoProps.evseTypeId]) {
      data[ChangeAvailabilityRequestDtoProps.evse] = {
        id: evse.evseTypeId,
        ...(connector && connector[ConnectorDtoProps.evseTypeConnectorId]
          ? { connectorId: connector[ConnectorDtoProps.evseTypeConnectorId] }
          : {}),
      };
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeAvailability?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ChangeAvailabilityRequest}
      onFinish={handleSubmit}
      parentRecord={changeAvailabilityRequest}
      initialValues={changeAvailabilityRequest}
    />
  );
};
