// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import type { TransactionDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Badge } from '@lib/client/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import { clickableLinkStyle, heading2Style } from '@lib/client/styles/page';
import { KeyValueDisplay } from '@lib/client/components/key-value-display';
import { Link, useTranslate } from '@refinedev/core';
import { NOT_APPLICABLE } from '@lib/utils/consts';
import { TimestampDisplay } from '@lib/client/components/timestamp-display';

export interface TransactionDetailCardProps {
  transaction: TransactionDto;
}

export const TransactionDetailCard = ({
  transaction,
}: TransactionDetailCardProps) => {
  const { back, push } = useRouter();
  const translate = useTranslate();

  return (
    <Card>
      <CardHeader>
        <div className={cardHeaderFlex}>
          <ChevronLeft
            onClick={() => {
              if (window.history.state?.idx === 0) {
                push(`/${MenuSection.TRANSACTIONS}`);
              } else {
                back();
              }
            }}
            className="cursor-pointer"
          />
          <h2 className={heading2Style}>
            {translate('Transactions.transaction')} {transaction.transactionId}
          </h2>
          <Badge variant={transaction.isActive ? 'success' : 'destructive'}>
            {transaction.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cardGridStyle}>
          <KeyValueDisplay
            keyLabel="Authorization"
            value={''}
            valueRender={() =>
              transaction.authorization?.idToken ? (
                <Link
                  to={`/${MenuSection.AUTHORIZATIONS}/${transaction.authorizationId}`}
                  className={clickableLinkStyle}
                  title={transaction.authorization.idToken}
                >
                  {transaction.authorization.idToken}
                </Link>
              ) : (
                <span>{NOT_APPLICABLE}</span>
              )
            }
          />
          <KeyValueDisplay
            keyLabel="Station ID"
            value={''}
            valueRender={() => (
              <Link
                to={`/${MenuSection.CHARGING_STATIONS}/${transaction.stationId}`}
                className={clickableLinkStyle}
                title={transaction.stationId}
              >
                {transaction.stationId}
              </Link>
            )}
          />
          <KeyValueDisplay
            keyLabel="Location"
            value={''}
            valueRender={() => (
              <Link
                to={`/${MenuSection.LOCATIONS}/${transaction.locationId}`}
                className={clickableLinkStyle}
                title={transaction.locationId}
              >
                {transaction.location?.name ?? NOT_APPLICABLE}
              </Link>
            )}
          />
          <KeyValueDisplay
            keyLabel="Total kWh"
            value={`${
              transaction.totalKwh ? transaction.totalKwh.toFixed(2) : 0
            } kWh`}
          />
          <KeyValueDisplay
            keyLabel="Charging State"
            value={transaction.chargingState}
          />
          <KeyValueDisplay
            keyLabel="Start Time"
            value={transaction.startTime}
            valueRender={(startTime) => (
              <TimestampDisplay isoTimestamp={startTime ?? ''} />
            )}
          />
          <KeyValueDisplay
            keyLabel="End Time"
            value={transaction.endTime}
            valueRender={(endTime) => (
              <TimestampDisplay isoTimestamp={endTime ?? ''} />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
