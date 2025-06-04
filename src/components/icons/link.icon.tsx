// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface LinkIconProps extends React.SVGProps<SVGSVGElement> {}

export const LinkIcon = ({
  width = 24,
  height = 24,
  ...props
}: LinkIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.5 13.2703V19.2703C18.5 19.8007 18.2893 20.3094 17.9142 20.6845C17.5391 21.0595 17.0304 21.2703 16.5 21.2703H5.5C4.96957 21.2703 4.46086 21.0595 4.08579 20.6845C3.71071 20.3094 3.5 19.8007 3.5 19.2703V8.27026C3.5 7.73983 3.71071 7.23112 4.08579 6.85605C4.46086 6.48098 4.96957 6.27026 5.5 6.27026H11.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 3.27026H21.5V9.27026"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 14.2703L21.5 3.27026"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
