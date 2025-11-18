// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { TenantPartnerClass } from '@lib/cls/tenant.partner.cls';
import { PARTNER_DETAIL_QUERY } from '@lib/queries/tenant.partners';
import { ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { useOne } from '@refinedev/core';
import { PartnerDetailCard } from '@lib/client/pages/partners/detail/partner.detail.card';
import type { TenantPartnerDto } from '@citrineos/base';
import { PartnerDetailTabsCard } from '@lib/client/pages/partners/detail/partner.detail.tabs.card';
import { pageFlex, pageMargin } from '@lib/client/styles/page';

type PartnersDetailProps = {
  params: { id: string };
};

export const PartnersDetail = ({ params }: PartnersDetailProps) => {
  const { id } = params;
  const {
    query: { data },
  } = useOne<TenantPartnerClass>({
    resource: ResourceType.PARTNERS,
    id,
    meta: {
      gqlQuery: PARTNER_DETAIL_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(TenantPartnerClass, true),
  });

  const tenantPartner = data?.data as TenantPartnerDto;

  return (
    <div className={`${pageMargin} ${pageFlex}`}>
      <PartnerDetailCard tenantPartner={tenantPartner} />
      <PartnerDetailTabsCard tenantPartner={tenantPartner} />
    </div>
  );
};
