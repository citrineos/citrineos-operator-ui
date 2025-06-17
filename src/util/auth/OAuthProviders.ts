// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { OAuthProvider } from './types';
import { FaGoogle, FaGithub, FaGitlab } from 'react-icons/fa';

/**
 * OAuth provider configurations
 * These providers are automatically enabled when their client IDs are configured in environment variables:
 * - Google: VITE_OAUTH_GOOGLE_CLIENT_ID
 * - GitHub: VITE_OAUTH_GITHUB_CLIENT_ID
 * - GitLab: VITE_OAUTH_GITLAB_CLIENT_ID
 */
export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    name: 'google',
    clientId: '', // Will be set from environment
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    icon: FaGoogle,
    displayName: 'Google',
  },
  github: {
    name: 'github',
    clientId: '', // Will be set from environment
    redirectUri: `${window.location.origin}/auth/callback/github`,
    scope: 'user:email',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    icon: FaGithub,
    displayName: 'GitHub',
  },
  gitlab: {
    name: 'gitlab',
    clientId: '', // Will be set from environment
    redirectUri: `${window.location.origin}/auth/callback/gitlab`,
    scope: 'read_user email',
    authUrl: 'https://gitlab.com/oauth/authorize',
    tokenUrl: 'https://gitlab.com/oauth/token',
    userInfoUrl: 'https://gitlab.com/api/v4/user',
    icon: FaGitlab,
    displayName: 'GitLab',
  },
};

/**
 * Generate OAuth authorization URL
 */
export const generateAuthUrl = (provider: OAuthProvider): string => {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    scope: provider.scope,
    response_type: 'code',
    state: generateRandomState(),
  });

  return `${provider.authUrl}?${params.toString()}`;
};

/**
 * Generate random state for OAuth security
 */
export const generateRandomState = (): string => {
  return btoa(crypto.getRandomValues(new Uint8Array(32)).toString());
};

/**
 * Validate OAuth state parameter
 */
export const validateState = (state: string): boolean => {
  const storedState = sessionStorage.getItem('oauth_state');
  return storedState === state;
};

/**
 * Store OAuth state for validation
 */
export const storeState = (state: string): void => {
  sessionStorage.setItem('oauth_state', state);
};

/**
 * Clear OAuth state
 */
export const clearState = (): void => {
  sessionStorage.removeItem('oauth_state');
};
