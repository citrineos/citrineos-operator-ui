// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { LocationsMap } from '@lib/client/pages/locations/map/locations.map';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LocationsCard = () => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between p-6">
        <h4 className="text-lg font-semibold">Locations</h4>
        <div
          className="link flex items-center cursor-pointer"
          onClick={() => push(`/${MenuSection.LOCATIONS}`)}
        >
          View all <ChevronRightIcon />
        </div>
      </div>
      <div className="h-full rounded-b-lg overflow-hidden">
        <LocationsMap />
      </div>
    </div>
  );
};
