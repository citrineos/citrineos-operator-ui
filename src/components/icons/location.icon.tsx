// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface LocationIconProps extends React.SVGProps<SVGSVGElement> {}

export const LocationIcon = ({
  width = 32,
  height = 32,
  ...props
}: LocationIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_173_1080)">
      <path
        d="M25.2784 14.5C25.2784 21.5 16.2784 27.5 16.2784 27.5C16.2784 27.5 7.27844 21.5 7.27844 14.5C7.27844 12.1131 8.22665 9.82387 9.91448 8.13604C11.6023 6.44821 13.8915 5.5 16.2784 5.5C18.6654 5.5 20.9546 6.44821 22.6424 8.13604C24.3302 9.82387 25.2784 12.1131 25.2784 14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2784 17.5C17.9353 17.5 19.2784 16.1569 19.2784 14.5C19.2784 12.8431 17.9353 11.5 16.2784 11.5C14.6216 11.5 13.2784 12.8431 13.2784 14.5C13.2784 16.1569 14.6216 17.5 16.2784 17.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_173_1080">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(4.27844 4.5)"
        />
      </clipPath>
    </defs>
  </svg>
);
