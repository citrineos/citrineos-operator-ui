// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { getFullAddress } from '@util/geocoding';
import { Button, Descriptions, Flex, Tag, Alert, Switch, Tooltip } from 'antd';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CanAccess, useNavigation } from '@refinedev/core';
import { ActionType, ResourceType } from '@util/auth';
import { ILocationDto } from '@citrineos/base';
import { EditOutlined } from '@ant-design/icons';
import { NOT_APPLICABLE } from '@util/consts';
import { useNotification } from '@refinedev/core';
import { useMutation } from '@tanstack/react-query';
import { OcpiRestClient } from '@util/OcpiRestClient';

interface PublishLocationResponse {
  success: boolean;
  locationId: string;
  publishedToPartners: string[];
  validationErrors?: string[];
  publishedEvses: number;
  publishedConnectors: number;
}

export interface LocationDetailCardProps {
  location: ILocationDto;
  onRefresh?: () => void;
}

export const LocationDetailCard = ({
  location,
  onRefresh,
}: LocationDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();
  const { open } = useNotification();

  const [optimisticPublished, setOptimisticPublished] = React.useState(false);
  const effectivePublished = location.isPublished || optimisticPublished;

  const { mutate: publishLocation, isLoading: isPublishing } = useMutation({
    mutationFn: async () => {
      const client = new OcpiRestClient();
      return client.post<PublishLocationResponse>(
        `locations/${location.id}/publish`,
        {},
        {},
      );
    },
    onSuccess: (data: PublishLocationResponse) => {
      if (data.success) {
        open?.({
          type: 'success',
          message: 'Publication Successful',
          description: `Location with ${data?.publishedEvses || 0} EVSEs and ${data?.publishedConnectors || 0} connectors published to ${data?.publishedToPartners?.length || 0} partners`,
        });
        if (onRefresh) onRefresh();
      } else {
        open?.({
          type: 'error',
          message: 'Publication Failed',
          description: data.validationErrors?.length
            ? data.validationErrors.join(', ')
            : 'Failed to publish location hierarchy to OCPI partners',
        });
        setOptimisticPublished(false);
      }
    },
    onError: (error: any) => {
      open?.({
        type: 'error',
        message: 'Publication Failed',
        description:
          error?.message ||
          'Failed to publish location hierarchy to OCPI partners',
      });
      // Revert optimistic state if it failed
      setOptimisticPublished(false);
    },
  });

  const handleToggleChange = (checked: boolean) => {
    // Only support publishing (one-way). Ignore attempts to un-check.
    if (!checked) return;
    if (effectivePublished || isPublishing) return;

    // Optimistic UI update
    setOptimisticPublished(true);
    publishLocation();
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
                : 'Publish location & full hierarchy upstream'
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
              ? 'This location hierarchy has been (or is being) published to OCPI partners.'
              : 'Toggle to publish this location (including EVSEs & connectors) to all OCPI partners.'
          }
          type={effectivePublished ? 'success' : 'info'}
          showIcon
        />
        {location.validationErrors?.length ? (
          <Alert
            style={{ marginTop: 8 }}
            message="Last Validation Errors"
            description={
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {location.validationErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
          />
        ) : null}
        {optimisticPublished && !location.isPublished && (
          <Tag color="processing" style={{ marginTop: 8 }}>
            Publishing…
          </Tag>
        )}
      </Flex>
    </Flex>
  );
};
