// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { OAuthProvider, JWTPayload, User } from './types';
import {
  generateAuthUrl,
  storeState,
  validateState,
  clearState,
} from './OAuthProviders';

/**
 * OAuth Service for handling OAuth authentication flow
 */
export class OAuthService {
  private backendUrl: string;

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  /**
   * Initiate OAuth login flow
   */
  async initiateLogin(provider: OAuthProvider): Promise<void> {
    try {
      const authUrl = generateAuthUrl(provider);
      const urlObj = new URL(authUrl);
      const state = urlObj.searchParams.get('state');

      if (state) {
        storeState(state);
      }

      // Redirect to OAuth provider
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth login:', error);
      throw new Error('Failed to initiate OAuth login');
    }
  }

  /**
   * Handle OAuth callback and exchange code for JWT token
   */
  async handleCallback(
    code: string,
    state: string,
    provider: string,
  ): Promise<{
    user: User;
    token: string;
  }> {
    try {
      // Validate state parameter
      if (!validateState(state)) {
        throw new Error('Invalid OAuth state parameter');
      }

      // Clear stored state
      clearState();

      // Exchange code for token via backend
      const response = await fetch(
        `${this.backendUrl}/auth/oauth/callback/${provider}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OAuth callback failed');
      }

      const data = await response.json();

      if (!data.token || !data.user) {
        throw new Error('Invalid response from OAuth callback');
      }

      // Validate JWT token
      const payload = this.parseJWT(data.token);
      if (!payload) {
        throw new Error('Invalid JWT token received');
      }

      return {
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Parse JWT token and extract payload
   */
  parseJWT(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload as JWTPayload;
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  /**
   * Check if JWT token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.parseJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Refresh JWT token if refresh token is available
   */
  async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.backendUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.token || null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Logout user and revoke tokens
   */
  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.backendUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Continue with local logout even if backend call fails
    }
  }

  /**
   * Get user information from JWT token
   */
  getUserFromToken(token: string): User | null {
    const payload = this.parseJWT(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: payload.roles,
      provider: payload.provider,
    };
  }
}
