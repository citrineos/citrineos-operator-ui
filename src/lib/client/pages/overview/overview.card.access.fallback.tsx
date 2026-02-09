'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { heading2Style } from '@lib/client/styles/page';
import { useTranslate } from '@refinedev/core';

export const OverviewCardAccessFallback = () => {
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
