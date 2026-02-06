// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useCallback } from 'react';
import type { AuthorizationDto } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Badge } from '@lib/client/components/ui/badge';
import { Button } from '@lib/client/components/ui/button';
import { AUTHORIZATIONS_DELETE_MUTATION } from '@lib/queries/authorizations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { CanAccess, useDelete, useTranslate } from '@refinedev/core';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import { heading2Style } from '@lib/client/styles/page';
import { buttonIconSize } from '@lib/client/styles/icon';
import { KeyValueDisplay } from '@lib/client/components/key-value-display';
import { NOT_APPLICABLE } from '@lib/utils/consts';

export interface AuthorizationDetailCardProps {
  authorization: AuthorizationDto;
}

export const AuthorizationDetailCard: React.FC<
  AuthorizationDetailCardProps
> = ({ authorization }) => {
  const { back, push } = useRouter();
  const { mutate } = useDelete();
  const translate = useTranslate();

  const handleDeleteClick = useCallback(() => {
    if (!authorization) return;

    mutate(
      {
        id: authorization.id?.toString() || '',
        resource: ResourceType.AUTHORIZATIONS,
        meta: {
          gqlMutation: AUTHORIZATIONS_DELETE_MUTATION,
        },
      },
      {
        onSuccess: () => {
          push(`/${MenuSection.AUTHORIZATIONS}`);
        },
      },
    );
  }, [authorization, mutate, push]);

  return (
    <Card>
      <CardHeader>
        <div className={cardHeaderFlex}>
          <ChevronLeft
            onClick={() => {
              if (window.history.state?.idx === 0)
                push(`/${MenuSection.AUTHORIZATIONS}`);
              else back();
            }}
            className="cursor-pointer"
          />
          <h2 className={heading2Style}>
            {translate('Authorizations.authorization')} {authorization.id}
          </h2>
          <CanAccess
            resource={ResourceType.AUTHORIZATIONS}
            action={ActionType.EDIT}
            params={{ id: authorization.id }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                push(`/${MenuSection.AUTHORIZATIONS}/${authorization.id}/edit`)
              }
            >
              <Edit className={buttonIconSize} />
              {translate('buttons.edit')}
            </Button>
          </CanAccess>
          <CanAccess
            resource={ResourceType.AUTHORIZATIONS}
            action={ActionType.DELETE}
            params={{ id: authorization.id }}
          >
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              <Trash2 className={buttonIconSize} />
              {translate('buttons.delete')}
            </Button>
          </CanAccess>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cardGridStyle}>
          <KeyValueDisplay keyLabel="ID Token" value={authorization.idToken} />
          <KeyValueDisplay
            keyLabel="Type"
            value={authorization.idTokenType}
            valueRender={(type) =>
              type ? <Badge>{type}</Badge> : NOT_APPLICABLE
            }
          />
          <KeyValueDisplay keyLabel="Status" value={authorization.status} />
          <KeyValueDisplay
            keyLabel="Partner"
            value={''}
            valueRender={() =>
              !authorization.tenantPartner?.partnerProfileOCPI?.roles?.[0]
                ?.businessDetails?.name ? (
                NOT_APPLICABLE
              ) : (
                <a
                  onClick={() =>
                    push(
                      `/${MenuSection.PARTNERS}/${authorization.tenantPartner?.id}`,
                    )
                  }
                >
                  {
                    authorization.tenantPartner?.partnerProfileOCPI?.roles?.[0]
                      ?.businessDetails?.name
                  }
                </a>
              )
            }
          />
          <KeyValueDisplay
            keyLabel="Allowed Types"
            value={authorization.allowedConnectorTypes}
            valueRender={(allowedTypes: string[]) =>
              allowedTypes?.length > 0 ? (
                allowedTypes.map((connectorType: string) => (
                  <Badge variant="muted" key={connectorType}>
                    {connectorType}
                  </Badge>
                ))
              ) : (
                <span>{NOT_APPLICABLE}</span>
              )
            }
          />
          <KeyValueDisplay
            keyLabel="Disallowed Prefixes"
            value={authorization.disallowedEvseIdPrefixes}
            valueRender={(disallowedPrefixes: string[]) =>
              disallowedPrefixes?.length > 0 ? (
                disallowedPrefixes.map((prefix: string) => (
                  <Badge variant="muted" key={prefix}>
                    {prefix}
                  </Badge>
                ))
              ) : (
                <span>{NOT_APPLICABLE}</span>
              )
            }
          />
          <KeyValueDisplay
            keyLabel="Concurrent Transactions"
            value={authorization.concurrentTransaction}
            valueRender={(concurrentTransaction) => (
              <Badge
                variant={concurrentTransaction ? 'success' : 'destructive'}
              >
                {concurrentTransaction ? 'Allowed' : 'Not Allowed'}
              </Badge>
            )}
          />
          <KeyValueDisplay
            keyLabel="Real-Time Authentication"
            value={authorization.realTimeAuth}
          />
          <KeyValueDisplay
            keyLabel="Real-Time Authentication URL"
            value={authorization.realTimeAuthUrl}
          />
          <KeyValueDisplay
            keyLabel="Real-Time Authentication Timeout"
            value={(authorization as any).realTimeAuthTimeout}
            valueRender={(timeout) =>
              timeout !== undefined && timeout !== null
                ? `${timeout} seconds`
                : NOT_APPLICABLE
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
