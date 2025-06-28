// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, Navigate } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { oauthAuthProvider } from '@util/auth/OAuthAuthProvider';

/**
 * Component to handle OAuth callback and exchange code for token
 */
export const OAuthCallbackHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(`OAuth error: ${errorParam}`);
        }

        if (!code || !state || !provider) {
          throw new Error('Missing required OAuth parameters');
        }

        await oauthAuthProvider.handleOAuthCallback(code, state, provider);
        setSuccess(true);
      } catch (err) {
        console.error('OAuth callback failed:', err);
        setError(
          err instanceof Error ? err.message : 'OAuth authentication failed',
        );
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, provider]);

  if (success) {
    return <Navigate to="/overview" replace />;
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Spin size="large" />
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
        }}
      >
        <Alert
          message="Authentication Failed"
          description={error}
          type="error"
          showIcon
          action={<a href="/login">Return to Login</a>}
        />
      </div>
    );
  }

  return null;
};
