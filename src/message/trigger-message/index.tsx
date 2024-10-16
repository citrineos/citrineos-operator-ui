import { ChargingStation } from '../remote-stop/ChargingStation';
import React from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { MessageTriggerEnumType } from '@citrineos/base';
import { GenericForm } from '../../components/form';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import {
  createClassWithoutProperty,
  triggerMessageAndHandleResponse,
} from '../util';
import { NEW_IDENTIFIER } from '../../util/consts';
import { MessageConfirmation } from '../MessageConfirmation';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION, GET_EVSES_FOR_STATION } from '../queries';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import { FieldCustomActions } from '../../util/decorators/FieldCustomActions';
import { useSelector } from 'react-redux';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

enum TriggerMessageRequestProps {
  customData = 'customData',
  evse = 'evse',
  requestedMessage = 'requestedMessage',
}

export class TriggerMessageRequest {
  @FieldCustomActions([
    {
      label: 'Trigger Message',
      execOrRender: (evse: Evse) => {
        return <TriggerMessage evse={evse} />;
      },
    },
  ])
  @GqlAssociation({
    parentIdFieldName: TriggerMessageRequestProps.evse,
    associatedIdFieldName: 'databaseId',
    gqlQuery: GET_EVSES_FOR_STATION,
    gqlListQuery: GET_EVSE_LIST_FOR_STATION,
    gqlUseQueryVariablesKey: TriggerMessageRequestProps.evse,
  })
  @Type(() => Evse)
  @IsNotEmpty()
  evse!: Evse | null;

  @IsEnum(MessageTriggerEnumType)
  @IsNotEmpty()
  requestedMessage!: MessageTriggerEnumType;

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

  console.log('selected stationId', stationId);

  const triggerMessageRequest = new TriggerMessageRequest();
  triggerMessageRequest[TriggerMessageRequestProps.evse] = new Evse();
  triggerMessageRequest[TriggerMessageRequestProps.evse]['databaseId'] =
    NEW_IDENTIFIER as unknown as number;

  const triggerMessageRequestWithoutEvse =
    new TriggerMessageRequestWithoutEvse();

  const dtoClass = evse
    ? TriggerMessageRequestWithoutEvse
    : TriggerMessageRequest;
  const parentRecord = evse
    ? triggerMessageRequestWithoutEvse
    : triggerMessageRequest;

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(TriggerMessageRequest, plainValues);
    const evse = classInstance[TriggerMessageRequestProps.evse];
    const data = {
      requestedMessage:
        classInstance[TriggerMessageRequestProps.requestedMessage],
      customData: classInstance[TriggerMessageRequestProps.customData],
      evse: evse
        ? {
            id: evse[EvseProps.databaseId],
            // customData: todo,
            connectorId: evse[EvseProps.connectorId],
          }
        : undefined,
    };
    await triggerMessageAndHandleResponse(
      `/configuration/triggerMessage?identifier=${stationId}&tenantId=1`,
      MessageConfirmation,
      data,
      (response: MessageConfirmation) => response && (response as any).success,
    );
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={dtoClass}
      onFinish={handleSubmit}
      parentRecord={parentRecord}
      initialValues={parentRecord}
      gqlQueryVariablesMap={{
        [TriggerMessageRequestProps.evse]: {
          stationId: stationId,
        },
      }}
    />
  );
};
