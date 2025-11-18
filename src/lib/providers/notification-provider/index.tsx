// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { UndoableNotification } from '@lib/client/components/ui/undoable-notification';
import { HasuraClaimType } from '@lib/utils/hasura.types';
import type { NotificationProvider } from '@refinedev/core';
import { toast } from 'sonner';

const getNotificationMessageDescriptionAndType = (
  message: string,
  type: 'success' | 'error' | 'progress',
  description: string | undefined,
): {
  message: string;
  type: 'success' | 'error' | 'progress';
  description: string | undefined;
} => {
  if (description) {
    const missingRequiredTenantId = description.includes(
      `missing session variable: "${HasuraClaimType.X_HASURA_TENANT_ID}"`,
    );

    if (missingRequiredTenantId) {
      return {
        message: 'Not allowed',
        description: `Missing required Parameter: ${HasuraClaimType.X_HASURA_TENANT_ID}`,
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
  open: ({
    key,
    message,
    type,
    description,
    undoableTimeout,
    cancelMutation,
  }) => {
    const {
      message: mappedMessage,
      type: mappedType,
      description: mappedDescription,
    } = getNotificationMessageDescriptionAndType(message, type, description);

    switch (mappedType) {
      case 'success':
        toast.success(mappedMessage, {
          id: key,
          description: mappedDescription,
          richColors: true,
        });
        return;

      case 'error':
        toast.error(mappedMessage, {
          id: key,
          description: mappedDescription,
          richColors: true,
        });
        return;

      case 'progress': {
        const toastId = key || Date.now();

        toast(
          () => (
            <UndoableNotification
              message={mappedMessage}
              description={mappedDescription}
              undoableTimeout={undoableTimeout}
              cancelMutation={cancelMutation}
              onClose={() => toast.dismiss(toastId)}
            />
          ),
          {
            id: toastId,
            duration: (undoableTimeout || 5) * 1000,
            unstyled: true,
          },
        );
        return;
      }

      default:
        return;
    }
  },
  close: (id) => {
    toast.dismiss(id);
  },
};
