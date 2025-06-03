// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex, Layout as AntdLayout, Menu, theme } from 'antd';
import React, { useContext, useMemo } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import './style.scss';
import { SearchIcon } from '../icons/search.icon';
import { AvatarIcon } from '../icons/avatar.icon';
import { useNavigate } from 'react-router-dom';
import { MenuSection } from '../main-menu/main.menu';
import { DarkModeSwitch } from './dark-mode-switch/dark.mode.switch';

const { useToken } = theme;

export interface HeaderProps {
  activeSection: MenuSection;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
}: HeaderProps) => {
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    switch (activeSection) {
      case MenuSection.LOCATIONS:
        return [
          { key: `/${MenuSection.LOCATIONS}`, label: 'Locations' },
          // { key: `/${MenuSection.LOCATIONS}/map`, label: 'Map View' },
        ];
      case MenuSection.CHARGING_STATIONS:
        return [
          {
            key: `/${MenuSection.CHARGING_STATIONS}`,
            label: 'Charging Stations',
          },
        ];
      case MenuSection.AUTHORIZATIONS:
        return [
          { key: `/${MenuSection.AUTHORIZATIONS}`, label: 'Authorizations' },
        ];
      case MenuSection.TRANSACTIONS:
        return [{ key: `/${MenuSection.TRANSACTIONS}`, label: 'Transactions' }];
      case MenuSection.OVERVIEW:
      default:
        return [
          { key: `/${MenuSection.OVERVIEW}`, label: 'Overview' },
          // { key: `/${MenuSection.OVERVIEW}/alerts`, label: 'Alerts' },
        ];
    }
  }, [activeSection]);

  return (
    <AntdLayout.Header
      className="header"
      style={{ backgroundColor: token.colorBgElevated }}
    >
      <Flex flex={1} justify={'space-between'}>
        <Flex flex={1}>
          <Menu
            style={{ width: '100%', borderBottom: 'none' }}
            mode="horizontal"
            selectedKeys={[`/${activeSection}`]}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
          />
        </Flex>

        {/* <Flex align={'center'} gap={32}>
          <DarkModeSwitch
            isDarkMode={mode === 'dark'}
            toggleDarkMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
          <div className="search">
            <SearchIcon />
          </div>
          <div className="avatar">
            <AvatarIcon />
          </div>
        </Flex> */}
      </Flex>
    </AntdLayout.Header>
  );
};
