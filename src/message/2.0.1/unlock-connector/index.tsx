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
  EvseDtoProps,
  type IEvseDto,
  OCPPVersion,
  type IConnectorDto,
} from '@citrineos/base';
import { Connector } from '../../../pages/connectors/connector';
import { GET_CONNECTOR_LIST_FOR_STATION_EVSE } from '../../queries';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Evse } from '../../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION } from '../../queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { EVSE_LIST_QUERY } from '../../../pages/evses/queries';

enum UnlockConnectorFormProps {
  evse = 'evse',
}

export class UnlockConnectorForm {
  @GqlAssociation({
    parentIdFieldName: UnlockConnectorFormProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: EVSE_LIST_QUERY,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: any, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Evse)
  @ValidateNested()
  @IsNotEmpty()
  evse!: IEvseDto;

  @GqlAssociation({
    parentIdFieldName: UnlockConnectorFormProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
      getQueryVariables: (formData: UnlockConnectorForm, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        const selectedEvse = formData.evse;
        const hasValidEvse =
          selectedEvse &&
          selectedEvse.id &&
          (selectedEvse.id as any) !== NEW_IDENTIFIER;

        return {
          stationId: station.id,
          where: hasValidEvse ? { evseId: { _eq: selectedEvse.id } } : {},
        };
      },
    },
  })
  @Type(() => Connector)
  @ValidateNested()
  @IsOptional()
  connector?: IConnectorDto | null;

  constructor() {
    Object.assign(this, {
      [UnlockConnectorFormProps.evse]: NEW_IDENTIFIER,
    });
  }
}

export class UnlockConnectorRequest {
  @IsNumber()
  @IsNotEmpty()
  evseId!: number;

  @IsNumber()
  @IsNotEmpty()
  connectorId!: number;

  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;
}

export interface UnlockConnectorProps {
  station: ChargingStation;
}

export const UnlockConnector: React.FC<UnlockConnectorProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const unlockConnectorForm = new UnlockConnectorForm();

  const handleSubmit = async (request: UnlockConnectorForm) => {
    const evse = request[UnlockConnectorFormProps.evse];

    const connector = request.connector;

    if (!evse || !connector || !connector.id) {
      throw new Error('Please select an EVSE and a valid connector');
    }

    const data: UnlockConnectorRequest = {
      evseId: evse.id!,
      connectorId: connector.id,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/unlockConnector?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={UnlockConnectorForm}
      onFinish={handleSubmit}
      parentRecord={unlockConnectorForm}
      initialValues={unlockConnectorForm}
    />
  );
};
