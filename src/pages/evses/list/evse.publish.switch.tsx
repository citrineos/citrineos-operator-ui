// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Alert, Modal, Select, Space, Switch, Tooltip } from 'antd';
import { useList } from '@refinedev/core';
import { useNotification } from '@refinedev/core';
import { useMutation } from '@tanstack/react-query';
import { OcpiRestClient } from '@util/OcpiRestClient';
import { PARTNERS_LIST_QUERY } from '../../partners/queries';
import config from '@util/config';
import { IEvseDto, IChargingStationDto } from '@citrineos/base';

// TODO: These should be defined in a shared types file
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
}

interface PublishRequest {
  partnerIds?: string[];
}

export interface EvsePublishSwitchProps {
  evse: IEvseDto;
  station: IChargingStationDto;
}

export const EvsePublishSwitch = ({
  evse,
  station,
}: EvsePublishSwitchProps) => {
  const { open } = useNotification();

  const [optimisticPublished, setOptimisticPublished] = React.useState(false);
  const [isPublishModalVisible, setIsPublishModalVisible] =
    React.useState(false);
  const [selectedPartners, setSelectedPartners] = React.useState<string[]>([]);
  const effectivePublished = evse.isPublished || optimisticPublished;

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
    partnersData?.data?.map((partner) => ({
      id: partner.id.toString(),
      name: `${partner.countryCode}-${partner.partyId}`,
    })) || [];

  const { mutate: publishEvse, isLoading: isPublishing } = useMutation({
    mutationFn: async (partnerIds?: string[]) => {
      const client = new OcpiRestClient();
      const requestData: PublishRequest = {};

      if (partnerIds && partnerIds.length > 0) {
        requestData.partnerIds = partnerIds;
      }

      return client.post<PublishResponse>(
        `locations/${station.locationId}/evses/${evse.id}/publish`,
        {},
        requestData,
      );
    },
    onSuccess: (data: PublishResponse) => {
      if (data.success) {
        open?.({
          type: 'success',
          message: 'Publication Successful',
          description: `EVSE with ${data?.publishedConnectors || 0} connectors published to ${data?.publishedToPartners?.length || 0} partners`,
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
            'Failed to publish EVSE hierarchy'
          ),
        });
        setOptimisticPublished(false);
      }
      setIsPublishModalVisible(false);
      setSelectedPartners([]);
    },
    onError: (error: any) => {
      open?.({
        type: 'error',
        message: 'Publication Failed',
        description: error?.message || 'Failed to publish EVSE hierarchy',
      });
      setOptimisticPublished(false);
      setIsPublishModalVisible(false);
      setSelectedPartners([]);
    },
  });

  const handleToggleChange = (checked: boolean) => {
    if (!checked || effectivePublished || isPublishing) return;
    setIsPublishModalVisible(true);
  };

  const handlePublish = () => {
    setOptimisticPublished(true);
    publishEvse(selectedPartners.length > 0 ? selectedPartners : undefined);
  };

  const handleModalCancel = () => {
    setIsPublishModalVisible(false);
    setSelectedPartners([]);
  };

  return (
    <>
      <Tooltip
        title={
          effectivePublished
            ? 'Already published'
            : 'Publish EVSE & its connectors upstream'
        }
      >
        <Switch
          checkedChildren="Published"
          unCheckedChildren="Publish"
          checked={effectivePublished}
          onChange={handleToggleChange}
          loading={isPublishing}
          disabled={effectivePublished && !isPublishing}
        />
      </Tooltip>

      <Modal
        title="Publish EVSE Hierarchy to OCPI Partners"
        open={isPublishModalVisible}
        onOk={handlePublish}
        onCancel={handleModalCancel}
        confirmLoading={isPublishing}
        okText="Publish EVSE & Connectors"
        cancelText="Cancel"
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="EVSE Hierarchy Publication"
            description="This will publish the EVSE and all its connectors as a complete unit to OCPI partners."
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
    </>
  );
};
