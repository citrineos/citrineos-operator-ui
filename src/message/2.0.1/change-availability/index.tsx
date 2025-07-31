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
    const evse = (request as any).evse;
    const data: any = {
      operationalStatus: (request as any).operationalStatus,
      customData: (request as any).customData,
    };

    if (evse && evse.id) {
      data[ChangeAvailabilityRequestDtoProps.evse] = {
        id: evse.id,
        ...(evse.connectors?.[0]?.id
          ? { connectorId: evse.connectors[0].id }
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
