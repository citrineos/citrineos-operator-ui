import { Link, useMenu } from '@refinedev/core';
import { Menu, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';
import { ThemedSiderV2 } from '@refinedev/antd';

export const MainMenu = (props: any) => {
  const { menuItems } = useMenu();

  const customMenuItems = [
    {
      key: 'home',
      label: (
        <Link to="/home">
          <HomeOutlined
            style={{ marginRight: 'var(--ant-menu-icon-margin-inline-end)' }}
          />
          <Space />
          Home
        </Link>
      ),
    },
  ];

  const menuList = menuItems.map((item) => (
    <Menu.Item key={item.key} icon={item.icon}>
      <Link to={item.route!}>{item.label}</Link>
    </Menu.Item>
  ));

  console.log('customMenuItems', customMenuItems, props);

  return (
    <ThemedSiderV2
      {...props}
      fixed
      render={() => (
        <Menu mode="inline">
          {customMenuItems.map((item) => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
          {menuList}
        </Menu>
      )}
    />
  );
};
