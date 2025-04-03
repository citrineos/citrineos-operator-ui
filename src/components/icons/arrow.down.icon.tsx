export interface ArrowDownIconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowDownIcon = ({
  width = 24,
  height = 24,
  ...props
}: ArrowDownIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.23132 6.73029L8.23132 10.7303L12.2313 6.73029"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
