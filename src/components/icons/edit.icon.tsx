// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export interface EditIconProps extends React.SVGProps<SVGSVGElement> {}

export const EditIcon = ({
  width = 24,
  height = 24,
  ...props
}: EditIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.2313 4.33099H4.23132C3.70089 4.33099 3.19218 4.54171 2.81711 4.91678C2.44204 5.29185 2.23132 5.80056 2.23132 6.33099V20.331C2.23132 20.8614 2.44204 21.3701 2.81711 21.7452C3.19218 22.1203 3.70089 22.331 4.23132 22.331H18.2313C18.7618 22.331 19.2705 22.1203 19.6455 21.7452C20.0206 21.3701 20.2313 20.8614 20.2313 20.331V13.331"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.7313 2.83098C19.1291 2.43315 19.6687 2.20966 20.2313 2.20966C20.7939 2.20966 21.3335 2.43315 21.7313 2.83098C22.1291 3.2288 22.3526 3.76837 22.3526 4.33098C22.3526 4.89359 22.1291 5.43315 21.7313 5.83098L12.2313 15.331L8.23132 16.331L9.23132 12.331L18.7313 2.83098Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
