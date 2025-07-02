// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface SunIconProps extends React.SVGProps<SVGSVGElement> {}

export const SunIcon = ({
  width = 24,
  height = 24,
  ...props
}: SunIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse cx="16.541" cy="16.8174" rx="16.0596" ry="16" fill="transparent" />
    <g clipPath="url(#clip0_473_2231)">
      <g clipPath="url(#clip1_473_2231)">
        <path
          d="M16.4962 21.8174C19.2576 21.8174 21.4962 19.5788 21.4962 16.8174C21.4962 14.056 19.2576 11.8174 16.4962 11.8174C13.7348 11.8174 11.4962 14.056 11.4962 16.8174C11.4962 19.5788 13.7348 21.8174 16.4962 21.8174Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.4962 5.81738V7.81738"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.4962 25.8174V27.8174"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.71619 9.03711L10.1362 10.4571"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.8562 23.1777L24.2762 24.5977"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.49622 16.8174H7.49622"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.4962 16.8174H27.4962"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.71619 24.5977L10.1362 23.1777"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.8562 10.4571L24.2762 9.03711"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_473_2231">
        <rect
          width="24.0895"
          height="24"
          fill="white"
          transform="translate(4.49622 4.81738)"
        />
      </clipPath>
      <clipPath id="clip1_473_2231">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(4.49622 4.81738)"
        />
      </clipPath>
    </defs>
  </svg>
);
