import { ThemeConfig } from 'antd';
import { merge } from 'lodash';

const sharedTheme: ThemeConfig = {
  cssVar: true,
  token: {
    fontFamily: `'Poppins', sans-serif`,
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
      colorPrimary: 'rgb(255,174,11)',
      colorPrimaryActive: 'rgb(227,137,0)',
      colorPrimaryHover: 'rgb(227,137,0)',
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
      itemSelectedColor: 'rgb(110,135,255)',
      horizontalItemSelectedColor: 'rgb(110,135,255)',
      darkItemSelectedColor: 'rgb(249,180,30)',
    },
    Switch: {
      colorPrimary: 'rgba(165,179,255,0.75)',
      colorPrimaryHover: 'rgb(165,178,255)',
      handleSize: 40,
      trackHeight: 46,
      trackMinWidth: 92,
    },
    Table: {
      rowHoverBg: 'rgb(243,245,255)',
      rowExpandedBg: 'rgb(255, 255, 255)',
      headerBg: 'rgb(243,245,255)',
      lineHeight: 2.5,
    },
    Tabs: {
      inkBarColor: 'rgb(255,174,11)',
      itemActiveColor: 'rgb(255,174,11)',
      itemHoverColor: 'rgb(255,174,11)',
      itemSelectedColor: 'rgb(255,174,11)',
    },
  },
};

export const lightTheme: ThemeConfig = merge({}, sharedTheme, {
  token: {
    colorBgLayout: '#ebebeb',
  },
  components: {
    Layout: {
      siderBg: 'rgb(255,255,255)',
    },
  },
});

console.log('lightTheme', lightTheme);

export const darkTheme: ThemeConfig = merge({}, sharedTheme, {
  components: {
    Layout: {
      siderBg: 'rgb(35,36,46)',
    },
  },
});
