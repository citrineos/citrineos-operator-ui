// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  Dropdown,
  Flex,
  Layout as AntdLayout,
  Menu,
  theme,
  Typography,
} from 'antd';
import React, { useContext, useMemo } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import './style.scss';
import { SearchIcon } from '../icons/search.icon';
import { AvatarIcon } from '../icons/avatar.icon';
import { useNavigate } from 'react-router-dom';
import { MenuSection } from '../main-menu/main.menu';
import { DarkModeSwitch } from './dark-mode-switch/dark.mode.switch';
import { useGetIdentity, useLogout } from '@refinedev/core';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { User } from '../../util/auth/types';

const { useToken } = theme;
const { Text } = Typography;

export interface HeaderProps {
  activeSection: MenuSection;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
}: HeaderProps) => {
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<User>();
  const { mutate: logout } = useLogout();

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

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div>
          <Text strong>{user?.name || 'User'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.email}
          </Text>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => logout(),
    },
  ];

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

        <Flex align={'center'} gap={32}>
          <DarkModeSwitch
            isDarkMode={mode === 'dark'}
            toggleDarkMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
          <div className="search">
            <SearchIcon />
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={
                user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AvatarIcon />
                )
              }
              className="avatar-button"
            >
              {user?.name && (
                <Text style={{ marginLeft: 8, color: 'inherit' }}>
                  {user.name}
                </Text>
              )}
            </Button>
          </Dropdown>
        </Flex>
      </Flex>
    </AntdLayout.Header>
  );
};
