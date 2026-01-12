// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { useEffect, useState } from 'react';
import { Copy, Loader2 } from 'lucide-react';
import { Button } from '@lib/client/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lib/client/components/ui/dialog';
import {
  S3_BUCKET_FILE_CONFIG,
  S3_BUCKET_FILE_CORE_CONFIG,
} from '@lib/utils/consts';
import { useGetIdentity } from '@refinedev/core';
import type { KeycloakUserIdentity } from '@lib/providers/auth-provider/keycloak-auth-provider';
import type { SystemConfig, WebsocketServerConfig } from '@citrineos/base';
import { fetchFileAction } from '@lib/server/actions/file/fetchFileAction';
import { BucketType } from '@lib/utils/enums';

export interface OperatorConfig {
  centralSystem: {
    host: string;
  };
  defaultTenantId: number;
}

export const SecurityProfiles: Record<
  number,
  { label: string; description: string }
> = {
  0: {
    label: 'No Authentication',
    description:
      'The charging station connects without credentials. Set up the username/password using this connection',
  },
  1: {
    label: 'Security Profile 1: Unsecured Transport with Basic Authentication',
    description:
      'Charging Station authentication is done through a username and password. Install CA certificate in the charging station using this connection',
  },
  2: {
    label: 'Security Profile 2: TLS with Basic Authentication',
    description:
      'The CSMS authenticates itself using a TLS server certificate. The Charging Stations authenticate themselves using HTTP Basic Authentication. Sign charging station certificate using this connection',
  },
  3: {
    label: 'Security Profile 3: TLS with Client Side Certificates',
    description:
      'Both the Charging Station and CSMS authenticate themselves using certificates.',
  },
};

interface ConnectionModalProps {
  open: boolean;
  onClose: () => void;
}

export const ConnectionModal = ({ open, onClose }: ConnectionModalProps) => {
  const [coreConfig, setCoreConfig] = useState<SystemConfig | null>(null);
  const [operatorConfig, setOperatorConfig] = useState<OperatorConfig | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get web server config from core
  useEffect(() => {
    if (open && !coreConfig) {
      setLoading(true);
      fetchFileAction(`${S3_BUCKET_FILE_CORE_CONFIG}`, BucketType.CORE)
        .then((data) => setCoreConfig(data))

        .catch(console.error);
    }
  }, [open, coreConfig]);

  // Get host from operator ui config
  useEffect(() => {
    if (open && !operatorConfig) {
      setLoading(true);
      fetchFileAction(`${S3_BUCKET_FILE_CONFIG}`)
        .then((data) => setOperatorConfig(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, operatorConfig]);
  const host = operatorConfig?.centralSystem?.host;
  // Get tenant id, if not found, use default tenant id from operator config
  const { data: identity } = useGetIdentity<KeycloakUserIdentity>();
  const tenantId =
    Number(identity?.tenantId) || operatorConfig?.defaultTenantId;

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500); // clear after 1.5s
      })
      .catch(console.error);
  };

  // Group servers by security profile
  const groupedServers: Record<number, WebsocketServerConfig[]> = {};
  coreConfig?.util?.networkConnection?.websocketServers?.forEach((server) => {
    if (server.tenantId === tenantId) {
      if (!groupedServers[server.securityProfile])
        groupedServers[server.securityProfile] = [];
      groupedServers[server.securityProfile].push(server);
    }
  });

  const hasConnections =
    coreConfig?.util?.networkConnection?.websocketServers?.length && host;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={'overflow-auto max-h-150!'}>
        <DialogHeader>
          <DialogTitle>Charging Station Connection</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Use the following websocket URLs to connect to the server. The
          connection can be upgraded from No Authentication to Security Profile
          3 one by one.
        </DialogDescription>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasConnections ? (
          <div className="space-y-6">
            {Object.keys(SecurityProfiles).map((key) => {
              const profile = Number(key);
              const servers = groupedServers[profile];
              if (!servers?.length) return null;
              const wsUrl = `${profile > 1 ? 'wss' : 'ws'}://${host}`;

              return (
                <div
                  key={profile}
                  className="border border-transparent rounded-lg p-3"
                >
                  <h3 className="font-semibold mb-2">
                    {SecurityProfiles[profile].label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {SecurityProfiles[profile].description}
                  </p>
                  <ul className="space-y-2">
                    {servers.map((s) => (
                      <li
                        key={s.id}
                        className="border p-2 rounded flex justify-between items-center"
                      >
                        <span className="font-small mr-2">{s.protocol}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <a
                            href={`${wsUrl}:${s.port}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm truncate"
                            title={`${wsUrl}:${s.port}`}
                          >
                            {`${wsUrl}:${s.port}`}
                          </a>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              copyToClipboard(s.id, `${wsUrl}:${s.port}`)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>

                          {/* Copied message */}
                          {copiedId === s.id && (
                            <span className="text-green-600 text-xs">
                              Copied!
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No websocket servers available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
