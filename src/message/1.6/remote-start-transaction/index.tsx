// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Type } from 'class-transformer';
import { ConnectorDtoProps } from '../../../dtos/connector.dto';
import {
  CONNECTORS_FOR_STATION_QUERY,
  CONNECTOR_LIST_FOR_STATION_QUERY,
} from '../../queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { NEW_IDENTIFIER } from '@util/consts';
import { Connector } from '../../../pages/connectors/connector';

enum RemoteStartTransactionDataProps {
  connector = 'connector',
  idTag = 'idTag',
  chargingProfile = 'chargingProfile',
}

export interface RemoteStartTransactionProps {
  station: ChargingStation;
}

class RemoteStartTransactionData {
  //   @IsOptional()
  //   @IsNumber()
  //   connectorId?: number | null;

  @GqlAssociation({
    parentIdFieldName: RemoteStartTransactionDataProps.connector,
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

  @IsString()
  idTag!: string;

  //   @IsOptional()
  //   @ValidateNested()
  //   @Type(() => ChargingProfileType)
  //   chargingProfile?: ChargingProfileType | null;
}

export const RemoteStartTransaction: React.FC<RemoteStartTransactionProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const remoteStartTransactionData = new RemoteStartTransactionData();
  remoteStartTransactionData[RemoteStartTransactionDataProps.connector] =
    new Connector();
  remoteStartTransactionData[RemoteStartTransactionDataProps.connector][
    ConnectorDtoProps.id
  ] = NEW_IDENTIFIER as unknown as number;

  const handleSubmit = async (request: RemoteStartTransactionData) => {
    const data: any = { idTag: request.idTag };
    if (request.connector && request.connector.connectorId) {
      data.connectorId = request.connector.connectorId;
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/remoteStartTransaction?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={RemoteStartTransactionData}
      onFinish={handleSubmit}
      parentRecord={remoteStartTransactionData}
      initialValues={remoteStartTransactionData}
    />
  );
};
