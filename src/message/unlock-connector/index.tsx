import React from 'react';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../util';
import { Evse } from '../../pages/evses/Evse';
import { NEW_IDENTIFIER } from '@util/consts';
import { GenericForm } from '../../components/form';
import { MessageConfirmation } from '../MessageConfirmation';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { Form, notification } from 'antd';
import { EVSE_LIST_QUERY } from '../../pages/evses/queries';
import { EvseProps } from '../../pages/evses/EvseProps';
import { useSelectedChargingStationIds } from '@hooks';

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
}

export const UnlockConnector: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = { form };
  const stationIds = useSelectedChargingStationIds();
  const unlockConnectorForm = new UnlockConnectorForm();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();

    const plainEvse = plainValues[UnlockConnectorFormProps.evse];
    // TODO add another gql filter to only pull EVSEs with a connector id
    // so that we don't have to show this error
    if (!plainEvse[EvseProps.connectorId]) {
      notification.error({
        message: 'Invalid EVSE',
        description: 'Please select an EVSE with a connector',
        placement: 'topRight',
      });
      return;
    }

    const data: UnlockConnectorRequest = {
      evseId: plainEvse[EvseProps.id],
      connectorId: plainEvse[EvseProps.connectorId],
    };
    await triggerMessageAndHandleResponse({
      url: `/evdriver/unlockConnector?identifier=${stationIds}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response?.success,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={UnlockConnectorForm}
      parentRecord={unlockConnectorForm}
      initialValues={unlockConnectorForm}
    />
  );
};
