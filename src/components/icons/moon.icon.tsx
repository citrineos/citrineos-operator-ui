// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface MoonIconProps extends React.SVGProps<SVGSVGElement> {}

export const MoonIcon = ({
  width = 24,
  height = 24,
  ...props
}: MoonIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.6746 13.6269C21.5168 15.3291 20.8755 16.9513 19.826 18.3037C18.7765 19.6561 17.3621 20.6827 15.7483 21.2635C14.1346 21.8442 12.3881 21.955 10.7134 21.583C9.03874 21.211 7.50502 20.3715 6.29174 19.1627C5.07847 17.9539 4.23582 16.4259 3.8624 14.7574C3.48898 13.0889 3.60024 11.349 4.18314 9.74121C4.76605 8.13342 5.79651 6.72428 7.15393 5.67867C8.51135 4.63305 10.1396 3.99422 11.8482 3.83691C10.8479 5.18518 10.3665 6.84636 10.4916 8.51833C10.6168 10.1903 11.3401 11.762 12.5301 12.9475C13.72 14.1331 15.2976 14.8537 16.9758 14.9784C18.654 15.1031 20.3214 14.6235 21.6746 13.6269Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
