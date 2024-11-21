import React, { useState } from 'react';
import { Button, Drawer, Dropdown, Menu, MenuProps, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

export interface CustomAction<T> {
  label: string;
  icon?: React.ReactNode;
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
        icon: action.icon,
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

  return (
    <>
      {showInline ? (
        <>
          <Menu mode="inline">
            {items.map((item: any) => {
              return (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
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
