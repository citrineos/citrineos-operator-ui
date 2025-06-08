// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ColorModeContext } from '../../contexts/color-mode';
import config from '@util/config';

export interface LogoProps {
  collapsed?: boolean;
}

const LOGO_URL = config.logoUrl;

export const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  const { collapsed = false } = props;
  const { mode } = useContext(ColorModeContext);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.img
        src={LOGO_URL}
        alt="Collapsed Logo"
        initial={{ scale: 0.2, opacity: 0, x: -10, left: 0 }}
        animate={{
          scale: collapsed ? 0.5 : 0.2,
          opacity: collapsed ? 1 : 0,
          x: collapsed ? '-50%' : -10,
          left: collapsed ? '50%' : 0,
        }}
        style={{
          position: 'absolute',
          height: '100%',
        }}
      />
      {!collapsed && (
        <img
          src={mode === 'light' ? '/logo-black.svg' : '/logo-white.svg'}
          style={{
            width: '80%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateY(-50%) translateX(-50%)',
          }}
        />
      )}
    </div>
  );
};
