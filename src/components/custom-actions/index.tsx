// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button, Drawer, Dropdown, Menu, MenuProps, Spin } from 'antd';
import {
  ClearOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MessageOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StopOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

export interface CustomAction<T> {
  label: string;
  isVisible?: (arg: T) => boolean;
  execOrRender: (
    arg: T,
    setLoading: (loading: boolean) => void,
    dispatch: Dispatch,
  ) => void | React.ReactNode; // This function can either perform an action or return a view
}

interface CustomActionsProps<T> {
  actions?: CustomAction<T>[];
  data: T; // The current row data that will be passed to the action
  showInline?: boolean;
}

export const CustomActions = <T,>({
  actions,
  data,
  showInline = false,
}: CustomActionsProps<T>): React.ReactElement => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode | null>(
    null,
  );
  const [drawerTitle, setDrawerTitle] = useState<React.ReactNode | null>(
    'Details',
  );
  const dispatch = useDispatch();

  const handleMenuClick = (action: CustomAction<T>) => {
    const result = action.execOrRender(data, setLoading, dispatch);
    if (React.isValidElement(result)) {
      setDrawerContent(result);
      setDrawerTitle(action.label);
      setVisible(true); // Open the drawer with the returned content
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
    setDrawerContent(null); // Clear the content when the drawer is closed
    setDrawerTitle('Details');
  };

  const items: MenuProps['items'] = actions
    ?.filter((action) => (action.isVisible ? action.isVisible?.(data) : true))
    .map((action, index) => {
      return {
        key: index.toString(),
        label: action.label,
        onClick: () => handleMenuClick(action),
      };
    });

  if (!items || items.length === 0) {
    return <></>;
  }

  if (loading) {
    return <Spin />;
  }

  const getIcon = (label: string) => {
    switch (label) {
      case 'Certificate Signed':
        return <SafetyCertificateOutlined />;
      case 'Change Availability':
        return <SyncOutlined />;
      case 'Clear Cache':
        return <ClearOutlined />;
      case 'Customer Information':
        return <UserOutlined />;
      case 'Delete Certificate':
        return <DeleteOutlined />;
      case 'Get Base Report':
        return <FileTextOutlined />;
      case 'Get Installed Certificate IDs':
        return <IdcardOutlined />;
      case 'Get Log':
        return <FileSearchOutlined />;
      case 'Get Transaction Status':
        return <FieldTimeOutlined />;
      case 'Get Variables':
        return <ProfileOutlined />;
      case 'Install Certificate':
        return <FileAddOutlined />;
      case 'Remote Start':
        return <PlayCircleOutlined />;
      case 'Remote Stop':
        return <StopOutlined />;
      case 'Reset':
        return <ReloadOutlined />;
      case 'Set Network Profile':
        return <GlobalOutlined />;
      case 'Set Variables':
        return <SettingOutlined />;
      case 'Trigger Message':
        return <MessageOutlined />;
      case 'Unlock Connector':
        return <UnlockOutlined />;
      case 'Update Firmware':
        return <CloudUploadOutlined />;
      default:
        return <ThunderboltOutlined />;
    }
  };

  return (
    <>
      {showInline ? (
        <>
          <Menu mode="inline">
            {items.map((item: any) => {
              return (
                <Menu.Item
                  key={item.key}
                  icon={getIcon(item.label)}
                  onClick={item.onClick}
                  data-testid="custom-action-dropdown-menu-item"
                >
                  {item.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </>
      ) : (
        <>
          <Dropdown menu={{ items }} trigger={['click']} placement="bottom">
            <Button
              size="small"
              type={'default'}
              icon={<MoreOutlined />}
              data-testid="custom-action-dropdown-button"
            />
          </Dropdown>
        </>
      )}
      <Drawer
        title={drawerTitle}
        open={visible}
        onClose={onDrawerClose}
        width="50%"
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
