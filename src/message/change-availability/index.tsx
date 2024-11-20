import React, { useRef } from 'react';
import { Form } from 'antd';
import { plainToInstance } from 'class-transformer';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';
import {
  ChangeAvailabilityRequest,
  ChangeAvailabilityRequestProps,
} from './model';
import { useSelectedChargingStationIds } from '@hooks';
import { EvseProps } from '../../pages/evses/EvseProps';

export const ChangeAvailability: React.FC = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = { form };

  const stationIds = useSelectedChargingStationIds();
  const changeAvailabilityRequest = new ChangeAvailabilityRequest();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(
      ChangeAvailabilityRequest,
      plainValues,
    );
    const evse = classInstance[ChangeAvailabilityRequestProps.evse];
    const data: any = {
      operationalStatus:
        classInstance[ChangeAvailabilityRequestProps.operationalStatus],
      customData: (classInstance as any)[
        ChangeAvailabilityRequestProps.customData
      ],
    };

    if (evse && evse[EvseProps.id]) {
      data[ChangeAvailabilityRequestProps.evse] = {
        id: evse[EvseProps.id],
        // customData: todo,
        ...(evse[EvseProps.connectorId]
          ? { connectorId: evse[EvseProps.connectorId] }
          : {}),
      };
    }

    await triggerMessageAndHandleResponse({
      url: `/configuration/changeAvailability?identifier=${stationIds}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  return (
    <GenericForm
      ref={formRef}
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={ChangeAvailabilityRequest}
      parentRecord={changeAvailabilityRequest}
      initialValues={changeAvailabilityRequest}
    />
  );
};
