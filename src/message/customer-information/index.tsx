import React, { useRef } from 'react';
import { Form } from 'antd';
import { GenericForm } from '../../components/form';
import { triggerMessageAndHandleResponse } from '../util';
import {
  GetCustomerProps,
  GetCustomersRequest,
  CustomerPayload,
} from '../../model/CustomerInformation';

export const GetCustomers: React.FC<GetCustomerProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const getCustomersRequest = new GetCustomersRequest();

  const handleSubmit = async (plainValues: any) => {
    const payload = CustomerPayload(plainValues);
    await triggerMessageAndHandleResponse(
      `/reporting/customerInformation?identifier=${station.id}&tenantId=1`,
      GetCustomersRequest,
      payload,
      (response: GetCustomersRequest) => !!response,
    );
  };

  return (
    <GenericForm
      ref={formRef as any}
      formProps={formProps}
      dtoClass={GetCustomersRequest}
      onFinish={handleSubmit}
      initialValues={getCustomersRequest}
      parentRecord={getCustomersRequest}
    />
  );
};
