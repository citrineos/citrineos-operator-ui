// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface ChargingStationIconProps
  extends React.SVGProps<SVGSVGElement> {}

export const ChargingStationIcon = ({
  width = 32,
  height = 32,
  ...props
}: ChargingStationIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.0408 9.61276L13.0408 14.8792H19.0408L15.0408 20.1456"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="8.33105"
      y="5.49997"
      width="15.4196"
      height="18.8176"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8.40222 27.4999L23.7522 27.4999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
