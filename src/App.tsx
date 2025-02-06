import './telemetry';
import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import './style.scss';

import {
  ErrorComponent,
  ThemedLayoutContextProvider,
  useNotificationProvider,
} from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { App as AntdApp, ConfigProvider, Layout as AntdLayout } from 'antd';

import dataProvider, {
  GraphQLClient,
  graphqlWS,
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
} from 'react-router-dom';
import { Header } from './components';
import {
  ColorModeContext,
  ColorModeContextProvider,
} from './contexts/color-mode';
import { routes as LocationsRoutes } from './pages/locations';
import { routes as ChargingStationsRoutes } from './pages/charging-stations';
import { routes as TransactionsRoutes } from './pages/transactions';
import { routes as OverviewRoutes } from './pages/overview';
import { routes as AuthorizationsRoutes } from './pages/authorizations';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './theme';
import { MainMenu } from './components/main-menu/main.menu';
import {
  checkTelemetryConsent,
  saveTelemetryConsent,
  TelemetryConsentModal,
} from './util/TelemetryConsentModal';
import { initTelemetry } from './telemetry';

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

const client = new GraphQLClient(API_URL, {
  headers: {
    'x-hasura-role': 'admin',
  },
});

const webSocketClient = graphqlWS.createClient({
  url: WS_URL,
});

const hasuraDataProvider = dataProvider(client);
hasuraDataProvider.getApiUrl = () => {
  return API_URL;
};

interface MainAntdAppProps {
  isModalVisible: boolean;
  handleModalDecision: (agreed: boolean) => void;
}

const MainAntDApp: React.FC<MainAntdAppProps> = ({
  isModalVisible,
  handleModalDecision,
}: MainAntdAppProps) => {
  const { mode } = useContext(ColorModeContext);
  const location = useLocation();

  const routeClassName = useMemo(() => {
    return `content-${location.pathname.replace(/\//g, '-').replace(/^-/, '')}`;
  }, [location.pathname]);

  return (
    <AntdApp>
      <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <TelemetryConsentModal
          visible={isModalVisible}
          onDecision={handleModalDecision}
        />

        <Refine
          dataProvider={hasuraDataProvider}
          liveProvider={liveProvider(webSocketClient)}
          notificationProvider={useNotificationProvider}
          routerProvider={routerBindings}
          options={{
            syncWithLocation: false,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: '6ZV3T4-Lyy7B3-Dr5Uhd',
            liveMode: 'auto',
          }}
        >
          <Routes>
            <Route
              element={
                <div style={{ position: 'relative' }}>
                  <ThemedLayoutContextProvider initialSiderCollapsed={true}>
                    <AntdLayout style={{ minHeight: '100vh' }} hasSider={true}>
                      <MainMenu />
                      <AntdLayout>
                        <Header />
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
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
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
