// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import './telemetry';
import { Authenticated, Refine, ResourceProps } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import './style.scss';

import { ErrorComponent, ThemedLayoutContextProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { App as AntdApp, ConfigProvider, Layout as AntdLayout } from 'antd';

import dataProvider, {
  GraphQLClient,
  graphqlWS,
  HasuraDataProviderOptions,
  HasuraLiveProviderOptions,
  liveProvider,
} from '@refinedev/hasura';
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Header } from './components';
import {
  ColorModeContext,
  ColorModeContextProvider,
} from './contexts/color-mode';
import {
  resources as locationResources,
  routes as LocationsRoutes,
} from './pages/locations';
import {
  resources as chargingStationResources,
  routes as ChargingStationsRoutes,
} from './pages/charging-stations';
import {
  resources as transactionResources,
  routes as TransactionsRoutes,
} from './pages/transactions';
import { routes as OverviewRoutes } from './pages/overview';
import {
  resources as authoriationResources,
  routes as AuthorizationsRoutes,
} from './pages/authorizations';
import {
  resources as partnerResources,
  routes as PartnersRoutes,
} from './pages/partners';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './theme';
import { MainMenu, MenuSection } from './components/main-menu/main.menu';
import {
  checkTelemetryConsent,
  saveTelemetryConsent,
  TelemetryConsentModal,
} from '@util/TelemetryConsentModal';
import { initTelemetry } from './telemetry';
import AppModal from './AppModal';
import {
  createAccessProvider,
  createGenericAuthProvider,
  createKeycloakAuthProvider,
  HasuraHeader,
  ResourceType,
} from '@util/auth';
import { notificationProvider } from '@util/notificationProvider';

import config from '@util/config';

const KEYCLOAK_URL = config.keycloakUrl;
const KEYCLOAK_REALM = config.keycloakRealm;
const KEYCLOAK_CLIENT_ID = config.keycloakClientId;
export const authProvider =
  KEYCLOAK_URL && KEYCLOAK_REALM
    ? createKeycloakAuthProvider({
        keycloakUrl: KEYCLOAK_URL,
        keycloakRealm: KEYCLOAK_REALM,
        keycloakClientId: KEYCLOAK_CLIENT_ID,
      })
    : createGenericAuthProvider();

const accessControlProvider = createAccessProvider({
  getPermissions: authProvider.getPermissions!,
  getUserRole: authProvider.getUserRole!,
});

const requestMiddleware = async (request: any) => {
  const requestHeaders: Record<string, string> = {};
  
  // Remove any admin secret that might be present
  if (request.headers) {
    Object.keys(request.headers).forEach((key) => {
      const lowerKey = key.toLowerCase();
      // Explicitly exclude admin secret headers
      if (lowerKey !== 'x-hasura-admin-secret') {
        requestHeaders[key] = request.headers[key];
      }
    });
  }
  
  // Always use Keycloak token for authentication
  if (authProvider) {
    const token = await authProvider.getToken();
    if (token) {
      requestHeaders['Authorization'] = 'Bearer ' + token;
      
      const hasuraHeaders = await authProvider.getHasuraHeaders();
      if (hasuraHeaders) {
        const hasuraRole = hasuraHeaders.get(HasuraHeader.X_HASURA_ROLE);
        if (hasuraRole) {
          requestHeaders[HasuraHeader.X_HASURA_ROLE] = hasuraRole;
        }
      }
    } else {
      console.warn('No Keycloak token available for Hasura request');
    }
  }
  
  return {
    ...request,
    headers: requestHeaders,
  };
};

const API_URL = config.apiUrl;
const WS_URL = config.wsUrl;

const client = new GraphQLClient(API_URL, {
  requestMiddleware,
});

