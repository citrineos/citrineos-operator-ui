// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm } from '@refinedev/antd';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_SHOW_QUERY,
} from '../queries';
import { CanAccess, GetOneResponse, useNavigation } from '@refinedev/core';
import { getSerializedValues } from '@util/middleware';
import { Button, Flex, Form, Input, Modal, Select, Switch } from 'antd';
import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { IdTokenDto, IdTokenDtoProps } from '../../../dtos/id.token.dto';
import { AuthorizationStatusEnumType, IdTokenEnumType } from '@OCPP2_0_1';
import {
  IdTokenInfoDto,
  IdTokenInfoDtoProps,
} from '../../../dtos/id.token.info.dto';
import { renderEnumSelectOptions } from '@util/renderUtil';
import {
  AuthorizationDto,
  AuthorizationDtoProps,
} from '../../../dtos/authoriation.dto';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import config from '@util/config';

export const AuthorizationUpsert = () => {
  const params: any = useParams<{ id: string }>();
  const authorizationId = params.id ? params.id : undefined;
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Add these state variables for the edit mutation
  const [updateIdToken, setUpdateIdToken] = useState(false);
  const [idTokenId, setIdTokenId] = useState<number | undefined>(undefined);
  const [idTokenData, setIdTokenData] = useState<any>(undefined);
  const [updateIdTokenInfo, setUpdateIdTokenInfo] = useState(false);
  const [idTokenInfoId, setIdTokenInfoId] = useState<number | undefined>(
    undefined,
  );
  const [idTokenInfoData, setIdTokenInfoData] = useState<any>(undefined);

  const { replace, goBack } = useNavigation();

  const { formProps } = useForm({
    resource: ResourceType.AUTHORIZATIONS,
    id: authorizationId,
    queryOptions: {
      enabled: !!authorizationId,
      onSuccess: (data: GetOneResponse<AuthorizationDto>) => {
        // Set the initial values for the edit mutation when data is loaded
        if (data?.data.idTokenId) {
          setIdTokenId(data?.data.idTokenId);
        }
        if (data?.data?.idTokenInfoId) {
          setIdTokenInfoId(data?.data?.idTokenInfoId);
        }
      },
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
    mutationMeta: {
      gqlVariables: {
        updateIdToken,
        idTokenId,
        idTokenData,
        updateIdTokenInfo,
        idTokenInfoId,
        idTokenInfoData,
      },
    },
  });

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
      if (!authorizationId) {
        const newIdToken = getSerializedValues(
          input[AuthorizationDtoProps.idToken],
          IdTokenDto,
        );
        newIdToken.tenantId = config.tenantId;
        const newIdTokenInfo = getSerializedValues(
          input[AuthorizationDtoProps.idTokenInfo],
          IdTokenInfoDto,
        );
        newIdTokenInfo.tenantId = config.tenantId;
        newIdTokenInfo.cacheExpiryDateTime = undefined;
        const concurrentTx = input[
          AuthorizationDtoProps.concurrentTransaction
        ] as boolean;
        const authoriationInput = {
          [AuthorizationDtoProps.idToken]: newIdToken,
          [AuthorizationDtoProps.idTokenInfo]: newIdTokenInfo,
          [AuthorizationDtoProps.concurrentTransaction]: concurrentTx,
        };
        const newAuthorization: any = getSerializedValues(
          authoriationInput,
          AuthorizationDto,
        );
        newAuthorization.tenantId = config.tenantId;
        const newItem = {
          ...newAuthorization,
          [AuthorizationDtoProps.idToken]: {
            data: {
              ...newIdToken,
            },
          },
          [AuthorizationDtoProps.idTokenInfo]: {
            data: {
              ...newIdTokenInfo,
            },
          },
        };
        formProps.onFinish?.(newItem);
      } else {
        const idTokenInput = input[AuthorizationDtoProps.idToken];
        const idTokenInfoInput = input[AuthorizationDtoProps.idTokenInfo];

        if (idTokenInput && Object.keys(idTokenInput).length > 0 && idTokenId) {
          setUpdateIdToken(true);
          const processedIdTokenData = getSerializedValues(
            idTokenInput,
            IdTokenDto,
          );
          setIdTokenData(processedIdTokenData);
        } else {
          setUpdateIdToken(false);
        }

        if (
          idTokenInfoInput &&
          Object.keys(idTokenInfoInput).length > 0 &&
          idTokenInfoId
        ) {
          setUpdateIdTokenInfo(true);
          const processedIdTokenInfoData = getSerializedValues(
            idTokenInfoInput,
            IdTokenInfoDto,
          );
          setIdTokenInfoData(processedIdTokenInfoData);
        } else {
          setUpdateIdTokenInfo(false);
        }

        const concurrentTx = input[
          AuthorizationDtoProps.concurrentTransaction
        ] as boolean;

        const authorizationInput = {
          [AuthorizationDtoProps.concurrentTransaction]: concurrentTx,
        };

        const updatedAuthorization = getSerializedValues(
          authorizationInput,
          AuthorizationDto,
        );

        formProps.onFinish?.(updatedAuthorization);
      }
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
              key={IdTokenDtoProps.idToken}
              label="Authorization IdToken"
              name={[AuthorizationDtoProps.idToken, IdTokenDtoProps.idToken]}
              rules={[{ required: true, message: 'IdToken is required' }]}
              data-testid={IdTokenDtoProps.idToken}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={AuthorizationDtoProps.concurrentTransaction}
              label="Allow Concurrent Transaction"
              name={AuthorizationDtoProps.concurrentTransaction}
              valuePropName="checked"
              data-testid={AuthorizationDtoProps.concurrentTransaction}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              key={IdTokenDtoProps.type}
              label="IdToken Type"
              name={[AuthorizationDtoProps.idToken, IdTokenDtoProps.type]}
              data-testid={IdTokenDtoProps.type}
            >
              <Select onChange={handleOnChange}>
                {renderEnumSelectOptions(IdTokenEnumType)}
              </Select>
            </Form.Item>
            <Form.Item
              key={IdTokenInfoDtoProps.status}
              label="IdToken Status"
              name={[
                AuthorizationDtoProps.idTokenInfo,
                IdTokenInfoDtoProps.status,
              ]}
              data-testid={IdTokenInfoDtoProps.status}
            >
              <Select onChange={handleOnChange}>
                {renderEnumSelectOptions(AuthorizationStatusEnumType)}
              </Select>
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
