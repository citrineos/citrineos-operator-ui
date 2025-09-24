// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Alert,
  Modal,
  Select,
  notification,
} from 'antd';
import { CloudUploadOutlined, WarningOutlined } from '@ant-design/icons';
import { ILocationDto } from '@citrineos/base';
import { useCustomMutation, useList } from '@refinedev/core';
import { PARTNERS_LIST_QUERY } from '../../partners/queries';
import config from '@util/config';
import './publication-manager.scss';

interface LocationPublicationManagerProps {
  location: ILocationDto & {
    isPublished?: boolean;
    validationErrors?: string[];
    publishedToPartners?: string[];
    lastPublicationAttempt?: string;
  };
}

interface PublishLocationRequest {
  partnerIds?: string[];
}

interface PublishLocationResponse {
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

export const LocationPublicationManager: React.FC<
  LocationPublicationManagerProps
> = ({ location }) => {
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  // Fetch real partners data for the current tenant
  const { data: partnersData, isLoading: isLoadingPartners } = useList<Partner>(
    {
      resource: 'TenantPartners',
      meta: {
        gqlQuery: PARTNERS_LIST_QUERY,
        gqlVariables: {
          where: config.tenantId ? { tenantId: { _eq: config.tenantId } } : {},
          limit: 100, // Adjust as needed
          offset: 0,
        },
      },
    },
  );

  const availablePartners =
    partnersData?.data?.map((partner) => ({
      id: partner.id.toString(),
      name: `${partner.countryCode}-${partner.partyId}`,
      countryCode: partner.countryCode,
      partyId: partner.partyId,
    })) || [];

  const {
    mutate: publishLocation,
    isLoading: isPublishing,
    data: mutationData,
    error: mutationError,
  } = useCustomMutation<PublishLocationResponse>();

  useEffect(() => {
    if (mutationError) {
      notification.error({
        message: 'Publication Failed',
        description: 'Failed to publish location hierarchy to OCPI partners',
      });
    } else if (mutationData) {
      notification.success({
        message: 'Publication Successful',
        description: `Location with ${mutationData?.data.publishedEvses || 0} EVSEs and ${mutationData?.data.publishedConnectors || 0} connectors published to ${mutationData?.data.publishedToPartners?.length || 0} partners`,
      });
    }
  }, [mutationData, mutationError]);

  const handlePublish = () => {
    const requestData: PublishLocationRequest = {};

    if (selectedPartners.length > 0) {
      requestData.partnerIds = selectedPartners;
    }

    publishLocation({
      url: `/admin/v2.2.1/locations/locations/${location.id}/publish`,
      method: 'post',
      values: requestData,
    });
    setIsPublishModalVisible(false);
    setSelectedPartners([]);
  };

  const showPublishModal = () => {
    setIsPublishModalVisible(true);
  };

  const getPublicationStatus = () => {
    if (location.isPublished) {
      return <Tag color="green">Published</Tag>;
    } else {
      return <Tag color="orange">Not Published</Tag>;
    }
  };

  const hasValidationErrors =
    location.validationErrors && location.validationErrors.length > 0;

  return (
    <Card title="OCPI Location Publication" className="publication-manager">
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Publication Status */}
        <div className="publication-status">
          <Space>
            <span>Publication Status:</span>
            {getPublicationStatus()}
          </Space>
        </div>

        {/* Validation Errors from last attempt */}
        {hasValidationErrors && (
          <Alert
            message="Validation Errors (from last publication attempt)"
            description={
              <ul>
                {location.validationErrors!.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            icon={<WarningOutlined />}
            showIcon
          />
        )}

        {/* Published Partners */}
        {location.publishedToPartners &&
          location.publishedToPartners.length > 0 && (
            <div className="published-partners">
              <span>Published to Partners:</span>
              <Space wrap>
                {location.publishedToPartners.map((partnerId) => (
                  <Tag key={partnerId} color="green">
                    {partnerId}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

        {/* Last Publication Attempt */}
        {location.lastPublicationAttempt && (
          <div className="last-attempt">
            <span>Last Publication Attempt: </span>
            <span>
              {new Date(location.lastPublicationAttempt).toLocaleString()}
            </span>
          </div>
        )}

        {/* Publish Button */}
        <div className="publish-actions">
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={showPublishModal}
            loading={isPublishing}
            size="large"
          >
            Publish Location & All Components
          </Button>
          <p style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
            This will publish the entire location including all EVSEs and
            connectors. Validation will be performed before publishing.
          </p>
        </div>
      </Space>

      {/* Publish Modal */}
      <Modal
        title="Publish Location Hierarchy to OCPI Partners"
        open={isPublishModalVisible}
        onOk={handlePublish}
        onCancel={() => {
          setIsPublishModalVisible(false);
          setSelectedPartners([]);
        }}
        confirmLoading={isPublishing}
        okText="Publish Complete Location"
        cancelText="Cancel"
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Complete Location Publication"
            description="This will publish the location and all its charging stations, EVSEs, and connectors as a complete unit to OCPI partners."
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
                  : availablePartners.length === 0
                    ? 'No partners available'
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
            {!isLoadingPartners && availablePartners.length === 0 && (
              <Alert
                message="No OCPI partners configured"
                description="No partners are available for this tenant. Please configure OCPI partners before publishing."
                type="warning"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          {selectedPartners.length === 0 && availablePartners.length > 0 && (
            <Alert
              message="Publishing to all configured OCPI partners"
              description={`This will publish to all ${availablePartners.length} configured partners`}
              type="info"
              showIcon
            />
          )}

          <Alert
            message="Validation Requirements"
            description={
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>
                  Location must have name, address, city, country, and
                  coordinates
                </li>
                <li>Location must have at least one charging station</li>
                <li>
                  Each charging station must have at least one EVSE with an EVSE
                  ID
                </li>
                <li>
                  Each EVSE must have at least one connector with type, format,
                  and power type
                </li>
              </ul>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Modal>
    </Card>
  );
};
