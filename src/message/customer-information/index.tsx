import React, { useRef } from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import {
  GetCustomerProps,
  CustomerInformationRequest,
  CustomerPayload,
  GetCustomerInformationDataProps,
} from '../../model/CustomerInformation';
import { NEW_IDENTIFIER } from '../../util/consts';
import { IdToken, IdTokenProps } from '../../pages/id-tokens/id-token';

export const CustomerInformation: React.FC<GetCustomerProps> = ({
  station,
}) => {
  const formRef = useRef();
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

  const handleSubmit = async (plainValues: any) => {
    const payload = CustomerPayload(plainValues);
    await triggerMessageAndHandleResponse(
      `/reporting/customerInformation?identifier=${station.id}&tenantId=1`,
      CustomerInformationRequest,
      payload,
      (response: CustomerInformationRequest) => !!response,
    );
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
