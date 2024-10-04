import React, { useState } from 'react';
import { Button, Drawer, Dropdown, MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

export interface CustomAction<T> {
  label: string;
  execOrRender: (arg: T) => void | React.ReactNode; // This function can either perform an action or return a view
}

interface CustomActionsProps<T> {
  actions?: CustomAction<T>[];
  data: T; // The current row data that will be passed to the action
}

export const CustomActions = <T,>({
  actions,
  data,
}: CustomActionsProps<T>): React.ReactElement => {
  const [visible, setVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode | null>(
    null,
  );

  const handleMenuClick = (action: CustomAction<T>) => {
    const result = action.execOrRender(data);
    if (React.isValidElement(result)) {
      setDrawerContent(result);
      setVisible(true); // Open the drawer with the returned content
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
    setDrawerContent(null); // Clear the content when the drawer is closed
  };

  const items: MenuProps['items'] = actions?.map((action, index) => ({
    key: index.toString(),
    label: action.label,
    onClick: () => handleMenuClick(action),
  }));

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottom">
        <Button size="small" type={'default'} icon={<MoreOutlined />} />
      </Dropdown>
      <Drawer
        title="Details"
        open={visible}
        onClose={onDrawerClose}
        width="50%"
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
