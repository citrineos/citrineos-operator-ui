// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface EyeIconProps extends React.SVGProps<SVGSVGElement> {}

export const EyeIcon = ({
  width = 24,
  height = 24,
  ...props
}: EyeIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_124_795)">
      <path
        d="M1.82666 12.2703C1.82666 12.2703 5.82666 4.27026 12.8267 4.27026C19.8267 4.27026 23.8267 12.2703 23.8267 12.2703C23.8267 12.2703 19.8267 20.2703 12.8267 20.2703C5.82666 20.2703 1.82666 12.2703 1.82666 12.2703Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8267 15.2703C14.4835 15.2703 15.8267 13.9271 15.8267 12.2703C15.8267 10.6134 14.4835 9.27026 12.8267 9.27026C11.1698 9.27026 9.82666 10.6134 9.82666 12.2703C9.82666 13.9271 11.1698 15.2703 12.8267 15.2703Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_124_795">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(0.82666 0.270264)"
        />
      </clipPath>
    </defs>
  </svg>
);
