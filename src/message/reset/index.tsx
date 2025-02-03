import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../MessageConfirmation';
import { OCPP2_0_1 } from '@citrineos/base';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { GET_EVSE_LIST_FOR_STATION, GET_EVSES_FOR_STATION } from '../queries';
import { GenericForm } from '../../components/form';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Evse } from '../../pages/evses/Evse';
import { triggerMessageAndHandleResponse } from '../util';
import { NEW_IDENTIFIER } from '@util/consts';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { EvseProps } from '../../pages/evses/EvseProps';

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

  @IsEnum(OCPP2_0_1.ResetEnumType)
  type!: OCPP2_0_1.ResetEnumType;

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

    await triggerMessageAndHandleResponse({
      url: `/configuration/reset?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response?.success,
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
