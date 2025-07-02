// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { motion } from 'framer-motion';
import { Flex } from 'antd';
import './style.scss';
import { SunIcon } from '../../icons/sun.icon';
import { MoonIcon } from '../../icons/moon.icon';

interface DarkModeSwitchProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <Flex
      className="dark-mode-switch"
      onClick={toggleDarkMode}
      align={'center'}
    >
      <Flex justify={'space-between'} className="icon-wrapper">
        <SunIcon className="icon" width={28} height={28} />
        <MoonIcon className="icon" width={28} height={28} />
      </Flex>
      <motion.div
        className="toggle"
        animate={{
          left: isDarkMode ? 'auto' : '4px',
          right: isDarkMode ? '4px' : 'auto',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </Flex>
  );
};
