// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface AvatarIconProps extends React.SVGProps<SVGSVGElement> {}

export const AvatarIcon = ({
  width = 24,
  height = 24,
  ...props
}: AvatarIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.2571 21.04V19.04C20.2571 17.9792 19.8357 16.9618 19.0855 16.2116C18.3354 15.4615 17.3179 15.04 16.2571 15.04H8.25708C7.19621 15.04 6.1788 15.4615 5.42865 16.2116C4.67851 16.9618 4.25708 17.9792 4.25708 19.04V21.04"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2571 11.04C14.4662 11.04 16.2571 9.24918 16.2571 7.04004C16.2571 4.8309 14.4662 3.04004 12.2571 3.04004C10.0479 3.04004 8.25708 4.8309 8.25708 7.04004C8.25708 9.24918 10.0479 11.04 12.2571 11.04Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
