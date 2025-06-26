// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface TrashIconProps extends React.SVGProps<SVGSVGElement> {}

export const TrashIcon = ({
  width = 24,
  height = 24,
  ...props
}: TrashIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.75732 6.27032H5.75732H21.7573"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.7573 6.27032V20.2703C19.7573 20.8008 19.5466 21.3095 19.1715 21.6845C18.7965 22.0596 18.2878 22.2703 17.7573 22.2703H7.75732C7.22689 22.2703 6.71818 22.0596 6.34311 21.6845C5.96804 21.3095 5.75732 20.8008 5.75732 20.2703V6.27032M8.75732 6.27032V4.27032C8.75732 3.73989 8.96804 3.23118 9.34311 2.85611C9.71818 2.48104 10.2269 2.27032 10.7573 2.27032H14.7573C15.2878 2.27032 15.7965 2.48104 16.1715 2.85611C16.5466 3.23118 16.7573 3.73989 16.7573 4.27032V6.27032"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.7573 11.2703V17.2703"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.7573 11.2703V17.2703"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
