// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useState } from 'react';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { CanAccess, useTranslate } from '@refinedev/core';
import { ChargingStationDetailCard } from '@lib/client/pages/charging-stations/detail/charging.station.detail.card';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { ChargingStationDetailTabsCard } from '@lib/client/pages/charging-stations/detail/charging.station.detail.tabs.card';
import { S3_BUCKET_FOLDER_IMAGES_CHARGING_STATIONS } from '@lib/utils/consts';
import { getPresignedUrlForGet } from '@lib/server/actions/file/getPresingedUrlForGet';

type ChargingStationDetailProps = {
  params: { id: string };
};

export const ChargingStationDetail: React.FC<ChargingStationDetailProps> = ({
  params,
}) => {
  const { id } = params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const translate = useTranslate();

  useEffect(() => {
    if (id) {
      getPresignedUrlForGet(
        `${S3_BUCKET_FOLDER_IMAGES_CHARGING_STATIONS}/${id}`,
      ).then(setImageUrl);
    }
  }, [id]);

  if (!id) return <p>{translate('loading')}</p>;

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.SHOW}
      params={{ id }}
      fallback={
        <p className="text-muted-foreground">
          {translate('buttons.notAccessTitle')}{' '}
          {translate('ChargingStations.chargingStation')}
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
