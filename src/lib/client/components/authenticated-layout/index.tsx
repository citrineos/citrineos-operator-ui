// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  MainMenu,
  MenuSection,
} from '@lib/client/components/main-menu/main.menu';
import AppModal from '@lib/client/components/modals';
import { useIsAuthenticated } from '@refinedev/core';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  authKey: string;
  fallback?: React.ReactNode;
};

export default function AuthenticatedLayout({
  children,
  authKey,
  fallback,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useIsAuthenticated();

  useEffect(() => {
    if (!isLoading && data?.authenticated === false) {
      console.log('Redirecting to login...');
      router.push('/login');
    }
  }, [isLoading, data, router]);

  // Determine active section from pathname
  const activeSection = pathname?.split('/')[1] || 'overview';

  // Determine route class name
  const routeClassName = pathname?.replace(/\//g, '-').substring(1) || 'root';

  // Show loading state
  if (isLoading) {
    return fallback || <div>Checking authentication...</div>;
  }

  // Show loading while redirecting
  if (!data?.authenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="relative">
      <div className="min-h-screen ml-20 bg-cover bg-[url(/gradient.svg)] dark:bg-[url(/gradient-dark.svg)]">
        <MainMenu activeSection={activeSection as MenuSection} />
        <div className="flex flex-col">
          <AppModal />
          <main className={`content-container ${routeClassName}`}>
            <div className="content-outer-wrap">
              <div className="content-inner-wrap">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
