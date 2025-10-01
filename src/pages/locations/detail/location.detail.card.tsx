// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { getFullAddress } from '@util/geocoding';
import {
  Button,
  Descriptions,
  Flex,
  Tag,
  Alert,
  Switch,
  Tooltip,
  Modal,
  Select,
  Space,
  Checkbox,
  Row,
  Col,
} from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CanAccess, useNavigation, useList } from '@refinedev/core';
import { ActionType, ResourceType } from '@util/auth';
import { ILocationDto, IEvseDto } from '@citrineos/base';
import { EditOutlined } from '@ant-design/icons';
import { NOT_APPLICABLE } from '@util/consts';
import { useNotification } from '@refinedev/core';
import { useMutation } from '@tanstack/react-query';
import { OcpiRestClient } from '@util/OcpiRestClient';
import { PARTNERS_LIST_QUERY } from '../../partners/queries';
import config from '@util/config';

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

interface PublishLocationRequest {
  partnerIds?: string[];
  evseIds?: string[];
}

export interface LocationDetailCardProps {
  location: ILocationDto;
  onRefresh?: () => void;
}

export const LocationDetailCard = ({ location }: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();
  const { open } = useNotification();

  const [optimisticPublished, setOptimisticPublished] = React.useState(false);
  const [isPublishModalVisible, setIsPublishModalVisible] =
    React.useState(false);
  const [selectedPartners, setSelectedPartners] = React.useState<string[]>([]);
  const [selectedEvses, setSelectedEvses] = React.useState<string[]>([]);
  const effectivePublished = location.isPublished || optimisticPublished;

  const evses = location.chargingPool?.flatMap(
    (cp) => cp.evses || [],
  ) as IEvseDto[];

  // Fetch partners data
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
        countryCode: partner.countryCode,
        partyId: partner.partyId,
      };
    }) || [];

  const { mutate: publishLocation, isLoading: isPublishing } = useMutation({
    mutationFn: async (request: PublishLocationRequest) => {
      const client = new OcpiRestClient();
      return client.post<PublishLocationResponse>(
        `locations/${location.id}/publish`,
        {},
        request,
      );
    },
    onSuccess: (data: PublishLocationResponse) => {
      if (data.success) {
        open?.({
          type: 'success',
          message: 'Publication Successful',
          description: `Location published to ${data?.publishedToPartners?.length || 0} partners. ${data?.publishedEvses || 0} EVSEs updated.`,
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
            'Failed to publish location to OCPI partners'
          ),
        });
        setOptimisticPublished(false);
      }
      setIsPublishModalVisible(false);
      setSelectedPartners([]);
      setSelectedEvses([]);
    },
    onError: (error: any) => {
      open?.({
        type: 'error',
        message: 'Publication Failed',
        description:
          error?.message || 'Failed to publish location to OCPI partners',
      });
      setOptimisticPublished(false);
      setIsPublishModalVisible(false);
      setSelectedPartners([]);
      setSelectedEvses([]);
    },
  });

  const handleToggleChange = (checked: boolean) => {
    if (!checked) return;
    if (effectivePublished || isPublishing) return;
    setIsPublishModalVisible(true);
  };

  const handlePublish = () => {
    setOptimisticPublished(true);
    const request: PublishLocationRequest = {};
    if (selectedPartners.length > 0) {
      request.partnerIds = selectedPartners;
    }
    if (selectedEvses.length > 0) {
      request.evseIds = selectedEvses;
    }
    publishLocation(request);
  };

  const handleModalCancel = () => {
    setIsPublishModalVisible(false);
    setSelectedPartners([]);
    setSelectedEvses([]);
  };

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={16} align={'center'}>
          <ArrowLeftIcon
            onClick={() => {
              if (pageLocation.key === 'default') {
                push(`/${MenuSection.LOCATIONS}`);
              } else {
                goBack();
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>{location.name}</h3>
          <CanAccess
            resource={ResourceType.LOCATIONS}
            action={ActionType.EDIT}
            params={{ id: location.id }}
          >
            <Button
              className="secondary btn-md"
              icon={<EditOutlined />}
              iconPosition="end"
              onClick={() =>
                push(`/${MenuSection.LOCATIONS}/${location.id}/edit`)
              }
            >
              Edit
            </Button>
          </CanAccess>
        </Flex>
        <Descriptions
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
          colon={false}
          classNames={{
            label: 'description-label',
          }}
        >
          <Descriptions.Item label="Address">
            {getFullAddress(location)}
          </Descriptions.Item>
          <Descriptions.Item label="Latitude">
            {location?.coordinates
              ? location.coordinates.coordinates[1].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Longitude">
            {location?.coordinates
              ? location.coordinates.coordinates[0].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Time Zone">
            {location.timeZone}
          </Descriptions.Item>
          <Descriptions.Item label="Parking Type">
            {location.parkingType ?? NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Facilities">
            {location.facilities
              ? location.facilities.map((facility) => <Tag>{facility}</Tag>)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Total Chargers">
            {location.chargingPool?.length ?? 0}
          </Descriptions.Item>
        </Descriptions>
        <Flex justify="space-between" align="center">
          <span>Publish Status</span>
          <Tooltip
            title={
              effectivePublished
                ? 'Already published'
                : 'Publish location upstream'
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
        </Flex>
        <Alert
          message={effectivePublished ? 'Published' : 'Not Published'}
          description={
            effectivePublished
              ? 'This location has been (or is being) published to OCPI partners.'
              : 'Toggle to publish this location to all OCPI partners.'
          }
          type={effectivePublished ? 'success' : 'info'}
          showIcon
        />

        {optimisticPublished && !location.isPublished && (
          <Tag color="processing" style={{ marginTop: 8 }}>
            Publishing…
          </Tag>
        )}
      </Flex>

      {/* Publish Modal */}
      <Modal
        title="Publish Location to OCPI Partners"
        open={isPublishModalVisible}
        onOk={handlePublish}
        onCancel={handleModalCancel}
        confirmLoading={isPublishing}
        okText="Publish Location"
        cancelText="Cancel"
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Location Publication"
            description="This will publish the location to OCPI partners. You can also select EVSEs to publish."
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
          </div>

          <div>
            <span>Select EVSEs to publish (optional):</span>
            <Checkbox.Group
              style={{ width: '100%', marginTop: 8 }}
              onChange={(checkedValues) =>
                setSelectedEvses(checkedValues as string[])
              }
              value={selectedEvses}
            >
              <Row>
                {evses.map((evse) => (
                  <Col span={8} key={evse.id}>
                    <Checkbox value={evse.id}>
                      {evse.physicalReference || evse.evseId}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>

          {selectedPartners.length === 0 && availablePartners.length > 0 && (
            <Alert
              message="Publishing to all configured OCPI partners"
              description={`This will publish to all ${availablePartners.length} configured partners`}
              type="info"
              showIcon
            />
          )}
        </Space>
      </Modal>
    </Flex>
  );
};
