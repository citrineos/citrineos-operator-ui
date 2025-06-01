// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface HomeIconProps extends React.SVGProps<SVGSVGElement> {}

export const HomeIcon = ({
  width = 32,
  height = 32,
  ...props
}: HomeIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.5 13.5L16.5 6.5L25.5 13.5V24.5C25.5 25.0304 25.2893 25.5391 24.9142 25.9142C24.5391 26.2893 24.0304 26.5 23.5 26.5H9.5C8.96957 26.5 8.46086 26.2893 8.08579 25.9142C7.71071 25.5391 7.5 25.0304 7.5 24.5V13.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 26.5V16.5H19.5V26.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
