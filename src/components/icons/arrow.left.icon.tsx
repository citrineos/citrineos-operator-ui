// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface ArrowLeftIconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowLeftIcon = ({
  width = 24,
  height = 24,
  ...props
}: ArrowLeftIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.4448 6.27026L9.44482 12.2703L15.4448 18.2703"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
