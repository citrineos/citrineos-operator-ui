// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AuthProvider } from '@refinedev/core';
import { AuthenticationContextProvider, User, OAuthProvider } from './types';
import { OAUTH_PROVIDERS } from './OAuthProviders';
import { OAuthService } from './OAuthService';
import appConfig from '@util/config';

/**
 * Configuration for the OAuth auth provider
 */
export interface OAuthAuthProviderConfig {
  tokenKey?: string;
  userKey?: string;
  backendUrl?: string;
  enabledProviders?: string[];
  fallbackToCredentials?: boolean;
}

/**
 * Creates an OAuth-enabled auth provider that supports multiple OAuth providers
 * and maintains compatibility with existing credential-based authentication
 */
const createOAuthAuthProvider = (
  config: OAuthAuthProviderConfig = {},
): AuthProvider &
  AuthenticationContextProvider & {
    getAvailableProviders: () => OAuthProvider[];
    loginWithProvider: (providerName: string) => Promise<void>;
    handleOAuthCallback: (
      code: string,
      state: string,
      provider: string,
    ) => Promise<void>;
  } => {
  const {
    tokenKey = 'auth_token',
    userKey = 'auth_user',
    backendUrl = appConfig.oauthServerUrl,
    enabledProviders = ['google'], // Only Google by default
    fallbackToCredentials = true,
  } = config;

  const oauthService = new OAuthService(backendUrl);

  /**
   * Save token to storage
   */
  const saveToken = (token: string): void => {
    localStorage.setItem(tokenKey, token);
  };

  /**
   * Get token from storage
   */
  const getToken = async (): Promise<string | null> => {
    return localStorage.getItem(tokenKey);
  };

  /**
   * Save user to storage
   */
  const saveUser = (user: User): void => {
    localStorage.setItem(userKey, JSON.stringify(user));
  };

  /**
   * Get user from storage
   */
  const getUser = (): User | null => {
    const userStr = localStorage.getItem(userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      return null;
    }
  };

  /**
   * Clear all authentication data
   */
  const clearAuthData = (): void => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  };

  /**
   * Get available OAuth providers
   * Only returns providers that have client IDs configured
   */
  const getAvailableProviders = (): OAuthProvider[] => {
    return enabledProviders
      .map((name) => OAUTH_PROVIDERS[name])
      .filter(Boolean)
      .map((provider) => ({
        ...provider,
        clientId: getProviderClientId(provider.name),
      }))
      .filter(
        (provider) => provider.clientId && provider.clientId.trim() !== '',
      );
  };

  /**
   * Get client ID for provider from environment
   */
  const getProviderClientId = (providerName: string): string => {
    const envKey = `VITE_OAUTH_${providerName.toUpperCase()}_CLIENT_ID`;
    return import.meta.env[envKey] || '';
  };

  /**
   * Login with OAuth provider
   */
  const loginWithProvider = async (providerName: string): Promise<void> => {
    const provider = OAUTH_PROVIDERS[providerName];
    if (!provider) {
      throw new Error(`OAuth provider ${providerName} not found`);
    }

    const providerWithClientId = {
      ...provider,
      clientId: getProviderClientId(providerName),
    };

    if (!providerWithClientId.clientId) {
      throw new Error(`Client ID not configured for ${providerName}`);
    }

    await oauthService.initiateLogin(providerWithClientId);
  };

  /**
   * Handle OAuth callback
   */
  const handleOAuthCallback = async (
    code: string,
    state: string,
    provider: string,
  ): Promise<void> => {
    try {
      const { user, token } = await oauthService.handleCallback(
        code,
        state,
        provider,
      );

      saveToken(token);
      saveUser(user);

      // Redirect to main app
      window.location.href = '/overview';
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }
  };

  /**
   * Get permissions based on user roles
   */
  const getPermissions = async () => {
    const user = getUser();
    return {
      roles: user?.roles || [],
    };
  };

  // Return the auth provider implementation
  return {
    login: async ({ email, password, provider }) => {
      // If provider is specified, use OAuth
      if (provider) {
        try {
          await loginWithProvider(provider);
          return {
            success: true,
            redirectTo: '/overview',
          };
        } catch (error) {
          return {
            success: false,
            error: {
              message:
                error instanceof Error ? error.message : 'OAuth login failed',
              name: 'OAuth Error',
            },
          };
        }
      }

      // Fallback to credential-based authentication if enabled
      if (!fallbackToCredentials) {
        return {
          success: false,
          error: {
            message: 'Credential login is disabled',
            name: 'Authentication Error',
          },
        };
      }

      // Legacy credential authentication (for backward compatibility)
      const ADMIN_EMAIL = appConfig.adminEmail;
      const ADMIN_PASSWORD = appConfig.adminPassword;

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return {
          success: false,
          error: {
            message: 'Login failed',
            name: 'Invalid email or password',
          },
        };
      }

      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: ADMIN_EMAIL,
        roles: ['admin'],
        provider: 'credentials',
      };

      const mockToken = 'mock_token_' + Math.random().toString(36).slice(2);
      saveToken(mockToken);
      saveUser(adminUser);

      return {
        success: true,
        redirectTo: '/overview',
      };
    },

    logout: async () => {
      const token = await getToken();

      if (token && !token.startsWith('mock_token_')) {
        // For real JWT tokens, notify backend
        try {
          await oauthService.logout(token);
        } catch (error) {
          console.error('Backend logout failed:', error);
        }
      }

      clearAuthData();

      return {
        success: true,
        redirectTo: '/login',
      };
    },

    check: async () => {
      const token = await getToken();

      if (!token) {
        return {
          authenticated: false,
          redirectTo: '/login',
          error: {
            message: 'Not authenticated',
            name: 'Authentication Error',
          },
        };
      }

      // For JWT tokens, check expiration
      if (!token.startsWith('mock_token_')) {
        if (oauthService.isTokenExpired(token)) {
          // Token expired and refresh failed
          clearAuthData();
          return {
            authenticated: false,
            redirectTo: '/login',
            error: {
              message: 'Session expired',
              name: 'Authentication Error',
            },
          };
        }
      }

      return { authenticated: true };
    },

    onError: async (error) => {
      console.log(`AuthProvider: onError triggered, error: ${error}`);

      // Only logout for auth errors, not schema validation errors
      if (error.statusCode === 401) {
        return { logout: true };
      }

      // For other errors, just return an error without logging out
      return {
        error: {
          message: error.message,
          name: error.name,
        },
      };
    },

    getIdentity: async () => {
      const user = getUser();
      if (!user) return null;
      return user;
    },

    getPermissions,
    getToken,
    getAvailableProviders,
    loginWithProvider,
    handleOAuthCallback,
  };
};

export const oauthAuthProvider = createOAuthAuthProvider();
export { createOAuthAuthProvider };
