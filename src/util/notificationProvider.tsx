// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode } from 'react';
import { HasuraClaimType } from '@util/auth';
import { NotificationProvider } from '@refinedev/core';
import { notification } from 'antd';

const getNotificationMessageDescriptionAndType = (
  message: string,
  type: 'success' | 'error' | 'progress',
  description: string | undefined,
): {
  message: ReactNode;
  type: 'success' | 'error' | 'progress';
  description: ReactNode | undefined;
} => {
  if (description) {
    const missingRequiredTenantId = description.includes(
      `missing session variable: "${HasuraClaimType.X_HARSURA_TENANT_ID}"`,
    );

    if (missingRequiredTenantId) {
      return {
        message: 'Not allowed',
        description: (
          <span>
            Missing required Parameter:{' '}
            <strong>{HasuraClaimType.X_HARSURA_TENANT_ID}</strong>
          </span>
        ),
        type: 'error',
      };
    }

    const fieldNotFoundRegex = new RegExp(
      "\"message\":\"field '([^']+)' not found in type: 'query_root'",
    );

    const validationFailedRegex = new RegExp(
      '"extensions":{[^}]*"code":"validation-failed"[^}]*}',
    );

    const isPermissionError =
      description &&
      validationFailedRegex.test(description) &&
      (description.includes('no mutations exist') ||
        fieldNotFoundRegex.test(description));

    if (isPermissionError) {
      return {
        message: 'You do not have permission to access this resource.',
        description:
          'Please contact your administrator if you believe this is a mistake.',
        type: 'error',
      };
    }
  }

  return {
    message,
    description,
    type,
  };
};

export const notificationProvider: NotificationProvider = {
  open: ({ key, message, type, description }) => {
    const {
      message: mappedMessage,
      type: mappedType,
      description: mappedDescription,
    } = getNotificationMessageDescriptionAndType(message, type, description);

    let method = notification.success;

    if (mappedType === 'error') {
      method = notification.error;
    }

    method({
      key,
      message: mappedMessage,
      description: mappedDescription,
    });
  },
  close: (key) => notification.destroy(key),
};