const webSocketClient = graphqlWS.createClient({
  url: WS_URL,
  connectionParams: async () => {
    const token = await authProvider.getToken();
    if (token) {
      const hasuraHeaders = await authProvider.getHasuraHeaders();
      if (hasuraHeaders) {
        const hasuraRole = hasuraHeaders.get(HasuraHeader.X_HASURA_ROLE);
        if (hasuraRole)
          // If a role is set, include it in the connection params
          return {
            headers: {
              Authorization: `Bearer ${token}`,
              [HasuraHeader.X_HASURA_ROLE]: hasuraRole,
            },
          };
      }
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  },
});

const hasuraProviderOptions = {
  idType: (resource: string) => {
    if (resource === ResourceType.CHARGING_STATIONS) return 'String';
    return 'Int';
  },
  namingConvention: 'hasura-default',
};

const hasuraDataProvider = dataProvider(
  client,
  hasuraProviderOptions as HasuraDataProviderOptions,
);

hasuraDataProvider.getApiUrl = () => {
  return API_URL;
};

interface MainAntdAppProps {
  isModalVisible: boolean;
  handleModalDecision: (agreed: boolean) => void;
}

const resources: ResourceProps[] = [
  ...chargingStationResources,
  ...locationResources,
  ...transactionResources,
  ...authoriationResources,
  ...partnerResources,
];

const MainAntDApp: React.FC<MainAntdAppProps> = ({
  isModalVisible,
  handleModalDecision,
}: MainAntdAppProps) => {
  const { mode } = useContext(ColorModeContext);
  const location = useLocation();

  const routeClassName = useMemo(() => {
    return `content-${location.pathname.replace(/\//g, '-').replace(/^-/, '')}`;
  }, [location.pathname]);

  const activeSection: MenuSection = useMemo(() => {
    if (location.pathname.startsWith(`/${MenuSection.LOCATIONS}`))
      return MenuSection.LOCATIONS;
    if (location.pathname.startsWith(`/${MenuSection.CHARGING_STATIONS}`))
      return MenuSection.CHARGING_STATIONS;
    if (location.pathname.startsWith(`/${MenuSection.AUTHORIZATIONS}`))
      return MenuSection.AUTHORIZATIONS;
    if (location.pathname.startsWith(`/${MenuSection.TRANSACTIONS}`))
      return MenuSection.TRANSACTIONS;
    if (location.pathname.startsWith(`/${MenuSection.PARTNERS}`))
      return MenuSection.PARTNERS;
    return MenuSection.OVERVIEW;
  }, [location.pathname]);

  const tabTitleHandler = () => {
    return config.appName;
  };

  const LoginPage = authProvider.getLoginPage();

  return (
    <AntdApp>
      <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <TelemetryConsentModal
          visible={isModalVisible}
          onDecision={handleModalDecision}
        />

        <Refine
          authProvider={authProvider}
          accessControlProvider={accessControlProvider}
          dataProvider={hasuraDataProvider}
          liveProvider={liveProvider(
            webSocketClient,
            hasuraProviderOptions as HasuraLiveProviderOptions,
          )}
          notificationProvider={notificationProvider}
          routerProvider={routerBindings}
          resources={resources}
          options={{
            syncWithLocation: false,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: '6ZV3T4-Lyy7B3-Dr5Uhd',
            liveMode: 'auto',
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <Authenticated key="login">
                  <div style={{ position: 'relative' }}>
                    <ThemedLayoutContextProvider initialSiderCollapsed={true}>
                      <AntdLayout
                        style={{ minHeight: '100vh' }}
                        hasSider={true}
                      >
                        <MainMenu activeSection={activeSection} />
                        <AntdLayout>
                          <AppModal />
                          <AntdLayout.Content
                            className={`content-container ${routeClassName}`}
                          >
                            <div className="content-outer-wrap">
                              <div className="content-inner-wrap">
                                <Outlet />
                              </div>
                            </div>
                          </AntdLayout.Content>
                        </AntdLayout>
                      </AntdLayout>
                    </ThemedLayoutContextProvider>
                    <div
                      className={`gradient ${mode === 'dark' ? 'dark' : ''}`}
                    />
                  </div>
                </Authenticated>
              }
            >
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route index path="/overview/*" element={<OverviewRoutes />} />
              <Route path="/locations/*" element={<LocationsRoutes />} />
              <Route
                path="/authorizations/*"
                element={<AuthorizationsRoutes />}
              />
              <Route path="/transactions/*" element={<TransactionsRoutes />} />
              <Route
                path="/charging-stations/*"
                element={<ChargingStationsRoutes />}
              />
              <Route path="/partners/*" element={<PartnersRoutes />} />
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler handler={tabTitleHandler} />
        </Refine>
      </ConfigProvider>
    </AntdApp>
  );
};

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const telemetryConsentModalInitialization = async () => {
      // On app start, try to read an existing consent
      const existingConsent = await checkTelemetryConsent();
      if (existingConsent == null) {
        // No consent found => show modal
        setIsModalVisible(true);
      } else {
        if (existingConsent) {
          initTelemetry();
        }
      }
    };
    telemetryConsentModalInitialization();
  }, []);

  /**
   * Handle user’s choice:
   */
  const handleModalDecision = (agreed: boolean) => {
    saveTelemetryConsent(agreed);
    setIsModalVisible(false);
    if (agreed) {
      initTelemetry();
    }
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <MainAntDApp
            isModalVisible={isModalVisible}
            handleModalDecision={handleModalDecision}
          />
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}
