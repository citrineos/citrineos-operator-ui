// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

/**
 * JWT utility functions for parsing and validating tokens
 */

/**
 * Parse JWT token and extract payload
 * @param token - JWT token string
 * @returns Decoded token payload or empty object if parsing fails
 */
export const parseJwt = (token: string): any => {
  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return {};
    }

    // Get payload part
    const base64Url = parts[1];
    if (!base64Url) {
      return {};
    }

    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64 to JSON string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return {};
  }
};

/**
 * Extract a specific claim from JWT token
 * @param token - JWT token string or parsed payload
 * @param claimPath - Claim path (e.g., 'https://hasura.io/jwt/claims')
 * @returns Claim value or null if not found
 */
export const getTokenClaim = (token: string | any, claimPath: string): any => {
  try {
    const payload = typeof token === 'string' ? parseJwt(token) : token;
    return payload[claimPath] || null;
  } catch (error) {
    console.error('Failed to get token claim:', error);
    return null;
  }
};
