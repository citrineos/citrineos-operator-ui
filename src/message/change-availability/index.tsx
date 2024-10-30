import React, { useRef } from 'react';
import { Form } from 'antd';
import { plainToInstance } from 'class-transformer';
import { EvseProps } from '../../pages/evses/Evse';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';
import {
  ChangeAvailabilityProps,
  ChangeAvailabilityRequest,
  ChangeAvailabilityRequestProps,
} from './model';
import { useSelector } from 'react-redux';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

export const ChangeAvailability: React.FC<ChangeAvailabilityProps> = ({
  station,
}) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = { form };

  const selectedChargingStation =
    useSelector(getSelectedChargingStation()) || {};

  const stationId = selectedChargingStation
    ? selectedChargingStation.id
    : station
      ? station.id
      : undefined;

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
      customData: classInstance[ChangeAvailabilityRequestProps.customData],
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
      url: `/configuration/changeAvailability?identifier=${station.id}&tenantId=1`,
      responseClass: MessageConfirmation,
      data: data,
      responseSuccessCheck: (response: MessageConfirmation) =>
        response && response.success,
    });
  };

  const qglQueryVariablesMap = {
    [ChangeAvailabilityRequestProps.evse]: {
      stationId: stationId,
    },
  };

  return (
    <GenericForm
      ref={formRef}
      dtoClass={ChangeAvailabilityRequest}
      formProps={formProps}
      onFinish={handleSubmit}
      initialValues={changeAvailabilityRequest}
      parentRecord={changeAvailabilityRequest}
      gqlQueryVariablesMap={qglQueryVariablesMap}
    />
  );
};
