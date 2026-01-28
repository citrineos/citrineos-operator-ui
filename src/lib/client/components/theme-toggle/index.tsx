// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@lib/client/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { sidebarIconSize } from '@lib/client/styles/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lib/client/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useTranslate } from '@refinedev/core';

export const ThemeToggle = ({ expanded }: { expanded: boolean }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const translate = useTranslate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={expanded ? 'default' : 'icon'}
            className={
              theme === 'light'
                ? 'bg-(--light-mode) text-(--light-mode-foreground) hover:bg-(--light-mode-foreground) hover:text-(--light-mode)'
                : 'bg-(--dark-mode) text-(--dark-mode-foreground) hover:bg-(--dark-mode-foreground) hover:text-(--dark-mode)'
            }
            onClick={onToggleTheme}
          >
            {theme === 'light' ? (
              <Sun className={sidebarIconSize} />
            ) : (
              <Moon className={sidebarIconSize} />
            )}
            {expanded && (
              <span>
                {translate(
                  `menu.themes.${theme === 'light' ? 'light' : 'dark'}`,
                )}{' '}
                {translate('menu.themes.mode')}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {translate('menu.themes.changeTo')}{' '}
          {translate(`menu.themes.${theme === 'light' ? 'dark' : 'light'}`)}{' '}
          {translate('menu.themes.mode')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
