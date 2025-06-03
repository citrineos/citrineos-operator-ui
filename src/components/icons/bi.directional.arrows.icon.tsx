// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface BiDirectionsArrowsIconProps
  extends React.SVGProps<SVGSVGElement> {}

export const BiDirectionsArrowsIcon = ({
  width = 32,
  height = 32,
  ...props
}: BiDirectionsArrowsIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.61145 11.8423L27.8823 11.8423"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.8947 6.85458L27.8824 11.8423L22.8947 16.83"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.3885 23.2571L4.11768 23.2571"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.10522 28.2449L4.11749 23.2571L9.10523 18.2694"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
