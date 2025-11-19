// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useState } from 'react';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { CanAccess } from '@refinedev/core';
import { ChargingStationDetailCard } from '@lib/client/pages/charging-stations/detail/charging.station.detail.card';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { ChargingStationDetailTabsCard } from '@lib/client/pages/charging-stations/detail/charging.station.detail.tabs.card';
import { fetchUrlFromS3 } from '@lib/utils/file';
import { S3_BUCKET_FOLDER_IMAGES } from '@lib/utils/consts';

type ChargingStationDetailProps = {
  params: { id: string };
};

export const ChargingStationDetail: React.FC<ChargingStationDetailProps> = ({
  params,
}) => {
  const { id } = params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUrlFromS3(
        `${S3_BUCKET_FOLDER_IMAGES}/${ResourceType.CHARGING_STATIONS}/${id}`,
      ).then(setImageUrl);
    }
  }, [id]);

  if (!id) return <p>Loading...</p>;

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.SHOW}
      params={{ id }}
      fallback={
        <p className="text-muted-foreground">
          You don&#39;t have permission to view this charging station.
        </p>
      }
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <ChargingStationDetailCard stationId={id} imageUrl={imageUrl} />
        <ChargingStationDetailTabsCard stationId={id} />
      </div>
    </CanAccess>
  );
};
