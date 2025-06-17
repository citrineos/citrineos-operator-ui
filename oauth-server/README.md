# CitrineOS OAuth Authentication Setup

This comprehensive guide covers the complete OAuth authentication setup for CitrineOS, providing a secure alternative to the `VITE_HASURA_ADMIN_SECRET` approach.

## Overview

The OAuth implementation includes:
- **Frontend OAuth Integration**: Secure authentication with multiple providers
- **Backend OAuth Service**: JWT token generation with Hasura claims
- **Multiple Providers**: Google, GitHub, GitLab support
- **Security**: JWT-based authentication replacing exposed admin secrets

## Quick Start

If you already have a Google OAuth Client ID configured:

✅ **Prerequisites:**
- Google OAuth Client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
- Redirect URI configured: `http://localhost:5173/auth/callback/google`

Jump to [Step 3: Configure OAuth Backend](#step-3-configure-oauth-backend).

## Complete Setup Guide

### Step 1: Set Up Google OAuth (New Projects)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Select **Web application**
6. Add these to **Authorized redirect URIs**:
   - `http://localhost:5173/auth/callback/google`
   - `https://yourdomain.com/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Frontend Environment

Add your Google OAuth Client ID to the main `.env` file:

```env
# Google OAuth
VITE_OAUTH_GOOGLE_CLIENT_ID=your_actual_google_client_id_here

# OAuth Server Configuration
VITE_OAUTH_SERVER_URL=http://localhost:8088
```

### Step 3: Configure OAuth Backend

#### Install Dependencies

```bash
cd oauth-server
npm install
```

#### Set Up Environment

```bash
cp .env.example .env
```

Edit `oauth-server/.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback/google

# Server Configuration
JWT_SECRET=your-super-secure-random-key-here
PORT=8088
DEFAULT_USER_ROLE=admin
```

#### Get Your Google Client Secret

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`)
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth client ID
5. Copy the **Client Secret** (not the Client ID)

#### Start the OAuth Server

For development with hot-reload:
```bash
npm run dev
```

For production:
```bash
npm run prod
```

The server will start on `http://localhost:8088`

### Step 4: Start Frontend

```bash
# From the main project directory
npm run dev
```

## Testing OAuth

1. Go to `http://localhost:5173/login`
2. You should see a "Continue with Google" button
3. Click it to test the OAuth flow
4. You should be redirected to Google, then back to the app

## Architecture

```
Frontend (port 5173)     OAuth Server (port 8088)     Google OAuth
     │                          │                          │
     │── OAuth Login ───────────│                          │
     │                          │─── Exchange Code ───────│
     │                          │                          │
     │                          │◄─── User Info ──────────│
     │◄─── JWT Token ───────────│                          │
```

## API Endpoints

### POST `/auth/oauth/callback/google`
Handles Google OAuth callback and returns JWT token.

**Request:**
```json
{
  "code": "oauth_authorization_code",
  "state": "oauth_state_parameter"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "roles": ["admin"],
    "provider": "google"
  }
}
```

### POST `/auth/refresh`
Token refresh endpoint (currently returns error - login again required).

### POST `/auth/logout`
Logout endpoint (currently just logs the event).

### GET `/health`
Health check endpoint.

## JWT Token Structure

The generated JWT tokens include:
- Standard claims (sub, email, name, etc.)
- Custom roles array
- Hasura-specific claims for GraphQL authorization
- 24-hour expiration

## Additional OAuth Providers

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:5173/auth/callback/github`
4. Add to main `.env`: `VITE_OAUTH_GITHUB_CLIENT_ID=your_github_client_id`
5. Add to `oauth-server/.env`: `GITHUB_CLIENT_ID=...` and `GITHUB_CLIENT_SECRET=...`

### GitLab OAuth
1. Go to [GitLab Applications](https://gitlab.com/-/profile/applications)
2. Create a new application
3. Set Redirect URI to: `http://localhost:5173/auth/callback/gitlab`
4. Add to main `.env`: `VITE_OAUTH_GITLAB_CLIENT_ID=your_gitlab_client_id`
5. Add to `oauth-server/.env`: `GITLAB_CLIENT_ID=...` and `GITLAB_CLIENT_SECRET=...`

## Troubleshooting

### "Route POST:/auth/oauth/callback/google not found"
- Make sure the OAuth server is running on port 8088
- Check that `VITE_OAUTH_SERVER_URL=http://localhost:8088` is set in main `.env`
- Restart the frontend after changing environment variables

### "OAuth callback failed" error
- Verify your Google client secret is correct in `oauth-server/.env`
- Check the redirect URI matches exactly in Google Cloud Console
- Ensure both servers are running

### No Google button showing
- Make sure `VITE_OAUTH_GOOGLE_CLIENT_ID` is set in the main `.env` file
- Restart the frontend after changing environment variables
- Check browser console for any errors

### CORS errors
- The OAuth server includes CORS middleware to allow requests from any origin
- If you need to restrict origins, modify the CORS configuration in `oauth-server/server.ts`

## Security Notes

- **Client Secret**: Keep your Google client secret secure and never commit it to version control
- **JWT Secret**: Use a strong, random secret for JWT signing in `oauth-server/.env`
- **HTTPS**: Use HTTPS in production
- **Token Expiration**: JWT tokens expire after 24 hours
- **Admin Secret**: The OAuth implementation automatically replaces the insecure `VITE_HASURA_ADMIN_SECRET` approach with secure JWT tokens

## Production Deployment

For production use:

1. **Environment Variables**: Set all secrets via environment variables, not `.env` files
2. **HTTPS**: Use HTTPS for both frontend and OAuth server
3. **Domain Configuration**: Update redirect URIs to use your production domain
4. **JWT Secret**: Use a cryptographically secure random JWT secret
5. **CORS**: Restrict CORS origins to your specific domains
6. **Integration**: Consider integrating the OAuth server into your main backend

## Next Steps

Once OAuth is working:

1. **Integration**: You can integrate this OAuth server into your main CitrineOS backend
2. **Customization**: Customize user roles and permissions in `oauth-server/server.ts`
3. **Refresh Tokens**: Add refresh token functionality for better user experience
4. **Monitoring**: Add logging and monitoring for OAuth flows
5. **Multi-tenancy**: Configure tenant-specific OAuth if needed

## Getting Help

- Review `src/util/auth/README.md` for frontend implementation details
- Check the browser console for detailed error messages during development
