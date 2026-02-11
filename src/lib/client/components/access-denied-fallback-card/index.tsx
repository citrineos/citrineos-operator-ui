// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { heading2Style } from '@lib/client/styles/page';
import { useTranslate } from '@refinedev/core';

export const AccessDeniedFallbackCard = () => {
  const translate = useTranslate();

  return (
    <Card>
      <CardHeader>
        <h2 className={heading2Style}>{translate('accessDenied')}</h2>
      </CardHeader>
      <CardContent>
        <p>{translate('buttons.notAccessTitle')}</p>
      </CardContent>
    </Card>
  );
};
