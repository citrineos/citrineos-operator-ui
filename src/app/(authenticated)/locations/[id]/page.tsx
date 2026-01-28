// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { LocationsDetail } from '@lib/client/pages/locations/detail/locations.detail';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShowLocationPage({ params }: PageProps) {
  const { id } = await params;
  return <LocationsDetail params={{ id }} />;
}
