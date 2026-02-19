// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { LocationDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table, type ColumnProps } from '@lib/client/components/table';
import { Button } from '@lib/client/components/ui/button';
import { getChargingStationColumns } from '@lib/client/pages/charging-stations/columns';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { CanAccess, useTranslate, type HttpError } from '@refinedev/core';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { heading3Style, pageFlex } from '@lib/client/styles/page';
import { cardHeaderFlex } from '@lib/client/styles/card';
import { buttonIconSize } from '@lib/client/styles/icon';
import { renderColumns } from '@lib/client/hooks/useColumnPreferences';

export interface LocationsChargingStationsTableProps {
  location: LocationDto;
  showHeader?: boolean;
}

export const LocationsChargingStationsTable = ({
  location,
  showHeader = false,
}: LocationsChargingStationsTableProps) => {
  const { push } = useRouter();
  const translate = useTranslate();

  // Use filteredStations if provided, otherwise use all stations from the location
  const stationsToDisplay = location.chargingPool ?? [];

  const renderedColumns = renderColumns(getChargingStationColumns(false));

  return (
    <div className={pageFlex}>
      {showHeader && (
        <div className={cardHeaderFlex}>
          <h3 className={heading3Style}>
            {translate('ChargingStations.ChargingStations')}
          </h3>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.CREATE}
          >
            <Button
              variant="success"
              size="sm"
              onClick={() =>
                push(
                  `/${MenuSection.CHARGING_STATIONS}/new?locationId=${location.id}`,
                )
              }
            >
              <Plus className={buttonIconSize} />
              {translate('buttons.add')}
            </Button>
          </CanAccess>
        </div>
      )}
      <CanAccess
        resource={ResourceType.CHARGING_STATIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table data={stationsToDisplay} useClientData>
          {renderedColumns}
        </Table>
      </CanAccess>
    </div>
  );
};
