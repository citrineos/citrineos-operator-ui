import { useForm } from '@refinedev/antd';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_SHOW_QUERY,
} from '../queries';
import { useNavigation } from '@refinedev/core';
import { getSerializedValues } from '@util/middleware';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import { ResourceType } from '../../../resource-type';
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

export const AuthorizationUpsert = () => {
  const params: any = useParams<{ id: string }>();
  const authorizationId = params.id ? params.id : undefined;
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { replace, goBack } = useNavigation();

  const { formProps } = useForm({
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
      const idTokenInput = {
        idToken: input[IdTokenDtoProps.idToken],
        type: input[IdTokenDtoProps.type],
      };
      console.log('idTokenInput', idTokenInput);
      const newIdToken = getSerializedValues(idTokenInput, IdTokenDto);
      const idTokenInfoInput = { status: input[IdTokenInfoDtoProps.status] };
      console.log('idTokenInfoInput', idTokenInfoInput);
      const newIdTokenInfo = getSerializedValues(
        idTokenInfoInput,
        IdTokenInfoDto,
      );
      const authoriationInput = {
        [AuthorizationDtoProps.idToken]: newIdToken,
        [AuthorizationDtoProps.idTokenInfo]: newIdTokenInfo,
      };
      console.log('authoriationInput', authoriationInput);
      const newItem: any = getSerializedValues(
        authoriationInput,
        AuthorizationDto,
      );
      formProps.onFinish?.(newItem);
    },
    [formProps],
  );

  return (
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
              {authorizationId ? 'Edit Authorization' : 'Create Authorization'}
            </h3>
          </Flex>
          <Form.Item
            key={IdTokenDtoProps.idToken}
            label="Authorization IdToken"
            name={IdTokenDtoProps.idToken}
            rules={[{ required: true, message: 'IdToken is required' }]}
            data-testid={IdTokenDtoProps.idToken}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key={IdTokenDtoProps.type}
            label="IdToken Type"
            name={IdTokenDtoProps.type}
            data-testid={IdTokenDtoProps.type}
          >
            <Select onChange={handleOnChange}>
              {renderEnumSelectOptions(IdTokenEnumType)}
            </Select>
          </Form.Item>
          <Form.Item
            key={IdTokenInfoDtoProps.status}
            label="IdToken Status"
            name={IdTokenInfoDtoProps.status}
            data-testid={IdTokenInfoDtoProps.status}
            hidden
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
  );
};
