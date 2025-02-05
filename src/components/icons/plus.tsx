export interface PlusIconProps extends React.SVGProps<SVGSVGElement> {}

export const PlusIcon = ({
  width = 24,
  height = 24,
  ...props
}: PlusIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.43994 3.55371V12.887"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.77319 8.2207H13.1065"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
