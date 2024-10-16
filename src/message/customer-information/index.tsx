import React, { useRef } from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import {
  GetCustomerProps,
  CustomerInformationRequest,
  CustomerPayload,
} from '../../model/CustomerInformation';

export const CustomerInformation: React.FC<GetCustomerProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getCustomersRequest = new CustomerInformationRequest();

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
