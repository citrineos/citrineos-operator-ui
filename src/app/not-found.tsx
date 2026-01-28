'use client';

import { ErrorComponent } from '@lib/client/components/ui/error-component';
import { Authenticated } from '@refinedev/core';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense>
      <Authenticated key="not-found">
        <ErrorComponent />
      </Authenticated>
    </Suspense>
  );
}
