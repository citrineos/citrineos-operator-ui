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
import { ResetEnumType } from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Evse } from '../../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { EvseProps } from '../../../pages/evses/EvseProps';
import {
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../../queries';

enum ResetDataProps {
  evse = 'evse',
  type = 'type',
  evseId = 'evseId',
}

export interface ResetChargingStationProps {
  station: ChargingStation;
}

class ResetData {
  @GqlAssociation({
    parentIdFieldName: ResetDataProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: {
      query: GET_EVSES_FOR_STATION,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: ResetData, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Evse)
  @IsNotEmpty()
  evse!: Evse | null;

  @IsEnum(ResetEnumType)
  type!: ResetEnumType;

  // @Type(() => CustomDataType)
  // @IsOptional()
  // customData?: CustomDataType | null;
}

export const ResetChargingStation: React.FC<ResetChargingStationProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const resetData = new ResetData();
  resetData[ResetDataProps.evse] = new Evse();
  resetData[ResetDataProps.evse][EvseProps.databaseId] =
    NEW_IDENTIFIER as unknown as number;

  const handleSubmit = async (request: ResetData) => {
    const data = { type: request.type, evseId: request.evse?.id };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/reset?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={ResetData}
      onFinish={handleSubmit}
      parentRecord={resetData}
      initialValues={resetData}
    />
  );
};
