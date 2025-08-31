// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm, SaveButton } from '@refinedev/antd';
import { TenantPartnerDto } from '../../../dtos/tenant.partner.dto';
import { Form, Input, Select, InputNumber } from 'antd';
import { ResourceType } from '@util/auth';
import {
  PARTNER_CREATE_MUTATION,
  PARTNER_DETAIL_QUERY,
  PARTNER_UPDATE_MUTATION,
} from '../queries';
import { GetOneResponse } from '@refinedev/core';
import { useParams } from 'react-router-dom';
import { ITenantPartnerDtoProps } from '../../../../../citrineos-core/00_Base';
import config from '@util/config';
import { getSerializedValues } from '@util/middleware';

export const PartnersUpsert = () => {
  const { id } = useParams();
  const { form, formProps, saveButtonProps } = useForm<TenantPartnerDto>({
    resource: ResourceType.PARTNERS,
    redirect: 'edit',
    onMutationSuccess: (data, variables, context) => {
      console.log('Mutation successful:', data, variables, context);
    },
    onMutationError: (error, variables, context) => {
      console.error('Mutation error:', error, variables, context);
    },
    queryOptions: {
      select: (data: GetOneResponse<TenantPartnerDto>) => {
        const partner = data.data;
        return {
          data: {
            ...partner,
            partnerProfileOCPI: {
              ...partner.partnerProfileOCPI,
              roles: [
                {
                  businessDetails: {
                    name: partner.partnerProfileOCPI?.roles[0]?.businessDetails
                      ?.name,
                  },
                  role: partner.partnerProfileOCPI?.roles[0]?.role,
                },
              ],
              credentials: {
                versionsUrl:
                  partner.partnerProfileOCPI?.credentials?.versionsUrl,
                token: partner.partnerProfileOCPI?.credentials?.token,
                serverToken:
                  partner.partnerProfileOCPI?.credentials?.serverToken,
              },
              endpoints: partner.partnerProfileOCPI?.endpoints,
            },
          },
        };
      },
    },
    mutationMode: 'pessimistic',
    action: id ? 'edit' : 'create',
    successNotification: () => {
      return {
        message: `Partner ${id ? 'updated' : 'created'} successfully`,
        type: 'success',
      };
    },
    errorNotification: (error) => {
      return {
        message: `Error ${
          id ? 'updating' : 'creating'
        } partner: ${error?.message}`,
        type: 'error',
      };
    },
    liveMode: 'auto',
    warnWhenUnsavedChanges: true,
    meta: {
      gqlQuery: PARTNER_DETAIL_QUERY,
      gqlMutation: id ? PARTNER_UPDATE_MUTATION : PARTNER_CREATE_MUTATION,
    },
  });

  const handleOnFinish = (values: any) => {
    const { partnerProfileOCPI, ...rest } = values;
    const input = {
      ...rest,
      partnerProfileOCPI: {
        roles: [
          {
            role: partnerProfileOCPI?.roles[0]?.role,
            businessDetails: {
              name: partnerProfileOCPI?.roles[0]?.businessDetails?.name,
            },
          },
        ],
        credentials: {
          versionsUrl: partnerProfileOCPI?.credentials?.versionsUrl,
          token: partnerProfileOCPI?.credentials?.token,
          serverToken: partnerProfileOCPI?.credentials?.serverToken,
        },
        endpoints: partnerProfileOCPI?.endpoints,
      },
    };
    const newItem: any = getSerializedValues(input, TenantPartnerDto);
    if (!id) {
      newItem.tenantId = config.tenantId;
    }
    formProps.onFinish?.(newItem);
  };

  return (
    <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
      <Form.Item
        label="Country Code"
        name={ITenantPartnerDtoProps.countryCode}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Party ID"
        name={ITenantPartnerDtoProps.partyId}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Business Name"
        name={['partnerProfileOCPI', 'roles', 0, 'businessDetails', 'name']}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name={['partnerProfileOCPI', 'roles', 0, 'role']}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="CPO">CPO</Select.Option>
          <Select.Option value="EMSP">EMSP</Select.Option>
          <Select.Option value="HUB">HUB</Select.Option>
          <Select.Option value="NAP">NAP</Select.Option>
          <Select.Option value="NSP">NSP</Select.Option>
          <Select.Option value="SCSP">SCSP</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Versions URL"
        name={['partnerProfileOCPI', 'credentials', 'versionsUrl']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Client Token"
        name={['partnerProfileOCPI', 'credentials', 'token']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Server Token"
        name={['partnerProfileOCPI', 'credentials', 'serverToken']}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Endpoints" name={['partnerProfileOCPI', 'endpoints']}>
        <Input />
      </Form.Item>
      <SaveButton {...saveButtonProps} />
    </Form>
  );
};
