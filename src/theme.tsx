// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ThemeConfig } from 'antd';
import { merge } from 'lodash';

const sharedTheme: ThemeConfig = {
  cssVar: true,
  token: {
    fontFamily: `'Roobert', sans-serif`,
    fontWeightStrong: 900,
    sizeStep: 4,
    sizeUnit: 4,
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeLG: 18,
    fontSizeXL: 24,
    fontSizeHeading1: 48,
    fontSizeHeading2: 32,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    /* lineHeight: '22px',
    lineHeightSM: '1',
    lineHeightLG: '1',
    lineHeightHeading1: '1',
    lineHeightHeading2: '1',
    lineHeightHeading3: '1',
    lineHeightHeading4: '1',
    lineHeightHeading5: '1',*/
  },
  components: {
    Button: {
      controlHeight: 40,
      colorPrimary: 'var(--primary-color-1)',
      colorPrimaryActive: 'var(--logo-color-1)',
      colorPrimaryHover: 'var(--logo-color-1)',
      borderRadius: 8,
      paddingInline: 18,
    },
    Select: {
      controlHeight: 40,
    },
    Input: {
      controlHeight: 40,
    },
    InputNumber: {
      controlHeight: 40,
    },
    DatePicker: {
      controlHeight: 40,
    },
    Menu: {
      itemSelectedColor: 'var(--secondary-color-2)',
      horizontalItemSelectedColor: 'var(--secondary-color-2)',
      darkItemSelectedColor: 'var(--primary-color-1)',
      itemHeight: 50,
    },
    // Switch: {
    //   // todo make custom switch for dark/light mode
    //   colorPrimary: 'rgba(165,179,255,0.75)',
    //   colorPrimaryHover: 'rgb(165,178,255)',
    //   handleSize: 40,
    //   trackHeight: 46,
    //   trackMinWidth: 92,
    // },
    Table: {
      rowHoverBg: 'var(--secondary-color-0)',
      rowExpandedBg: '#FFFFFF',
      headerBg: 'var(--secondary-color-0)',
      lineHeight: 2.5,
    },
    Tabs: {
      inkBarColor: 'var(--primary-color-1)',
      itemActiveColor: 'var(--primary-color-1)',
      itemHoverColor: 'var(--primary-color-1)',
      itemSelectedColor: 'var(--primary-color-1)',
    },
  },
};

export const lightTheme: ThemeConfig = merge({}, sharedTheme, {
  token: {
    colorBgLayout: '#ebebeb',
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
    },
  },
});

export const darkTheme: ThemeConfig = merge({}, sharedTheme, {
  components: {
    Layout: {
      siderBg: '#202020',
    },
  },
});
