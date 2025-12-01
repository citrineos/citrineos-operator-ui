// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { LocationDto } from '@citrineos/base';
import { Card, CardContent } from '@lib/client/components/ui/card';
import { LocationsChargingStationsTable } from '@lib/client/pages/locations/list/locations.charging.stations.table';
import { LocationClass } from '@lib/cls/location.dto';
import { LOCATIONS_GET_QUERY } from '@lib/queries/locations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useOne } from '@refinedev/core';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { LocationDetailCard } from '@lib/client/pages/locations/detail/location.detail.card';
import { useState, useEffect } from 'react';
import { S3_BUCKET_FOLDER_IMAGES_LOCATIONS } from '@lib/utils/consts';
import { getPresignedUrlForGet } from '@lib/server/actions/file/getPresingedUrlForGet';

type LocationDetailProps = {
  params: { id: string };
};

export const LocationsDetail = ({ params }: LocationDetailProps) => {
  const { id } = params;
  const {
    query: { data, isLoading },
  } = useOne<LocationDto>({
    resource: ResourceType.LOCATIONS,
    id,
    meta: {
      gqlQuery: LOCATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(LocationClass, true),
  });

  const location = data?.data;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (location?.id) {
      getPresignedUrlForGet(
        `${S3_BUCKET_FOLDER_IMAGES_LOCATIONS}/${location.id}`,
      ).then(setImageUrl);
    }
  }, [location?.id]);

  if (isLoading) return <p>Loading...</p>;
  if (!location) return <p>No Data Found</p>;

  return (
    <CanAccess
      resource={ResourceType.LOCATIONS}
      action={ActionType.SHOW}
      params={{ id: location.id }}
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <LocationDetailCard location={location} imageUrl={imageUrl} />

        <Card>
          <CardContent>
            <LocationsChargingStationsTable location={location} showHeader />
          </CardContent>
        </Card>
      </div>
    </CanAccess>
  );
};
