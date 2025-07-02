// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface SearchIconProps extends React.SVGProps<SVGSVGElement> {}

export const SearchIcon = ({
  width = 24,
  height = 24,
  ...props
}: SearchIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.0064 19.04C16.4411 19.04 20.0362 15.4583 20.0362 11.04C20.0362 6.62176 16.4411 3.04004 12.0064 3.04004C7.57164 3.04004 3.97656 6.62176 3.97656 11.04C3.97656 15.4583 7.57164 19.04 12.0064 19.04Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.0436 21.0404L17.6774 16.6904"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
