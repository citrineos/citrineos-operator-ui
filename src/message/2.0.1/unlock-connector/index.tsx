// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Evse } from '../../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION } from '../../queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { EVSE_LIST_QUERY } from '../../../pages/evses/queries';
import { EvseProps } from '../../../pages/evses/EvseProps';

enum UnlockConnectorFormProps {
  evse = 'evse',
}

export class UnlockConnectorForm {
  @GqlAssociation({
    parentIdFieldName: UnlockConnectorFormProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
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
  evse!: Evse;

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

    if (!evse[EvseProps.connectorId]) {
      throw new Error('Please select an EVSE with a connector');
    }

    const data: UnlockConnectorRequest = {
      evseId: evse[EvseProps.id],
      connectorId: evse[EvseProps.connectorId],
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
