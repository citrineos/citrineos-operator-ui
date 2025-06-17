// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  avatar_url?: string;
  verified_email?: boolean;
  login?: string; // GitHub username
}

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  provider: string;
}

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  provider: string;
  iat: number;
  exp: number;
  'https://hasura.io/jwt/claims': {
    'x-hasura-default-role': string;
    'x-hasura-allowed-roles': string[];
    'x-hasura-user-id': string;
  };
}

interface OAuthCallbackRequest {
  code: string;
  state: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope?: string;
}

// OAuth provider configurations
const OAUTH_PROVIDERS: Record<string, OAuthConfig> = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:5173/auth/callback/google',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri:
      process.env.GITHUB_REDIRECT_URI ||
      'http://localhost:5173/auth/callback/github',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scope: 'user:email',
  },
  gitlab: {
    clientId: process.env.GITLAB_CLIENT_ID || '',
    clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
    redirectUri:
      process.env.GITLAB_REDIRECT_URI ||
      'http://localhost:5173/auth/callback/gitlab',
    tokenUrl: 'https://gitlab.com/oauth/token',
    userInfoUrl: 'https://gitlab.com/api/v4/user',
    scope: 'read_user',
  },
};

const app = express();
const PORT = Number(process.env.PORT) || 8088;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const DEFAULT_ROLE = process.env.DEFAULT_USER_ROLE || 'admin';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to normalize user data across providers
function normalizeUserData(provider: string, userData: UserInfo): User {
  let id: string;
  let email: string;
  let name: string;

  switch (provider) {
    case 'google':
      id = userData.id;
      email = userData.email;
      name = userData.name;
      break;
    case 'github':
      id = userData.id.toString();
      email = userData.email || '';
      name = userData.name || userData.login || '';
      break;
    case 'gitlab':
      id = userData.id.toString();
      email = userData.email;
      name = userData.name;
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  return {
    id,
    email,
    name,
    roles: [DEFAULT_ROLE],
    provider,
  };
}

// OAuth callback endpoint
app.post(
  '/auth/oauth/callback/:provider',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.params;
      const { code, state }: OAuthCallbackRequest = req.body;

      console.log(`OAuth callback for ${provider}:`, {
        code: code?.substring(0, 20) + '...',
        state,
      });

      // Check if provider is supported
      const oauthConfig = OAUTH_PROVIDERS[provider];
      if (!oauthConfig) {
        res.status(400).json({
          error: 'Unsupported provider',
          message: `Provider ${provider} is not supported`,
        });
        return;
      }

      // Check if provider is configured
      if (!oauthConfig.clientId || !oauthConfig.clientSecret) {
        res.status(500).json({
          error: 'Provider not configured',
          message: `OAuth provider ${provider} is not properly configured`,
        });
        return;
      }

      if (!code) {
        res.status(400).json({
          error: 'Missing authorization code',
          message: 'Authorization code is required',
        });
        return;
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          client_id: oauthConfig.clientId,
          client_secret: oauthConfig.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: oauthConfig.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
      }

      const tokenData = (await tokenResponse.json()) as TokenResponse;
      const { access_token } = tokenData;
      console.log(`Got access token from ${provider}`);

      // Get user info from provider
      const userResponse = await fetch(oauthConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(`User info fetch failed: ${userResponse.statusText}`);
      }

      const userData = (await userResponse.json()) as UserInfo;
      console.log(`Got user info from ${provider}:`, {
        email: userData.email,
        name: userData.name || userData.login,
      });

      // Normalize user data across providers
      const user = normalizeUserData(provider, userData);

      // Generate JWT token
      const jwtPayload: JWTPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        provider: user.provider,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': DEFAULT_ROLE,
          'x-hasura-allowed-roles': [DEFAULT_ROLE],
          'x-hasura-user-id': user.id,
        },
      };

      const token = jwt.sign(jwtPayload, JWT_SECRET);
      console.log('Generated JWT token');

      res.json({
        token,
        user,
      });
    } catch (error) {
      console.error(
        'OAuth callback error:',
        error instanceof Error ? error.message : String(error),
      );
      res.status(500).json({
        error: 'OAuth callback failed',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },
);

// Get available providers endpoint
app.get('/auth/providers', (req: Request, res: Response): void => {
  const availableProviders = Object.keys(OAUTH_PROVIDERS).filter((provider) => {
    const config = OAUTH_PROVIDERS[provider];
    return config.clientId && config.clientSecret;
  });

  res.json({
    providers: availableProviders,
    configuration: Object.fromEntries(
      availableProviders.map((provider) => [
        provider,
        {
          clientId: OAUTH_PROVIDERS[provider].clientId,
          redirectUri: OAUTH_PROVIDERS[provider].redirectUri,
          scope: OAUTH_PROVIDERS[provider].scope,
        },
      ]),
    ),
  });
});

// Token refresh endpoint
app.post(
  '/auth/refresh',
  (req: Request<{}, {}, RefreshTokenRequest>, res: Response): void => {
    const { refreshToken } = req.body;

    // For simplicity, we'll just return an error
    // In a real implementation, you'd validate the refresh token and issue a new JWT
    res.status(401).json({
      error: 'Refresh not implemented',
      message: 'Please login again',
    });
  },
);

// Logout endpoint
app.post('/auth/logout', (req: Request, res: Response): void => {
  // In a real implementation, you might blacklist the token
  console.log('User logged out');
  res.json({ success: true });
});

// Health check
app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok', service: 'OAuth Backend' });
});

// Error handling middleware
app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  },
);

app.listen(PORT, (): void => {
  console.log(`OAuth backend running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`  POST http://localhost:${PORT}/auth/oauth/callback/:provider`);
  console.log(`  GET  http://localhost:${PORT}/auth/providers`);
  console.log(`  POST http://localhost:${PORT}/auth/refresh`);
  console.log(`  POST http://localhost:${PORT}/auth/logout`);
  console.log(`  GET  http://localhost:${PORT}/health`);

  // Check configured providers
  const configuredProviders = Object.keys(OAUTH_PROVIDERS).filter(
    (provider) => {
      const config = OAUTH_PROVIDERS[provider];
      return config.clientId && config.clientSecret;
    },
  );

  if (configuredProviders.length === 0) {
    console.log('\n⚠️  WARNING: No OAuth providers are configured!');
    console.log(
      '   Configure at least one provider with environment variables:',
    );
    console.log('   - Google: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
    console.log('   - GitHub: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET');
    console.log('   - GitLab: GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET');
  } else {
    console.log(
      `\n✅ Configured OAuth providers: ${configuredProviders.join(', ')}`,
    );
  }
});
