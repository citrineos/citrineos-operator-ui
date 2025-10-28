// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

declare global {
  interface Window {
    APP_CONFIG?: {
      VITE_APP_NAME?: string;
      VITE_GOOGLE_MAPS_API_KEY?: string;
      VITE_GOOGLE_MAPS_LOCATION_PICKER_MAP_ID?: string;
      VITE_GOOGLE_MAPS_OVERVIEW_MAP_ID?: string;
      VITE_HASURA_ADMIN_SECRET?: string;
      VITE_HASURA_CLAIM?: string;
      VITE_TENANT_ID?: string;
      VITE_API_URL?: string;
      VITE_WS_URL?: string;
      VITE_CITRINE_CORE_URL?: string;
      VITE_FILE_SERVER_URL?: string;
      VITE_LOGO_URL?: string;
      VITE_METRICS_URL?: string;
      VITE_ADMIN_EMAIL?: string;
      VITE_ADMIN_PASSWORD?: string;
      VITE_KEYCLOAK_URL?: string;
      VITE_KEYCLOAK_REALM?: string;
    };
  }
}

const getConfig: () => {
  appName: string;
  googleMapsApiKey: string;
  googleMapsLocationPickerMapId?: string;
  googleMapsOverviewMapId?: string;
  hasuraAdminSecret?: string;
  hasuraClaim?: string;
  tenantId?: string;
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
} = () => {
  return {
    appName:
      window.APP_CONFIG?.VITE_APP_NAME ||
      import.meta.env.VITE_APP_NAME ||
      'CitrineOS',
    googleMapsApiKey:
      window.APP_CONFIG?.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      'YOUR_GOOGLE_MAPS_API_KEY',
    googleMapsLocationPickerMapId:
      window.APP_CONFIG?.VITE_GOOGLE_MAPS_LOCATION_PICKER_MAP_ID ||
      import.meta.env.VITE_GOOGLE_MAPS_LOCATION_PICKER_MAP_ID,
    googleMapsOverviewMapId:
      window.APP_CONFIG?.VITE_GOOGLE_MAPS_OVERVIEW_MAP_ID ||
      import.meta.env.VITE_GOOGLE_MAPS_OVERVIEW_MAP_ID,
    hasuraAdminSecret:
      window.APP_CONFIG?.VITE_HASURA_ADMIN_SECRET ||
      import.meta.env.VITE_HASURA_ADMIN_SECRET,
    hasuraClaim:
      window.APP_CONFIG?.VITE_HASURA_CLAIM ||
      import.meta.env.VITE_HASURA_CLAIM ||
      'https://hasura.io/jwt/claims',
    tenantId:
      window.APP_CONFIG?.VITE_TENANT_ID || import.meta.env.VITE_TENANT_ID,
    apiUrl:
      window.APP_CONFIG?.VITE_API_URL ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:8090/v1/graphql',
    wsUrl:
      window.APP_CONFIG?.VITE_WS_URL ||
      import.meta.env.VITE_WS_URL ||
      'ws://localhost:8090/v1/graphql',
    citrineCoreUrl:
      window.APP_CONFIG?.VITE_CITRINE_CORE_URL ||
      import.meta.env.VITE_CITRINE_CORE_URL,
    fileServer:
      window.APP_CONFIG?.VITE_FILE_SERVER_URL ||
      import.meta.env.VITE_FILE_SERVER_URL,
    logoUrl: window.APP_CONFIG?.VITE_LOGO_URL || import.meta.env.VITE_LOGO_URL,
    metricsUrl:
      window.APP_CONFIG?.VITE_METRICS_URL || import.meta.env.VITE_METRICS_URL,
    adminEmail:
      window.APP_CONFIG?.VITE_ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAIL,
    adminPassword:
      window.APP_CONFIG?.VITE_ADMIN_PASSWORD ||
      import.meta.env.VITE_ADMIN_PASSWORD,
    keycloakUrl:
      window.APP_CONFIG?.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL,
    keycloakRealm:
      window.APP_CONFIG?.VITE_KEYCLOAK_REALM ||
      import.meta.env.VITE_KEYCLOAK_REALM,
  };
};

export default getConfig();
