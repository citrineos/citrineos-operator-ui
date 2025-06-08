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
import {
  CustomerInformationRequest,
  CustomerPayload,
  GetCustomerInformationDataProps,
  GetCustomerProps,
} from '../../../model/CustomerInformation';
import { NEW_IDENTIFIER } from '@util/consts';
import { IdToken, IdTokenProps } from '../../../pages/id-tokens/id-token';

export interface CustomerInformationProps {
  station: ChargingStation;
}

export const CustomerInformation: React.FC<GetCustomerProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getCustomersRequest = new CustomerInformationRequest();
  const idToken = new IdToken();
  idToken[IdTokenProps.id] = NEW_IDENTIFIER as any;
  getCustomersRequest[GetCustomerInformationDataProps.clear] = false;
  getCustomersRequest[GetCustomerInformationDataProps.report] = false;
  getCustomersRequest[GetCustomerInformationDataProps.idToken] = idToken;

  const handleSubmit = async (request: CustomerInformationRequest) => {
    const payload = CustomerPayload(request);

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/customerInformation?identifier=${station.id}&tenantId=1`,
      data: payload,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={CustomerInformationRequest}
      onFinish={handleSubmit}
      parentRecord={getCustomersRequest}
      initialValues={getCustomersRequest}
    />
  );
};
