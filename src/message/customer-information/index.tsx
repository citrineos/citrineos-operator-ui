import React, { useRef } from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import {
  CustomerPayload,
  CustomerInformationRequest,
  GetCustomerInformationDataProps,
} from '../../model/CustomerInformation';
import { NEW_IDENTIFIER } from '@util/consts';
import { useSelectedChargingStationIds } from '@hooks';
import { IdToken, IdTokenProps } from '../../pages/id-tokens/id-token';

export const CustomerInformation: React.FC = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const idToken = new IdToken();
  const getCustomersRequest = new CustomerInformationRequest();
  const stationIds = useSelectedChargingStationIds('identifier=');

  idToken[IdTokenProps.id] = NEW_IDENTIFIER as any;
  getCustomersRequest[GetCustomerInformationDataProps.clear] = false;
  getCustomersRequest[GetCustomerInformationDataProps.report] = false;
  getCustomersRequest[GetCustomerInformationDataProps.idToken] = idToken;

  const handleSubmit = async (plainValues: any) => {
    const payload = CustomerPayload(plainValues);
    await triggerMessageAndHandleResponse({
      url: `/reporting/customerInformation?${stationIds}&tenantId=1`,
      responseClass: CustomerInformationRequest,
      data: payload,
      responseSuccessCheck: (response: CustomerInformationRequest) =>
        !!response,
    });
  };

  return (
    <GenericForm
      ref={formRef as any}
      formProps={formProps}
      dtoClass={CustomerInformationRequest}
      onFinish={handleSubmit}
      initialValues={getCustomersRequest}
      parentRecord={getCustomersRequest}
    />
  );
};
