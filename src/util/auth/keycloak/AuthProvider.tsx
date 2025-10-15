// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AuthProvider } from '@refinedev/core';
import {
  KeycloakPermissions,
  KeycloakRole,
  KeycloakUserIdentity,
} from './types';
import Keycloak from 'keycloak-js';
import config from '@util/config';
import { AuthenticationContextProvider } from '../types';
import { HasuraClaimType, HasuraHeader, HasuraRole } from '../hasura';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Configuration for the auth provider
 */
export interface KeycloakAuthProviderConfig {
  keycloakUrl: string;
  keycloakRealm: string;
}

const HASURA_CLAIM = config.hasuraClaim;

/**
 * Creates a keycloak auth provider for use with Refine
 */
export const createKeycloakAuthProvider = (
  authProviderConfig: KeycloakAuthProviderConfig,
): AuthProvider & AuthenticationContextProvider => {
  const { keycloakUrl, keycloakRealm } = authProviderConfig;

  const keycloakConfig = {
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: 'operator-ui',
  };

  const keycloak = new Keycloak(keycloakConfig);
  const initialized = keycloak.init({
    onLoad: 'check-sso', // Check if the user is already logged in -- fails silently and doesn't redirect
    checkLoginIframe: false,
    pkceMethod: 'S256',
  });

  const getInitialized = (): Promise<boolean> => {
    return initialized;
  };

  const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const doLogin = async () => {
        try {
          const loginResponse = await login();

          if (loginResponse.success && loginResponse.redirectTo) {
            navigate(loginResponse.redirectTo, { replace: true });
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      };

      doLogin();
    }, [navigate]);

    return <div>Redirecting to Keycloak login...</div>;
  };

  const login = async () => {
    await initialized;

    const urlSearchParams = new URLSearchParams(window.location.search);
    const { to } = Object.fromEntries(urlSearchParams.entries());
    const redirectPath = to ? `${to}` : `/overview`;

    if (keycloak.authenticated) {
      return {
        success: true,
        redirectTo: redirectPath,
      };
    }
    try {
      await keycloak.login({
        redirectUri: `${window.location.origin}${redirectPath}`,
      });

      // This line normally won't execute as Keycloak redirects the page
      return {
        success: true,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: new Error('Login failed'),
      };
    }
  };

  /**
   * Get token from storage
   */
  const getToken = async (): Promise<string | undefined> => {
    // Try to refresh the token if it's about to expire
    try {
      // Refresh token if it has less than 30 seconds remaining
      await keycloak.updateToken(30);
      return keycloak.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return;
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (permissions: KeycloakPermissions, role: string): boolean => {
    if (!permissions.resources?.['operator-ui']) {
      return false;
    }
    return permissions.resources['operator-ui'].includes(role);
  };

  /**
   * Get the highest priority role for the user
   */
  const getUserRole = async (
    permissions?: KeycloakPermissions,
  ): Promise<'admin' | 'user' | undefined> => {
    if (permissions) {
      if (hasRole(permissions, 'admin')) {
        return 'admin';
      }
      if (hasRole(permissions, 'user')) {
        return 'user';
      }
    }
  };

  /**
   * Get the Hasura role from the identity
   */
  const getHasuraHeaders = async (): Promise<Map<HasuraHeader, string>> => {
    const hasuraHeaders = new Map<HasuraHeader, string>();
    const tokenParsed = keycloak.tokenParsed;
    if (!tokenParsed) {
      return hasuraHeaders;
    }
    const hasuraClaims = HASURA_CLAIM && tokenParsed[HASURA_CLAIM];
    if (!hasuraClaims) {
      return hasuraHeaders;
    }

    const roles = hasuraClaims[HasuraClaimType.X_HARSURA_ALLOWED_ROLES];
    if (roles && roles.length > 0 && roles.includes(KeycloakRole.ADMIN)) {
      hasuraHeaders.set(HasuraHeader.X_HASURA_ROLE, HasuraRole.ADMIN);
    } else {
      hasuraHeaders.set(HasuraHeader.X_HASURA_ROLE, HasuraRole.USER);
    }

    return hasuraHeaders;
  };

  // Return the auth provider implementation
  return {
    login,

    logout: async () => {
      try {
        await keycloak.logout({
          redirectUri: `${window.location.origin}/login`,
        });

        return {
          success: true,
          redirectTo: '/login',
        };
      } catch (error) {
        return {
          success: false,
          error: new Error('Logout failed'),
        };
      }
    },

    onError: async (error) => {
      // Check for 401 Unauthorized errors
      if (error.statusCode === 401) {
        try {
          // Try to refresh the token
          const refreshed = await keycloak.updateToken(30);

          if (refreshed) {
            // If token was refreshed successfully, retry the request
            return {
              error: new Error('Token refreshed, please retry the request'),
            };
          }

          // If token couldn't be refreshed, log out
          return {
            logout: true,
          };
        } catch (refreshError) {
          // If refresh fails, log out
          return {
            logout: true,
          };
        }
      }

      // For other errors, pass through
      return { error };
    },

    check: async () => {
      try {
        // If not authenticated, redirect to login
        if (!keycloak.authenticated) {
          console.warn('User not authenticated, redirecting to login');
          return {
            authenticated: false,
            logout: true,
            redirectTo: '/login',
            error: {
              message: 'Not authenticated',
              name: 'Authentication Error',
            },
          };
        }

        // Try to refresh the token if it's about to expire
        try {
          // Refresh token if it has less than 5 minutes remaining
          await keycloak.updateToken(300);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          return {
            authenticated: false,
            logout: true,
            redirectTo: '/login',
            error: {
              message: 'Token refresh failed',
              name: 'Authentication Error',
            },
          };
        }

        return {
          authenticated: true,
        };
      } catch (error) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: '/login',
          error: {
            message: 'Check failed',
            name: 'Authentication Error',
          },
        };
      }
    },

    getIdentity: async () => {
      if (!keycloak?.tokenParsed) {
        return null;
      }

      const identity: KeycloakUserIdentity = {
        id: keycloak.tokenParsed.sub! || keycloak.tokenParsed.id,
        name:
          keycloak.tokenParsed.name || keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        avatar: keycloak.tokenParsed.picture,
        // Get tenant ID from token or use current tenant
        tenantId: keycloak.tokenParsed.tenant_id || keycloak.realm,
        // Include roles directly for easier access in UI
        roles: keycloak.tokenParsed.realm_access?.roles || [],
      };

      return identity;
    },

    getPermissions: async (): Promise<KeycloakPermissions | null> => {
      // Check if the user is authenticated and token is parsed
      if (!keycloak.authenticated || !keycloak.tokenParsed) {
        return null;
      }

      // Extract tenant information from token - customize based on your token structure
      const tenants =
        (keycloak.tokenParsed.tenants as string[]) ||
        (keycloak.tokenParsed.tenant_id
          ? [keycloak.tokenParsed.tenant_id]
          : []);

      // If no tenants in token but realm exists, use realm as default tenant
      if (tenants.length === 0 && keycloak.realm) {
        tenants.push(keycloak.realm);
      }

      // Get global roles from token
      const roles: KeycloakRole[] =
        keycloak.tokenParsed.realm_access?.roles.map(
          (role) => KeycloakRole[role as keyof typeof KeycloakRole],
        ) || [];

      const permissions: KeycloakPermissions = {
        tenants,
        roles,
        // Get client-specific roles (resource-specific permissions)
        resources: {},
      };

      // Extract client-specific roles if they exist
      if (keycloak.tokenParsed.resource_access) {
        const resourceAccess = keycloak.tokenParsed.resource_access as Record<
          string,
          { roles: string[] }
        >;

        // Map each client to its roles
        Object.keys(resourceAccess).forEach((clientId) => {
          permissions.resources![clientId] =
            resourceAccess[clientId].roles || [];
        });
      }

      return permissions;
    },

    // AuthenticationContextProvider methods

    getToken,
    getUserRole,
    getHasuraHeaders,
    getInitialized,
    getLoginPage: () => LoginPage,
  };
};
