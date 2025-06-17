// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { oauthAuthProvider } from './OAuthAuthProvider';

/**
 * Create request middleware that uses JWT tokens instead of admin secret
 * This replaces the VITE_HASURA_ADMIN_SECRET approach for better security
 */
export const createJWTMiddleware = () => {
  return async (request: any) => {
    const token = await oauthAuthProvider.getToken();

    if (token) {
      if (!token.startsWith('mock_token_')) {
        // For JWT tokens, use Authorization header
        return {
          ...request,
          headers: {
            ...request.headers,
            Authorization: `Bearer ${token}`,
          },
        };
      } else {
        // For mock tokens (legacy mode), fall back to admin secret if available
        // This provides backward compatibility during migration
        const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET;
        if (adminSecret) {
          return {
            ...request,
            headers: {
              ...request.headers,
              'x-hasura-role': 'admin',
              'x-hasura-admin-secret': adminSecret,
            },
          };
        }
      }
    }

    // No authentication available - let Hasura handle it
    return request;
  };
};

/**
 * Create WebSocket connection headers for live queries
 */
export const createWebSocketHeaders = async () => {
  const token = await oauthAuthProvider.getToken();

  if (token) {
    if (!token.startsWith('mock_token_')) {
      // For JWT tokens, use Authorization header
      return {
        Authorization: `Bearer ${token}`,
      };
    } else {
      // For mock tokens (legacy mode), fall back to admin secret if available
      const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET;
      if (adminSecret) {
        return {
          'x-hasura-role': 'admin',
          'x-hasura-admin-secret': adminSecret,
        };
      }
    }
  }

  return {};
};
