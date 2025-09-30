// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Alert, Modal, Select, Space } from 'antd';
import { useList } from '@refinedev/core';
import { useNotification } from '@refinedev/core';
import { useMutation } from '@tanstack/react-query';
import { OcpiRestClient } from '@util/OcpiRestClient';
import { PARTNERS_LIST_QUERY } from '../../partners/queries';
import config from '@util/config';
import { IConnectorDto } from '@citrineos/base';

interface PublishResponse {
  success: boolean;
  locationId: string;
  publishedToPartners: string[];
  validationErrors?: string[];
  publishedEvses: number;
  publishedConnectors: number;
}

interface Partner {
  id: number;
  countryCode: string;
  partyId: string;
  partnerProfileOCPI?: any;
}

interface PublishConnectorRequest {
  partnerIds?: string[];
}

export interface ConnectorPublishModalProps {
  connector: IConnectorDto;
  visible: boolean;
  onClose: () => void;
}

export const ConnectorPublishModal = ({
  connector,
  visible,
  onClose,
}: ConnectorPublishModalProps) => {
  const { open } = useNotification();

  const [selectedPartners, setSelectedPartners] = React.useState<string[]>([]);

  const { data: partnersData, isLoading: isLoadingPartners } = useList<Partner>(
    {
      resource: 'TenantPartners',
      meta: {
        gqlQuery: PARTNERS_LIST_QUERY,
        gqlVariables: {
          where: config.tenantId ? { tenantId: { _eq: config.tenantId } } : {},
          limit: 100,
          offset: 0,
        },
      },
    },
  );

  const availablePartners =
    partnersData?.data?.map((partner) => {
      const businessName =
        partner.partnerProfileOCPI?.roles?.[0]?.businessDetails?.name;
      return {
        id: partner.id.toString(),
        name: businessName || `${partner.countryCode}-${partner.partyId}`,
      };
    }) || [];

  const { mutate: publishConnector, isLoading: isPublishing } = useMutation({
    mutationFn: async (request: PublishConnectorRequest) => {
      const client = new OcpiRestClient();
      return client.post<PublishResponse>(
        `locations/${connector.evse?.chargingStation?.locationId}/evses/${connector.evseId}/connectors/${connector.id}/publish`,
        {},
        request,
      );
    },
    onSuccess: (data: PublishResponse) => {
      if (data.success) {
        open?.({
          type: 'success',
          message: 'Publication Successful',
          description: `Connector published to ${data?.publishedToPartners?.length || 0} partners.`,
        });
      } else {
        open?.({
          type: 'error',
          message: 'Publication Failed',
          description: data.validationErrors?.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : (
            'Failed to publish connector'
          ),
        });
      }
      onClose();
      setSelectedPartners([]);
    },
    onError: (error: any) => {
      open?.({
        type: 'error',
        message: 'Publication Failed',
        description: error?.message || 'Failed to publish connector',
      });
      onClose();
      setSelectedPartners([]);
    },
  });

  const handlePublish = () => {
    const request: PublishConnectorRequest = {};
    if (selectedPartners.length > 0) {
      request.partnerIds = selectedPartners;
    }
    publishConnector(request);
  };

  return (
    <Modal
      title="Publish Connector to OCPI Partners"
      open={visible}
      onOk={handlePublish}
      onCancel={onClose}
      confirmLoading={isPublishing}
      okText="Publish Connector"
      cancelText="Cancel"
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Connector Publication"
          description="This will publish the connector to OCPI partners."
          type="info"
          showIcon
        />

        <div>
          <span>Select specific partners (optional):</span>
          <Select
            mode="multiple"
            placeholder={
              isLoadingPartners
                ? 'Loading partners...'
                : 'Select partners (leave empty to publish to all)'
            }
            style={{ width: '100%', marginTop: 8 }}
            value={selectedPartners}
            onChange={setSelectedPartners}
            options={availablePartners.map((partner) => ({
              label: partner.name,
              value: partner.id,
            }))}
            loading={isLoadingPartners}
            disabled={isLoadingPartners || availablePartners.length === 0}
          />
        </div>

        {selectedPartners.length === 0 && availablePartners.length > 0 && (
          <Alert
            message={`Publishing to all ${availablePartners.length} configured OCPI partners`}
            type="info"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};
