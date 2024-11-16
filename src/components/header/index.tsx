import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';
import { useGetIdentity } from '@refinedev/core';
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  theme,
  Typography,
} from 'antd';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ColorModeContext } from '../../contexts/color-mode';

import { ChargingStationSelect } from '@util/renderUtil';
import { setCurrentValue } from '../../redux/selectedChargingStationSlice';

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const dispatch = useDispatch();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const onChange = (value: string) => {
    dispatch(setCurrentValue({ value }));
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0px 24px',
    height: '64px',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <ChargingStationSelect onChange={onChange} />

        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
          defaultChecked={mode === 'dark'}
        />
        <Space style={{ marginLeft: '8px' }} size="middle">
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
