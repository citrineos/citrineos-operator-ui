// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm, SaveButton } from '@refinedev/antd';
import { TenantPartnerDto } from '../../../dtos/tenant.partner.dto';
import { Form, Input, Select, Button, Space, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ResourceType } from '@util/auth';
import {
  PARTNER_CREATE_MUTATION,
  PARTNER_DETAIL_QUERY,
  PARTNER_UPDATE_MUTATION,
} from '../queries';
import { GetOneResponse } from '@refinedev/core';
import { useParams } from 'react-router-dom';
import config from '@util/config';
import { getSerializedValues } from '@util/middleware';
import { ITenantPartnerDtoProps } from '@citrineos/base';

export const PartnersUpsert = () => {
  const { id } = useParams();
  const { form, formProps, saveButtonProps } = useForm<TenantPartnerDto>({
    resource: ResourceType.PARTNERS,
    redirect: 'list',
    queryOptions: {
      select: (data: GetOneResponse<TenantPartnerDto>) => {
        return data;
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
    const { partnerProfileOCPI, businessName, role, ...rest } = values;
    let roles;
    if (id) {
      roles = partnerProfileOCPI.roles;
    } else {
      roles = [{ role: role, businessDetails: { name: businessName } }];
    }

    const input = {
      ...rest,
      partnerProfileOCPI: {
        ...partnerProfileOCPI,
        roles: roles,
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
      {id ? (
        <Form.List name={['partnerProfileOCPI', 'roles']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'role']}
                    rules={[{ required: true, message: 'Missing role' }]}
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value="CPO">CPO</Select.Option>
                      <Select.Option value="EMSP">EMSP</Select.Option>
                      <Select.Option value="HUB">HUB</Select.Option>
                      <Select.Option value="NAP">NAP</Select.Option>
                      <Select.Option value="NSP">NSP</Select.Option>
                      <Select.Option value="SCSP">SCSP</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'businessDetails', 'name']}
                    rules={[
                      { required: true, message: 'Missing business name' },
                    ]}
                  >
                    <Input placeholder="Business Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'businessDetails', 'website']}
                  >
                    <Input placeholder="Website" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Role
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ) : (
        <>
          <Form.Item
            label="Business Name"
            name="businessName"
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
            name="role"
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
        </>
      )}
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
      {id && (
        <>
          <Form.Item
            label="OCPI Version"
            name={['partnerProfileOCPI', 'version', 'version']}
          >
            <Select>
              <Select.Option value="2.2.1">2.2.1</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Version Details URL"
            name={['partnerProfileOCPI', 'version', 'versionDetailsUrl']}
          >
            <Input />
          </Form.Item>
          <Card title="Server Credentials" style={{ marginBottom: 8 }}>
            <Form.Item
              label="Versions URL"
              name={['partnerProfileOCPI', 'serverCredentials', 'versionsUrl']}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Token"
              name={['partnerProfileOCPI', 'serverCredentials', 'token']}
            >
              <Input />
            </Form.Item>
          </Card>
        </>
      )}
      <SaveButton {...saveButtonProps} />
    </Form>
  );
};
