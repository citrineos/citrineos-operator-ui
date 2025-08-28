// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm } from '@refinedev/antd';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_SHOW_QUERY,
} from '../queries';
import { CanAccess, useNavigation } from '@refinedev/core';
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  InputNumber,
  DatePicker,
} from 'antd';
import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { AuthorizationStatusEnumType, IdTokenEnumType } from '@OCPP2_0_1';
import { AuthorizationWhitelistType } from '@citrineos/base';
import { renderEnumSelectOptions } from '@util/renderUtil';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import config from '@util/config';
import { AuthorizationDto } from '../../../dtos/authorization.dto';

export const AuthorizationUpsert = () => {
  const params: any = useParams<{ id: string }>();
  const authorizationId = params.id ? params.id : undefined;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { replace, goBack } = useNavigation();

  // UseForm must be declared before any usage
  const formResult = useForm({
    resource: ResourceType.AUTHORIZATIONS,
    id: authorizationId,
    queryOptions: {
      enabled: !!authorizationId,
    },
    redirect: false,
    onMutationSuccess: (result) => {
      const newId = result.data.id;
      replace(`/${MenuSection.AUTHORIZATIONS}/${newId}`);
    },
    meta: {
      gqlQuery: AUTHORIZATIONS_SHOW_QUERY,
      gqlMutation: authorizationId
        ? AUTHORIZATIONS_EDIT_MUTATION
        : AUTHORIZATIONS_CREATE_MUTATION,
    },
  });
  const formProps = formResult.formProps;

  const handleOnChange = useCallback(() => {
    setIsFormChanged(true);
  }, []);

  const handleReset = useCallback(() => {
    formProps.form?.resetFields();
    setIsFormChanged(false);
  }, [formProps.form]);

  const handleCancel = useCallback(() => {
    if (isFormChanged) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        onOk: () => replace(`/${ResourceType.AUTHORIZATIONS}`),
      });
    } else {
      replace(`/${ResourceType.AUTHORIZATIONS}`);
    }
  }, [isFormChanged, replace]);

  const onFinish = useCallback(
    async (input: any) => {
      const now = new Date().toISOString();
      const flatAuth: AuthorizationDto = {
        ...input,
        allowedConnectorTypes: input.allowedConnectorTypes
          ?.split(',')
          .map((s: string) => s.trim()),
        disallowedEvseIdPrefixes: input.disallowedEvseIdPrefixes
          ?.split(',')
          .map((s: string) => s.trim()),
        tenantId: config.tenantId,
        createdAt: input.createdAt ?? now,
        updatedAt: input.updatedAt ?? now,
      };
      formProps.onFinish?.(flatAuth);
    },
    [formProps],
  );

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.EDIT}
      fallback={<AccessDeniedFallback />}
      params={{ id: authorizationId }}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={onFinish}
        onChange={handleOnChange}
        data-testid="authorizations-create-form"
      >
        <Flex gap={32}>
          <Flex flex={1} vertical>
            <Flex
              align="center"
              className="relative"
              style={{ marginBottom: 16 }}
            >
              <ArrowLeftIcon
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  transform: 'translateX(-100%)',
                }}
                onClick={() => goBack()}
              />
              <h3>
                {authorizationId
                  ? 'Edit Authorization'
                  : 'Create Authorization'}
              </h3>
            </Flex>
            <Form.Item
              key="idToken"
              label="ID Token"
              name="idToken"
              rules={[{ required: true, message: 'ID Token is required' }]}
              data-testid="idToken"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="idTokenType"
              label="ID Token Type"
              name="idTokenType"
              rules={[{ required: true, message: 'ID Token Type is required' }]}
              data-testid="idTokenType"
            >
              <Select onChange={handleOnChange}>
                {renderEnumSelectOptions(IdTokenEnumType)}
              </Select>
            </Form.Item>
            <Form.Item
              key="status"
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Status is required' }]}
              data-testid="status"
            >
              <Select onChange={handleOnChange}>
                {renderEnumSelectOptions(AuthorizationStatusEnumType)}
              </Select>
            </Form.Item>
            <Form.Item
              key="cacheExpiryDateTime"
              label="Cache Expiry DateTime"
              name="cacheExpiryDateTime"
              data-testid="cacheExpiryDateTime"
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              key="chargingPriority"
              label="Charging Priority"
              name="chargingPriority"
              data-testid="chargingPriority"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              key="language1"
              label="Language 1"
              name="language1"
              data-testid="language1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="language2"
              label="Language 2"
              name="language2"
              data-testid="language2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="personalMessage"
              label="Personal Message"
              name="personalMessage"
              data-testid="personalMessage"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              key="groupAuthorizationId"
              label="Group Authorization ID"
              name="groupAuthorizationId"
              data-testid="groupAuthorizationId"
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              key="allowedConnectorTypes"
              label="Allowed Connector Types (comma-separated)"
              name="allowedConnectorTypes"
              data-testid="allowedConnectorTypes"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="disallowedEvseIdPrefixes"
              label="Disallowed EVSE ID Prefixes (comma-separated)"
              name="disallowedEvseIdPrefixes"
              data-testid="disallowedEvseIdPrefixes"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="realTimeAuth"
              label="Real-Time Authentication"
              name="realTimeAuth"
              data-testid="realTimeAuth"
            >
              <Select onChange={handleOnChange}>
                {renderEnumSelectOptions(AuthorizationWhitelistType)}
              </Select>
            </Form.Item>
            <Form.Item
              key="realTimeAuthUrl"
              label="Real-Time Authentication URL"
              name="realTimeAuthUrl"
              data-testid="realTimeAuthUrl"
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="additionalInfo"
              label="Additional Info (JSON)"
              name="additionalInfo"
              data-testid="additionalInfo"
            >
              <Input.TextArea placeholder="{ }" />
            </Form.Item>
            <Form.Item
              key="concurrentTransaction"
              label="Allow Concurrent Transaction"
              name="concurrentTransaction"
              valuePropName="checked"
              data-testid="concurrentTransaction"
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Flex gap={16}>
                {authorizationId && (
                  <Button onClick={handleReset} disabled={!isFormChanged}>
                    Reset
                  </Button>
                )}
                <Button onClick={handleCancel} danger>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  data-testid="authorizations-create-form-submit"
                >
                  Submit
                </Button>
              </Flex>
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </CanAccess>
  );
};
