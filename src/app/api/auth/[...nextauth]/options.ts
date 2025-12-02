// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import config from '@lib/utils/config';
import { parseJwt } from '@lib/utils/jwt';

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: config.keycloakClientId!,
      clientSecret: config.keycloakClientSecret!,
      issuer: `${config.keycloakUrl!}/realms/${config.keycloakRealm!}`,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to overview page after successful login
      // If the url is the callback from Keycloak or the signin page, redirect to overview
      if (url.startsWith(baseUrl)) {
        // Check if it's a callback or sign-in, redirect to overview
        if (
          url.includes('/api/auth/callback') ||
          url.includes('/api/auth/signin')
        ) {
          return `${baseUrl}/overview`;
        }
        return url;
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Default to overview page for any other case
      return `${baseUrl}/overview`;
    },
    async jwt({ token, account, profile }) {
      // Store Keycloak tokens in JWT
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;

        // Parse access token to get roles
        if (account.access_token) {
          const accessTokenParsed = parseJwt(account.access_token as string);
          // Extract client roles from resource_access
          token.roles =
            accessTokenParsed.resource_access?.[config.keycloakClientId!]
              ?.roles || [];
          // Extract tenant_id
          token.tenantId = accessTokenParsed.tenant_id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass JWT info to client session
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session.user as any).tenantId = token.tenantId;
      }
      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};

export default authOptions;
