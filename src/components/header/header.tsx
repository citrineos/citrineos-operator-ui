import { Layout as AntdLayout, Menu, Row, Switch, theme } from 'antd';
import React, { useContext, useMemo } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import './style.scss';
import { SearchIcon } from '../icons/search.icon';
import { AvatarIcon } from '../icons/avatar.icon';
import { useLocation, useNavigate } from 'react-router-dom';

const { useToken } = theme;

enum MenuSection {
  OVERVIEW = 'overview',
  LOCATIONS = 'locations',
}

export const Header: React.FC = () => {
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection: MenuSection = useMemo(() => {
    if (location.pathname.startsWith('/locations'))
      return MenuSection.LOCATIONS;
    return MenuSection.OVERVIEW;
  }, [location.pathname]);

  const menuItems = useMemo(() => {
    switch (activeSection) {
      case MenuSection.LOCATIONS:
        return [
          { key: '/locations', label: 'Locations' },
          { key: '/locations/map', label: 'Map View' },
          { key: '/charging-stations', label: 'Charging Stations' },
        ];
      case MenuSection.OVERVIEW:
      default:
        return [
          { key: '/overview', label: 'Overview' },
          { key: '/locations', label: 'Locations' },
          { key: '/authorizations', label: 'Authorizations' },
          { key: '/transactions', label: 'Sessions' },
        ];
    }
  }, [activeSection]);

  return (
    <AntdLayout.Header
      className="header"
      style={{ backgroundColor: token.colorBgElevated }}
    >
      <Row justify="space-between" style={{ width: '100%' }}>
        <Row style={{ flex: '1 1 auto' }}>
          <Menu
            style={{ width: '100%', borderBottom: 'none' }}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
          />
        </Row>

        <Row>
          <Switch
            className="switch"
            checkedChildren="🌛"
            unCheckedChildren="🔆"
            onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
            defaultChecked={mode === 'dark'}
          />
          <div className="search">
            <SearchIcon />
          </div>
          <div className="avatar">
            <AvatarIcon />
          </div>
        </Row>
      </Row>
    </AntdLayout.Header>
  );
};
