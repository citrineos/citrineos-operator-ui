// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Typography,
  message,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@refinedev/core';
import { oauthAuthProvider } from '@util/auth/OAuthAuthProvider';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Enhanced login page with OAuth support
 */
export const OAuthLoginPage: React.FC = () => {
  const { mutate: login, isLoading } = useLogin<LoginFormData>();
  const [form] = Form.useForm();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const availableProviders = oauthAuthProvider.getAvailableProviders();
  const hasOAuthProviders = availableProviders.length > 0;

  const handleCredentialLogin = (values: LoginFormData) => {
    login(values);
  };

  const handleOAuthLogin = async (providerName: string) => {
    try {
      setOauthLoading(providerName);
      await oauthAuthProvider.loginWithProvider(providerName);
    } catch (error) {
      setOauthLoading(null);
      message.error(
        error instanceof Error ? error.message : 'OAuth login failed',
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Welcome to CitrineOS
          </Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        {hasOAuthProviders && (
          <>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {availableProviders.map((provider) => (
                <Button
                  key={provider.name}
                  type="default"
                  size="large"
                  block
                  icon={
                    provider.icon ? (
                      <provider.icon style={{ marginRight: '8px' }} />
                    ) : null
                  }
                  loading={oauthLoading === provider.name}
                  disabled={oauthLoading !== null}
                  onClick={() => handleOAuthLogin(provider.name)}
                  style={{
                    height: '48px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Continue with {provider.displayName}
                </Button>
              ))}
            </Space>

            <Divider>
              <Text type="secondary">or</Text>
            </Divider>
          </>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleCredentialLogin}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '0' }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isLoading}
              disabled={oauthLoading !== null}
              block
              style={{
                height: '48px',
                borderRadius: '6px',
                marginTop: '8px',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {!hasOAuthProviders && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Configure OAuth providers in environment variables to enable
              social login
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};
