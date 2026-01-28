// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

// Fallback component for unauthorized access to routes
import { useTranslate } from '@refinedev/core';

export const AccessDeniedFallback = () => {
  const translate = useTranslate();

  return (
    <div className="access-denied-container">
      <h2>{translate('accessDenied')}</h2>
      <p>{translate('buttons.notAccessTitle')}</p>
    </div>
  );
};
