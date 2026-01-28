// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import type { AuthorizationDto } from '@citrineos/base';
import { AuthorizationDetailCard } from '@lib/client/pages/authorizations/detail/authorization.detail.card';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import { AUTHORIZATIONS_SHOW_QUERY } from '@lib/queries/authorizations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useOne, useTranslate } from '@refinedev/core';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { AuthorizationDetailTabsCard } from '@lib/client/pages/authorizations/detail/authorization.detail.tabs.card';

type AuthorizationDetailProps = {
  params: { id: string };
};

export const AuthorizationDetail: React.FC<AuthorizationDetailProps> = ({
  params,
}) => {
  const { id } = params;
  const translate = useTranslate();

  const {
    query: { data: authData, isLoading: authLoading },
  } = useOne<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    id,
    meta: { gqlQuery: AUTHORIZATIONS_SHOW_QUERY },
    queryOptions: getPlainToInstanceOptions(AuthorizationClass, true),
  });
  const authorization = authData?.data;

  if (authLoading) return <p>{translate('loading')}</p>;
  if (!authorization) return <p>{translate('noDataFound')}</p>;

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.SHOW}
      fallback={<AccessDeniedFallback />}
      params={{ id: authorization.id }}
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <AuthorizationDetailCard authorization={authorization} />
        <AuthorizationDetailTabsCard authorization={authorization} />
      </div>
    </CanAccess>
  );
};
