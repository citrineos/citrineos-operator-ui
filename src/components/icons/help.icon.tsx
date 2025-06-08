// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface HelpIconProps extends React.SVGProps<SVGSVGElement> {}

export const HelpIcon = ({
  width = 24,
  height = 24,
  ...props
}: HelpIconProps) => (
  <div className="icon-button">
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.7734 21.9551C17.2963 21.9551 21.7734 17.4779 21.7734 11.9551C21.7734 6.43223 17.2963 1.95508 11.7734 1.95508C6.25059 1.95508 1.77344 6.43223 1.77344 11.9551C1.77344 17.4779 6.25059 21.9551 11.7734 21.9551Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.86353 8.95467C9.09863 8.28634 9.56268 7.72278 10.1735 7.3638C10.7843 7.00483 11.5024 6.87361 12.2007 6.99338C12.899 7.11316 13.5323 7.4762 13.9886 8.0182C14.4449 8.5602 14.6946 9.24619 14.6935 9.95467C14.6935 11.9547 11.6935 12.9547 11.6935 12.9547"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7734 16.9551H11.7834"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
