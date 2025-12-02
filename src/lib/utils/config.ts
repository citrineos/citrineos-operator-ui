// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

const getConfig: () => {
  appName: string;
  googleMapsApiKey: string;
  googleMapsAddressApiKey: string;
  googleMapsLocationPickerMapId?: string;
  googleMapsOverviewMapId?: string;
  hasuraAdminSecret?: string;
  hasuraClaim?: string;
  tenantId: string;
  apiUrl: string;
  wsUrl: string;
  citrineCoreUrl?: string;
  fileServer?: string;
  logoUrl?: string;
  metricsUrl?: string;
  adminEmail?: string;
  adminPassword?: string;
  keycloakUrl?: string;
  keycloakRealm?: string;
  keycloakClientId?: string;
  keycloakClientSecret?: string;
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsSessionToken?: string; // Optional. Needed for temporary credentials
  awsS3BucketName?: string;
  awsS3CoreBucketName?: string;
} = () => {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'CitrineOS',
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
    googleMapsAddressApiKey:
      process.env.GOOGLE_MAPS_ADDRESS_API_KEY ||
      'YOUR_GOOGLE_MAPS_ADDRESS_API_KEY',
    googleMapsLocationPickerMapId:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_LOCATION_PICKER_MAP_ID ||
      'location-picker-map-id',
    googleMapsOverviewMapId:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_OVERVIEW_MAP_ID || 'overview-map-id',
    hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET,
    hasuraClaim:
      process.env.NEXT_PUBLIC_HASURA_CLAIM || 'https://hasura.io/jwt/claims',
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '1',
    apiUrl:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/v1/graphql',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8090/v1/graphql',
    citrineCoreUrl: process.env.NEXT_PUBLIC_CITRINE_CORE_URL,
    fileServer: process.env.NEXT_PUBLIC_FILE_SERVER_URL,
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL,
    metricsUrl: process.env.NEXT_PUBLIC_METRICS_URL,
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    keycloakUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    keycloakRealm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_AWS_ACCESS_KEY_ID',
    awsSecretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_AWS_SECRET_ACCESS_KEY',
    awsSessionToken: process.env.AWS_SESSION_TOKEN,
    awsS3BucketName:
      process.env.AWS_S3_BUCKET_NAME || 'YOUR_AWS_S3_BUCKET_NAME',
    awsS3CoreBucketName:
      process.env.AWS_S3_CORE_BUCKET_NAME || 'YOUR_AWS_S3_CORE_BUCKET_NAME',
  };
};

export default getConfig();
