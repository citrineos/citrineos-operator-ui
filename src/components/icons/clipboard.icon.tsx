// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface ClipboardIconProps extends React.SVGProps<SVGSVGElement> {}

export const ClipboardIcon = ({
  width = 32,
  height = 32,
  ...props
}: ClipboardIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.375 8.83005H22.375C22.9054 8.83005 23.4141 9.04076 23.7892 9.41583C24.1643 9.79091 24.375 10.2996 24.375 10.83V24.83C24.375 25.3605 24.1643 25.8692 23.7892 26.2443C23.4141 26.6193 22.9054 26.83 22.375 26.83H10.375C9.84457 26.83 9.33586 26.6193 8.96079 26.2443C8.58571 25.8692 8.375 25.3605 8.375 24.83V10.83C8.375 10.2996 8.58571 9.79091 8.96079 9.41583C9.33586 9.04076 9.84457 8.83005 10.375 8.83005H12.375"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.375 6.83005H13.375C12.8227 6.83005 12.375 7.27776 12.375 7.83005V9.83005C12.375 10.3823 12.8227 10.83 13.375 10.83H19.375C19.9273 10.83 20.375 10.3823 20.375 9.83005V7.83005C20.375 7.27776 19.9273 6.83005 19.375 6.83005Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
