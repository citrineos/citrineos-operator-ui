// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface ArrowRightIconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowRightIcon = ({
  width = 24,
  height = 24,
  ...props
}: ArrowRightIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.5 18.2703L15.5 12.2703L9.5 6.27026"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
