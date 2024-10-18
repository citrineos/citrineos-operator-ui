import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import CitrineOSPng from '/Citrine_OS_Logo.png';
import './style.scss';

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';

import dataProvider, {
  GraphQLClient,
  graphqlWS,
  HasuraDataProviderOptions,
  liveProvider,
} from '@refinedev/hasura';
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { ColorModeContextProvider } from './contexts/color-mode';
import {
  AdditionalInfosCreate,
  AdditionalInfosEdit,
  AdditionalInfosList,
  AdditionalInfosShow,
} from './pages/additional-infos';
import {
  IdTokenInfosCreate,
  IdTokenInfosEdit,
  IdTokenInfosList,
  IdTokenInfosShow,
} from './pages/id-token-infos';
import {
  IdTokensCreate,
  IdTokensEdit,
  IdTokensList,
  IdTokensShow,
} from './pages/id-tokens';
import { App as AntdApp, ConfigProvider } from 'antd';
import {
  AuthorizationsCreate,
  AuthorizationsEdit,
  AuthorizationsList,
  AuthorizationsShow,
} from './pages/authorizations';
import { ResourceType } from './resource-type';
import {
  resources as bootsResources,
  routes as BootsRoutes,
} from './pages/boots';
import {
  resources as chargingStationsResources,
  routes as ChargingStationsRoutes,
} from './pages/charging-stations';
import {
  resources as chargingStationSequencesResources,
  routes as ChargingStationSequencesRoutes,
} from './pages/charging-station-sequences';
import {
  resources as locationsResources,
  routes as LocationsRoutes,
} from './pages/locations';

