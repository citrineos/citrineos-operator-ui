// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@lib/client/components/ui/button';
import { LogOut } from 'lucide-react';
import { authProvider } from '@lib/providers/auth-provider';
import { sidebarIconSize } from '@lib/client/styles/icon';
import { toast } from 'sonner';
import { useTranslate } from '@refinedev/core';

export const LogoutButton = ({ expanded }: { expanded: boolean }) => {
  const router = useRouter();
  const translate = useTranslate();

  const logout = () => {
    authProvider.logout({}).then((authResponse) => {
      toast.success(translate('loggedOut'));
      router.push(authResponse.redirectTo ?? '');
    });
  };
  return (
    <Button
      size={expanded ? 'default' : 'icon'}
      variant="ghost"
      onClick={logout}
    >
      <LogOut className={sidebarIconSize} />
      {expanded && <span>{translate('buttons.logout')}</span>}
    </Button>
  );
};
