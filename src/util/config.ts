declare global {
  interface Window {
    APP_CONFIG?: {
      VITE_GOOGLE_MAPS_API_KEY?: string;
      VITE_HASURA_ADMIN_SECRET?: string;
      VITE_API_URL?: string;
      VITE_WS_URL?: string;
      VITE_CITRINE_CORE_URL?: string;
      VITE_FILE_SERVER_URL?: string;
      VITE_LOGO_URL?: string;
      VITE_METRICS_URL?: string;
      VITE_ADMIN_EMAIL?: string;
      VITE_ADMIN_PASSWORD?: string;
    };
  }
}

const getConfig: () => {
  googleMapsApiKey: string;
  hasuraAdminSecret: string;
  apiUrl: string;
  wsUrl: string;
  citrineCore: string;
  fileServer: string;
  logoUrl: string;
  metricsUrl: string;
  adminEmail: string;
  adminPassword: string;
} = () => {
  return {
    googleMapsApiKey:
      window.APP_CONFIG?.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    hasuraAdminSecret:
      window.APP_CONFIG?.VITE_HASURA_ADMIN_SECRET ||
      import.meta.env.VITE_HASURA_ADMIN_SECRET,
    apiUrl: window.APP_CONFIG?.VITE_API_URL || import.meta.env.VITE_API_URL,
    wsUrl: window.APP_CONFIG?.VITE_WS_URL || import.meta.env.VITE_WS_URL,
    citrineCore:
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
  };
};

export default getConfig();