import {
  resources as statusNotificationsResources,
  routes as StatusNotificationsRoutes,
} from './pages/status-notifications';
import {
  resources as tariffsResources,
  routes as TariffsRoutes,
} from './pages/tariffs';
import {
  SecurityEventsCreate,
  SecurityEventsEdit,
  SecurityEventsList,
  SecurityEventsShow,
} from './pages/security-events';
import {
  resources as subscriptionsResources,
  routes as SubscriptionsRoutes,
} from './pages/subscriptions';
import {
  resources as transactionsResources,
  routes as TransactionsRoutes,
} from './pages/transactions';
import {
  resources as transactionEventsResources,
  routes as TransactionEventsRoutes,
} from './pages/transaction-events';
import {
  resources as meterValuesResources,
  routes as MeterValuesRoutes,
} from './pages/meter-values';
import {
  resources as chargingProfilesResources,
  routes as ChargingProfilesRoutes,
} from './pages/charging-profiles';
import {
  resources as variableMonitoringsResources,
  routes as VariableMonitoringsRoutes,
} from './pages/variable-monitorings';
import {
  AuditOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import { MdOutlineSecurity } from 'react-icons/md';
import {
  resources as messageInfosResources,
  routes as MessageInfosRoutes,
} from './pages/message-infos';
import {
  resources as certificatesResources,
  routes as CertificatesRoutes,
} from './pages/certificates';
import {
  resources as reservationsResources,
  routes as ReservationsRoutes,
} from './pages/reservations';
import {
  resources as evsesResources,
  routes as EvsesRoutes,
} from './pages/evses';
import { theme } from './theme';

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

const hasuraOptions: HasuraDataProviderOptions = {
  idType: (resource) => {
    switch (resource) {
      default:
        return 'Int';
    }
  },
};

const hasuraDataProvider = dataProvider(client, hasuraOptions)
hasuraDataProvider.getApiUrl = () => {
  return API_URL;
}

const resources = [
  {
    name: ResourceType.ADDITIONAL_INFOS,
    list: '/additional-infos',
    create: '/additional-infos/create',
    edit: '/additional-infos/edit/:id',
    show: '/additional-infos/show/:id',
    meta: {
      canDelete: true,
    },
    icon: <ExclamationCircleOutlined />,
  },
  {
    name: ResourceType.ID_TOKENS,
    list: '/id-tokens',
    create: '/id-tokens/create',
    edit: '/id-tokens/edit/:id',
    show: '/id-tokens/show/:id',
    meta: {
      canDelete: true,
    },
    icon: <ContainerOutlined />,
  },
  {
    name: ResourceType.ID_TOKEN_INFOS,
    list: '/id-token-infos',
    create: '/id-token-infos/create',
    edit: '/id-token-infos/edit/:id',
    show: '/id-token-infos/show/:id',
    meta: {
      canDelete: true,
    },
    icon: <AuditOutlined />,
  },
  {
    name: ResourceType.AUTHORIZATIONS,
    list: '/authorizations',
    create: '/authorizations/create',
    edit: '/authorizations/edit/:id',
    show: '/authorizations/show/:id',
    meta: {
      canDelete: true,
    },
    icon: <ContactsOutlined />,
  },
  {
    name: ResourceType.SECURITY_EVENTS,
    list: '/security-events',
    create: '/security-events/create',
    edit: '/security-events/edit/:id',
    show: '/security-events/show/:id',
    meta: {
      canDelete: true,
    },
    icon: <MdOutlineSecurity />,
  },
  ...bootsResources,
  ...chargingStationsResources,
  ...chargingStationSequencesResources,
  ...locationsResources,
  ...statusNotificationsResources,
  ...tariffsResources,
  ...subscriptionsResources,
  ...transactionsResources,
  ...transactionEventsResources,
  ...meterValuesResources,
  ...chargingProfilesResources,
  ...messageInfosResources,
  ...variableMonitoringsResources,
  ...certificatesResources,
  ...reservationsResources,
  ...evsesResources,
].sort((a, b) => a.name.localeCompare(b.name));

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <ConfigProvider theme={theme}>
              <Refine
                dataProvider={hasuraDataProvider}
                liveProvider={liveProvider(webSocketClient)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={resources}
                options={{
                  syncWithLocation: false,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: '6ZV3T4-Lyy7B3-Dr5Uhd',
                  liveMode: 'auto',
                  title: {
                    icon: (
                      <img
                        src={CitrineOSPng}
                        alt="icon"
                        style={{ height: '48px', margin: '-8px -8px' }}
                      />
                    ),
                    text: 'Citrine OS',
                  },
                }}
              >
                <Routes>
                  <Route
                    element={
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="Authorizations" />}
                    />
                    <Route path="/additional-infos">
                      <Route index element={<AdditionalInfosList />} />
                      <Route
                        path="create"
                        element={<AdditionalInfosCreate />}
                      />
                      <Route
                        path="edit/:id"
                        element={<AdditionalInfosEdit />}
                      />
                      <Route
                        path="show/:id"
                        element={<AdditionalInfosShow />}
                      />
                    </Route>
                    <Route path="/id-tokens">
                      <Route index element={<IdTokensList />} />
                      <Route path="create" element={<IdTokensCreate />} />
                      <Route path="edit/:id" element={<IdTokensEdit />} />
                      <Route path="show/:id" element={<IdTokensShow />} />
                    </Route>
                    <Route path="/id-token-infos">
                      <Route index element={<IdTokenInfosList />} />
                      <Route path="create" element={<IdTokenInfosCreate />} />
                      <Route path="edit/:id" element={<IdTokenInfosEdit />} />
                      <Route path="show/:id" element={<IdTokenInfosShow />} />
                    </Route>
                    <Route path="/authorizations">
                      <Route index element={<AuthorizationsList />} />
                      <Route path="create" element={<AuthorizationsCreate />} />
                      <Route path="edit/:id" element={<AuthorizationsEdit />} />
                      <Route path="show/:id" element={<AuthorizationsShow />} />
                    </Route>
                    <Route path="/security-events">
                      <Route index element={<SecurityEventsList />} />
                      <Route path="create" element={<SecurityEventsCreate />} />
                      <Route path="edit/:id" element={<SecurityEventsEdit />} />
                      <Route path="show/:id" element={<SecurityEventsShow />} />
                    </Route>
                    <Route path="/boots/*" element={<BootsRoutes />} />
                    <Route
                      path="/charging-stations/*"
                      element={<ChargingStationsRoutes />}
                    />
                    <Route
                      path="/charging-station-sequences/*"
                      element={<ChargingStationSequencesRoutes />}
                    />
                    <Route path="/locations/*" element={<LocationsRoutes />} />
                    <Route
                      path="/status-notifications/*"
                      element={<StatusNotificationsRoutes />}
                    />
                    <Route path="/tariffs/*" element={<TariffsRoutes />} />
                    <Route
                      path="/subscriptions/*"
                      element={<SubscriptionsRoutes />}
                    />
                    <Route
                      path="/transactions/*"
                      element={<TransactionsRoutes />}
                    />
                    <Route
                      path="/transaction-events/*"
                      element={<TransactionEventsRoutes />}
                    />
                    <Route
                      path="/meter-values/*"
                      element={<MeterValuesRoutes />}
                    />
                    <Route
                      path="/charging-profiles/*"
                      element={<ChargingProfilesRoutes />}
                    />
                    <Route
                      path="/message-infos/*"
                      element={<MessageInfosRoutes />}
                    />
                    <Route
                      path="/variable-monitorings/*"
                      element={<VariableMonitoringsRoutes />}
                    />
                    <Route
                      path="/certificates/*"
                      element={<CertificatesRoutes />}
                    />
                    <Route
                      path="/reservations/*"
                      element={<ReservationsRoutes />}
                    />
                    <Route path="/evses/*" element={<EvsesRoutes />} />
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </ConfigProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
