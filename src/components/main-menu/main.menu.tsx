import { Layout, Menu, Row } from 'antd';
import { Link } from '@refinedev/core';
import React, { useState } from 'react';
import { HomeIcon } from '../icons/home.icon';
import { LocationIcon } from '../icons/location.icon';
import { Logo } from '../title';
import './style.scss';
import { NotificationIcon } from '../icons/notification.icon';
import { HelpIcon } from '../icons/help.icon';
import { ArrowRightIcon } from '../icons/arrow.right.icon';
import { ArrowLeftIcon } from '../icons/arrow.left.icon';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export const MainMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleSider = () => {
    setCollapsed((prev) => !prev);
  };

  const handleMenuClick = (key: string) => {
    navigate(key); // ✅ Manually trigger navigation
  };

  const mainMenuItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <HomeIcon />,
    },
    {
      key: 'locations',
      label: 'Locations',
      icon: <LocationIcon />,
    },
  ];

  const bottomMenuItems = [
    {
      key: 'notifications',
      label: <Link to="/home">Notifications</Link>,
      icon: <NotificationIcon />,
    },
    {
      key: 'help',
      label: <Link to="/home">Help</Link>,
      icon: <HelpIcon />,
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
          onClick={({ key }) => handleMenuClick(key)}
          items={mainMenuItems}
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
