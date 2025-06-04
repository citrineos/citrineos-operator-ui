// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface NotificationIconProps extends React.SVGProps<SVGSVGElement> {}

export const NotificationIcon = ({
  width = 24,
  height = 24,
  ...props
}: NotificationIconProps) => (
  <div className="icon-button">
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.7734 8.46777C18.7734 6.87647 18.1413 5.35035 17.0161 4.22513C15.8909 3.09991 14.3647 2.46777 12.7734 2.46777C11.1821 2.46777 9.65602 3.09991 8.5308 4.22513C7.40558 5.35035 6.77344 6.87647 6.77344 8.46777C6.77344 15.4678 3.77344 17.4678 3.77344 17.4678H21.7734C21.7734 17.4678 18.7734 15.4678 18.7734 8.46777Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5035 21.4678C14.3276 21.7709 14.0753 22.0224 13.7717 22.1973C13.4681 22.3722 13.1238 22.4642 12.7735 22.4642C12.4231 22.4642 12.0788 22.3722 11.7752 22.1973C11.4716 22.0224 11.2193 21.7709 11.0435 21.4678"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
