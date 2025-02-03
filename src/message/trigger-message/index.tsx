import React from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { OCPP2_0_1 } from '@citrineos/base';
import { GenericForm } from '../../components/form';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import {
  createClassWithoutProperty,
  triggerMessageAndHandleResponse,
} from '../util';
import { NEW_IDENTIFIER } from '@util/consts';
import { MessageConfirmation } from '../MessageConfirmation';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  GET_CHARGING_STATION_LIST_FOR_EVSE,
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../queries';
import { Evse } from '../../pages/evses/Evse';
import { FieldCustomActions } from '@util/decorators/FieldCustomActions';
import { useSelector } from 'react-redux';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { CustomAction } from '../../components/custom-actions';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { ChargingStationProps } from '../../pages/charging-stations/ChargingStationProps';
import { EvseProps } from '../../pages/evses/EvseProps';

enum TriggerMessageRequestProps {
  customData = 'customData',
  chargingStation = 'chargingStation',
  evse = 'evse',
  requestedMessage = 'requestedMessage',
}

export const TriggerMessageForEvseCustomAction: CustomAction<Evse> = {
  label: 'Trigger Message',
  execOrRender: (evse: Evse) => {
    return <TriggerMessage evse={evse} />;
  },
};

export class TriggerMessageRequest {
  @GqlAssociation({
    parentIdFieldName: TriggerMessageRequestProps.chargingStation,
    associatedIdFieldName: ChargingStationProps.id,
    gqlQuery: {
      query: GET_CHARGING_STATION_LIST_FOR_EVSE,
    },
    gqlListQuery: {
      query: GET_CHARGING_STATION_LIST_FOR_EVSE,
      getQueryVariables: (_: TriggerMessageRequest) => ({
        [EvseProps.databaseId]: 1,
      }),
    },
  })
  @Type(() => ChargingStation)
  @IsNotEmpty()
  chargingStation!: ChargingStation | null;

  @FieldCustomActions([TriggerMessageForEvseCustomAction])
  @GqlAssociation({
    parentIdFieldName: TriggerMessageRequestProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: {
      query: GET_EVSES_FOR_STATION,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: TriggerMessageRequest, selector: any) => {
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

  @IsEnum(OCPP2_0_1.MessageTriggerEnumType)
  @IsNotEmpty()
  requestedMessage!: OCPP2_0_1.MessageTriggerEnumType;

  @Type(() => CustomDataType)
  @ValidateNested()
  customData?: CustomDataType;
}

export interface TriggerMessageProps {
  station?: ChargingStation;
  evse?: Evse;
}

const TriggerMessageRequestWithoutEvse = createClassWithoutProperty(
  TriggerMessageRequest,
  TriggerMessageRequestProps.evse,
);

const TriggerMessageRequestWithoutStation = createClassWithoutProperty(
  TriggerMessageRequest,
  TriggerMessageRequestProps.chargingStation,
);

export const TriggerMessage: React.FC<TriggerMessageProps> = ({
  station,
  evse,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const selectedChargingStation =
    useSelector(getSelectedChargingStation()) || {};

  const stationId = selectedChargingStation
    ? selectedChargingStation.id
    : station
      ? station.id
      : undefined;

  const triggerMessageRequest = new TriggerMessageRequest();
  triggerMessageRequest[TriggerMessageRequestProps.evse] = new Evse();
  triggerMessageRequest[TriggerMessageRequestProps.evse][EvseProps.databaseId] =
    NEW_IDENTIFIER as unknown as number;

  const triggerMessageRequestWithoutEvse =
    new TriggerMessageRequestWithoutEvse() as Omit<
      TriggerMessageRequest,
      'evse'
    >;
  triggerMessageRequestWithoutEvse[TriggerMessageRequestProps.chargingStation] =
    new ChargingStation();
  triggerMessageRequestWithoutEvse[TriggerMessageRequestProps.chargingStation][
    ChargingStationProps.id
  ] = NEW_IDENTIFIER;

  const dtoClass = evse
    ? TriggerMessageRequestWithoutEvse
    : stationId
      ? TriggerMessageRequestWithoutStation
      : TriggerMessageRequest;
  const parentRecord = evse
    ? triggerMessageRequestWithoutEvse
    : triggerMessageRequest;

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(TriggerMessageRequest, plainValues);
    const evse = classInstance[TriggerMessageRequestProps.evse];
    const data: any = {
      requestedMessage:
        classInstance[TriggerMessageRequestProps.requestedMessage],
      customData: classInstance[TriggerMessageRequestProps.customData],
    };

    if (evse && evse[EvseProps.id]) {
      data.evse = {
        id: evse[EvseProps.id],
        // customData: todo,
      };
      if (evse[EvseProps.connectorId]) {
        data.evse.connectorId = evse[EvseProps.connectorId];
      }
    }

    await triggerMessageAndHandleResponse({
      url: `/configuration/triggerMessage?identifier=${stationId}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={dtoClass}
      onFinish={handleSubmit}
      parentRecord={parentRecord}
      initialValues={parentRecord}
    />
  );
};
