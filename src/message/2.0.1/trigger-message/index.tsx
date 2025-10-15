// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import {
  createClassWithoutProperty,
  triggerMessageAndHandleResponse,
} from '../../util';
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
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { MessageTriggerEnumType } from '@OCPP2_0_1';
import { CustomDataType } from '../../../model/CustomData';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../../queries';
import { Evse } from '../../../pages/evses/Evse';
import { FieldCustomActions } from '@util/decorators/FieldCustomActions';
import { useSelector } from 'react-redux';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { CustomAction } from '../../../components/custom-actions';

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
  @FieldCustomActions([TriggerMessageForEvseCustomAction])
  @GqlAssociation({
    parentIdFieldName: TriggerMessageRequestProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
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
  evse!: IEvseDto | null;

  @GqlAssociation({
    parentIdFieldName: TriggerMessageRequestProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
      getQueryVariables: (formData: TriggerMessageRequest, selector: any) => {
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

  const triggerMessageRequest = new TriggerMessageRequest();
  triggerMessageRequest[TriggerMessageRequestProps.evse] =
    new Evse() as unknown as IEvseDto;
  triggerMessageRequest[TriggerMessageRequestProps.evse].id =
    NEW_IDENTIFIER as unknown as number;
  const dtoClass = evse
    ? TriggerMessageRequestWithoutEvse
    : TriggerMessageRequest;
  const parentRecord = evse ? triggerMessageRequest : triggerMessageRequest;

  const handleSubmit = async (request: TriggerMessageRequest) => {
    const evse = request[TriggerMessageRequestProps.evse];
    const connector = request.connector;

    const data: any = {
      requestedMessage: request[TriggerMessageRequestProps.requestedMessage],
      customData: request[TriggerMessageRequestProps.customData],
    };

    if (evse && evse.id && evse.id !== (NEW_IDENTIFIER as unknown as number)) {
      data.evse = {
        id: evse.id,
        ...(connector && connector.id ? { connectorId: connector.id } : {}),
      };
    }

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/triggerMessage?identifier=${stationId}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP2_0_1,
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
