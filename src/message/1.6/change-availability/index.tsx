// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { ChangeAvailabilityRequestType } from '@OCPP1_6';
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

enum ChangeAvailabilityDataProps {
  connector = 'connector',
  type = 'type',
}

export interface ChangeAvailabilityProps {
  station: ChargingStation;
}

class ChangeAvailabilityData {
  //   @IsOptional()
  //   @IsNumber()
  //   connectorId?: number;

  @GqlAssociation({
    parentIdFieldName: ChangeAvailabilityDataProps.connector,
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
  connector!: Connector;

  @IsEnum(ChangeAvailabilityRequestType)
  type!: ChangeAvailabilityRequestType;
}

export const ChangeAvailability: React.FC<ChangeAvailabilityProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const changeAvailabilityData = new ChangeAvailabilityData();
  changeAvailabilityData[ChangeAvailabilityDataProps.connector] =
    new Connector();
  changeAvailabilityData[ChangeAvailabilityDataProps.connector][
    ConnectorDtoProps.id
  ] = NEW_IDENTIFIER as unknown as number;

  const handleSubmit = async (request: ChangeAvailabilityData) => {
    const data: any = {
      type: request.type,
      connectorId: request.connector.connectorId,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeAvailability?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ChangeAvailabilityData}
      onFinish={handleSubmit}
      parentRecord={changeAvailabilityData}
      initialValues={changeAvailabilityData}
    />
  );
};
