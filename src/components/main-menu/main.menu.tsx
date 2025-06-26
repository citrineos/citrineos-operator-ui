// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Layout, Menu, Row } from 'antd';
import React, { useState } from 'react';
import { HomeIcon } from '../icons/home.icon';
import { LocationIcon } from '../icons/location.icon';
import { Logo } from '../title';
import './style.scss';
import { HelpIcon } from '../icons/help.icon';
import { ArrowRightIcon } from '../icons/arrow.right.icon';
import { ArrowLeftIcon } from '../icons/arrow.left.icon';
import { useNavigate } from 'react-router-dom';
import { ChargingStationIcon } from '../icons/charging.station.icon';
import { ClipboardIcon } from '../icons/clipboard.icon';
import { BiDirectionsArrowsIcon } from '../icons/bi.directional.arrows.icon';

const { Sider } = Layout;

export enum MenuSection {
  OVERVIEW = 'overview',
  LOCATIONS = 'locations',
  CHARGING_STATIONS = 'charging-stations',
  AUTHORIZATIONS = 'authorizations',
  TRANSACTIONS = 'transactions',
}

export interface MainMenuProps {
  activeSection: MenuSection;
}

export const MainMenu = ({ activeSection }: MainMenuProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleSider = () => {
    setCollapsed((prev) => !prev);
  };

  // Custom click handler that supports Ctrl+Click
  // This function accepts any MouseEvent-like object with ctrlKey and metaKey properties
  const handleMenuClick = (
    e: { ctrlKey?: boolean; metaKey?: boolean } | React.MouseEvent,
    key: string,
  ) => {
    // Check if Ctrl or Cmd key (for Mac) is pressed
    if (e.ctrlKey || e.metaKey) {
      // Open in new tab by creating a temporary anchor and triggering a click
      const baseUrl = window.location.origin;
      const url = `${baseUrl}${key}`;
      window.open(url, '_blank');
    } else {
      // Regular click - use React Router navigation
      navigate(key);
    }
  };

  // Custom Menu.Item component with proper Ctrl+Click handling
  const MenuItem = ({
    key,
    label,
    icon,
  }: {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
  }) => {
    return {
      key,
      label: (
        <div
          onClick={(e) => {
            e.nativeEvent.stopPropagation(); // Prevent default Menu onClick
            handleMenuClick(e, key);
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {label}
        </div>
      ),
      icon: icon && (
        <span
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            handleMenuClick(e, key);
          }}
        >
          {icon}
        </span>
      ),
    };
  };

  const mainMenuItems = [
    MenuItem({
      key: `/${MenuSection.OVERVIEW}`,
      label: 'Overview',
      icon: <HomeIcon />,
    }),
    MenuItem({
      key: `/${MenuSection.LOCATIONS}`,
      label: 'Locations',
      icon: <LocationIcon />,
    }),
    MenuItem({
      key: `/${MenuSection.CHARGING_STATIONS}`,
      label: 'Charging Stations',
      icon: <ChargingStationIcon />,
    }),
    MenuItem({
      key: `/${MenuSection.AUTHORIZATIONS}`,
      label: 'Authorizations',
      icon: <ClipboardIcon />,
    }),
    MenuItem({
      key: `/${MenuSection.TRANSACTIONS}`,
      label: 'Transactions',
      icon: <BiDirectionsArrowsIcon />,
    }),
  ];

  // Handle the Help link differently since it's an external link
  const bottomMenuItems = [
    // TODO uncomment when notifications are ready
    // {
    //   key: 'notifications',
    //   label: <Link to="/home">Notifications</Link>,
    //   icon: <NotificationIcon />,
    // },
    {
      key: 'help',
      label: (
        <a
          href="https://citrineos.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Help
        </a>
      ),
      icon: (
        <a
          href="https://citrineos.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HelpIcon />
        </a>
      ),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={272}
      trigger={null}
      className="sider"
    >
      <Row style={{ minHeight: '130px' }}>
        <Logo collapsed={collapsed} />
      </Row>
      <Row className="main-menu">
        <Menu
          mode="inline"
          items={mainMenuItems}
          selectedKeys={[`/${activeSection}`]}
          style={{ width: '100%' }}
        />
      </Row>
      <Row className="bottom-menu">
        <Menu mode="inline" items={bottomMenuItems} style={{ width: '100%' }} />
      </Row>
      <div onClick={toggleSider} className="trigger">
        {collapsed ? <ArrowRightIcon /> : <ArrowLeftIcon />}
      </div>
    </Sider>
  );
};
