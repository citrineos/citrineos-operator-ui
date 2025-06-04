// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { TriggerMessageRequestRequestedMessage } from '@OCPP1_6';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { ConnectorDtoProps } from '../../../dtos/connector.dto';
import { Type } from 'class-transformer';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import {
  CONNECTOR_LIST_FOR_STATION_QUERY,
  CONNECTORS_FOR_STATION_QUERY,
} from '../../queries';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '@util/consts';
import { Connector } from '../../../pages/connectors/connector';

enum TriggerMessageDataProps {
  requestedMessage = 'requestedMessage',
  connector = 'connector',
}

export interface TriggerMessageProps {
  station: ChargingStation;
}

class TriggerMessageData {
  @IsEnum(TriggerMessageRequestRequestedMessage)
  requestedMessage!: TriggerMessageRequestRequestedMessage;

  @GqlAssociation({
    parentIdFieldName: TriggerMessageDataProps.connector,
    associatedIdFieldName: ConnectorDtoProps.id,
    gqlQuery: {
      query: CONNECTORS_FOR_STATION_QUERY,
    },
    gqlListQuery: {
      query: CONNECTOR_LIST_FOR_STATION_QUERY,
      getQueryVariables: (_: any, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Connector)
  @ValidateNested()
  @IsNotEmpty()
  connector!: Connector | null;

  //   @IsOptional()
  //   @IsNumber()
  //   connectorId?: number | null;
}

export const TriggerMessage: React.FC<TriggerMessageProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const triggerMessageData = new TriggerMessageData();
  triggerMessageData[TriggerMessageDataProps.connector] = new Connector();
  triggerMessageData[TriggerMessageDataProps.connector][ConnectorDtoProps.id] =
    NEW_IDENTIFIER as unknown as number;

  const handleSubmit = async (request: TriggerMessageData) => {
    const data: any = { requestedMessage: request.requestedMessage };
    if (request.connector && request.connector.connectorId) {
      data.connectorId = request.connector.connectorId;
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/triggerMessage?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={TriggerMessageData}
      onFinish={handleSubmit}
      parentRecord={triggerMessageData}
      initialValues={triggerMessageData}
    />
  );
};
