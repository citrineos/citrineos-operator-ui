// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { useEffect, useState } from 'react';
import { Copy, Loader2, Play, HelpCircle } from 'lucide-react';
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
import config from '@lib/utils/config';
import type { SystemConfig, WebsocketServerConfig } from '@citrineos/base';
import { fetchFileAction } from '@lib/server/actions/file/fetchFileAction';
import { BucketType } from '@lib/utils/enums';
import { useTenantId } from '@lib/client/hooks/useTenantId';

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
  isFirstLogin?: boolean;
}

export const ConnectionModal = ({
  open,
  onClose,
  isFirstLogin = false,
}: ConnectionModalProps) => {
  const [coreConfig, setCoreConfig] = useState<SystemConfig | null>(null);
  const [operatorConfig, setOperatorConfig] = useState<OperatorConfig | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHelpContent, setShowHelpContent] = useState(isFirstLogin);

  // Get web server config from core
  useEffect(() => {
    if (open && !coreConfig) {
      setLoading(true);
      fetchFileAction(`${S3_BUCKET_FILE_CORE_CONFIG}`, BucketType.CORE)
        .then((data) => setCoreConfig(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, coreConfig]);

  // Reset help content state when modal opens/closes
  useEffect(() => {
    setShowHelpContent(isFirstLogin);
  }, [open, isFirstLogin]);

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

  const tenantId = useTenantId();

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
  const fallbackServers: Record<number, WebsocketServerConfig[]> = {};

  coreConfig?.util?.networkConnection?.websocketServers?.forEach((server) => {
    const serverWithMapping = server as any;

    // Check if server has tenant path mapping and dynamic tenant resolution enabled
    if (
      serverWithMapping.tenantPathMapping &&
      serverWithMapping.dynamicTenantResolution
    ) {
      const pathMapping = serverWithMapping.tenantPathMapping;
      const hasTenantMapping = Object.values(pathMapping).includes(tenantId);

      if (hasTenantMapping) {
        if (!groupedServers[server.securityProfile])
          groupedServers[server.securityProfile] = [];
        groupedServers[server.securityProfile].push(server);
      }
    } else {
      if (!fallbackServers[server.securityProfile])
        fallbackServers[server.securityProfile] = [];
      fallbackServers[server.securityProfile].push(server);
    }
  });

  const buildWebsocketUrl = (
    server: WebsocketServerConfig,
    host: string,
    tenantId: number,
  ): string => {
    const protocol = server.securityProfile > 1 ? 'wss' : 'ws';

    const serverWithMapping = server as any;

    // Check if tenant path mapping exists and dynamic tenant resolution is enabled
    if (
      serverWithMapping.tenantPathMapping &&
      serverWithMapping.dynamicTenantResolution
    ) {
      const pathMapping = serverWithMapping.tenantPathMapping;
      const pathEntry = Object.entries(pathMapping).find(
        ([_, mappedTenantId]) => mappedTenantId === tenantId,
      );
      if (pathEntry) {
        return `${protocol}://${host}:${server.port}/${pathEntry[0]}`;
      } else {
        return `${protocol}://${host}:${server.port}`;
      }
    } else {
      return `${protocol}://${host}:${server.port}`;
    }
  };

  const hasConnections =
    coreConfig?.util?.networkConnection?.websocketServers?.length && host;

  // Video URL configuration - can be easily replaced via environment variable
  const helpVideoUrl = config.helpVideoUrl;

  const toggleHelpContent = () => {
    setShowHelpContent(!showHelpContent);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={'overflow-auto max-h-150!'}>
        <DialogHeader>
          <DialogTitle>
            {showHelpContent
              ? 'Welcome to CitrineOS Operator UI'
              : 'Charging Station Connection'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {showHelpContent
            ? 'Watch this quick introduction video to learn how to connect charging stations. You can access this information anytime by clicking the Help button.'
            : 'Use the following tenant-specific websocket URLs to connect to the server. The connection can be upgraded from No Authentication to Security Profile 3 one by one.'}
        </DialogDescription>

        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            onClick={toggleHelpContent}
            className="flex items-center gap-2"
          >
            {showHelpContent ? (
              <>
                <HelpCircle className="w-4 h-4" />
                Show Connection Info
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Show Help Video
              </>
            )}
          </Button>
        </div>

        {showHelpContent ? (
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Getting Started Video</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {helpVideoUrl ? (
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    poster="/video-poster.jpg"
                  >
                    <source src={helpVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No video available</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                This video demonstrates how to connect charging stations to the
                CitrineOS platform.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Quick Steps</h3>
              <ol className="space-y-2 text-sm">
                <li>
                  1. Configure your charging station with the appropriate
                  websocket URL
                </li>
                <li>2. Choose the security profile that matches your setup</li>
                <li>
                  3. Copy the connection URL from the connection info section
                </li>
                <li>4. Test the connection from your charging station</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Remember:</strong> You can always access this help
                content by clicking the Help button in the sidebar.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasConnections ? (
          <div className="space-y-6">
            {Object.keys(SecurityProfiles).map((key) => {
              const profile = Number(key);
              const servers = groupedServers[profile];
              if (!servers?.length) return null;

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
                    {servers.map((s) => {
                      if (!tenantId) return null;
                      const wsUrl = buildWebsocketUrl(s, host, tenantId);
                      return (
                        <li
                          key={s.id}
                          className="border p-2 rounded flex justify-between items-center"
                        >
                          <span className="font-small mr-2">
                            {s.protocols.join(', ')}
                          </span>
                          <div className="flex items-center gap-2 flex-1">
                            <a
                              href={`${wsUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm truncate"
                              title={`${wsUrl}`}
                            >
                              {`${wsUrl}`}
                            </a>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(s.id, `${wsUrl}`)}
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
                      );
                    })}
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
