// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ITenantDto, ITenantPartnerDto } from '@citrineos/base';

export class TenantPartnerDto implements Partial<ITenantPartnerDto> {
  id?: number;
  countryCode?: string | null;
  partyId?: string | null;
  partnerProfileOCPI?: any;
  updatedAt?: Date;
  createdAt?: Date;
  tenant?: ITenantDto;
  tenantId: number | undefined;
}
