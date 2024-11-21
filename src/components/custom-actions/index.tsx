import React, { useState, useMemo } from 'react';
import { Button, Drawer, Dropdown, Menu, Spin } from 'antd';
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
import { CustomActionsProps } from '@interfaces';

export const CustomActions = <T,>({
  data,
  actions = [],
  displayText = '',
  showInline = false,
  exclusionList = [],
}: CustomActionsProps<T>): React.ReactElement | null => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('Details');
  const [drawerContent, setDrawerContent] = useState<React.ReactNode | null>(
    null,
  );

  const iconMap: { [key: string]: React.ReactNode } = useMemo(
    () => ({
      'Certificate Signed': <SafetyCertificateOutlined />,
      'Change Availability': <SyncOutlined />,
      'Clear Cache': <ClearOutlined />,
      'Customer Information': <UserOutlined />,
      'Delete Certificate': <DeleteOutlined />,
      'Get Base Report': <FileTextOutlined />,
      'Get Installed Certificate IDs': <IdcardOutlined />,
      'Get Log': <FileSearchOutlined />,
      'Get Transaction Status': <FieldTimeOutlined />,
      'Get Variables': <ProfileOutlined />,
      'Install Certificate': <FileAddOutlined />,
      'Remote Start': <PlayCircleOutlined />,
      'Remote Stop': <StopOutlined />,
      Reset: <ReloadOutlined />,
      'Set Network Profile': <GlobalOutlined />,
      'Set Variables': <SettingOutlined />,
      'Trigger Message': <MessageOutlined />,
      'Unlock Connector': <UnlockOutlined />,
      'Update Firmware': <CloudUploadOutlined />,
    }),
    [],
  );

  const getIcon = (label: keyof typeof iconMap) =>
    iconMap[label] || <ThunderboltOutlined />;

  const items = useMemo(
    () =>
      actions
        .filter((action) => !exclusionList?.includes(action.label))
        .filter((action) => (action.isVisible ? action.isVisible(data) : true))
        .map((action, index) => ({
          key: index.toString(),
          label: action.label,
          onClick: () => {
            const result = action.execOrRender(data, setLoading, dispatch);
            if (React.isValidElement(result)) {
              setDrawerContent(result);
              setDrawerTitle(action.label);
              setVisible(true);
            }
          },
        })),
    [actions, data, dispatch, exclusionList],
  );

  const onDrawerClose = () => {
    setVisible(false);
    setDrawerContent(null);
    setDrawerTitle('Details');
  };

  if (loading) {
    return <Spin />;
  }

  if (!items.length) {
    return null;
  }

  return (
    <>
      {showInline ? (
        <Menu mode="inline">
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={getIcon(item.label as string)}
              onClick={item.onClick}
              data-testid="custom-action-dropdown-menu-item"
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            size="small"
            icon={<MoreOutlined />}
            data-testid="custom-action-dropdown-button"
            type={displayText ? 'primary' : 'default'}
            style={displayText ? { marginLeft: 5 } : undefined}
          >
            {displayText}
          </Button>
        </Dropdown>
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
